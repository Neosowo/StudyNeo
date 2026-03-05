/**
 * AudioPlayerContext — Global music queue & player engine
 * • YouTube videos AND playlists (via IFrame Player API loadPlaylist)
 * • SoundCloud tracks
 * • Likes system (sd_music_likes)
 */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

const AudioCtx = createContext({})
export function useAudioPlayer() { return useContext(AudioCtx) }

const QUEUE_KEY = 'sd_audio_queue'
const IDX_KEY = 'sd_audio_idx'
const LIKES_KEY = 'sd_music_likes'
const PLAYLISTS_KEY = 'sd_user_playlists'

function readLS(key, def) { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def } catch { return def } }

/* ── URL helpers ─────────────────────────────────────────────── */
export function extractYTVideoId(url) {
    for (const p of [/youtu\.be\/([^?&\n#]+)/, /[?&]v=([^?&#\n]+)/, /youtube\.com\/embed\/([^?&\n]+)/, /youtube\.com\/shorts\/([^?&\n]+)/]) {
        const m = url.match(p); if (m) return m[1]
    }
    return null
}
export function extractYTPlaylistId(url) {
    const m = url.match(/[?&]list=(PL[^?&#\n]+)/)
    return m ? m[1] : null
}
export function detectMusicPlatform(url) {
    if (!url) return null
    if (url.includes('youtu')) return 'youtube'
    if (url.includes('soundcloud')) return 'soundcloud'
    if (url.includes('spotify.com')) return 'spotify'
    return null
}

/* ── Option 2 Resolver: Direct Audio Stream (Piped Instances) ── */
async function fetchAudioStream(videoId) {
    const instances = [
        'pipedapi.kavin.rocks',
        'piped-api.lunar.icu',
        'pipedapi.colloquial.net',
        'piped-api.garudalinux.org'
    ];

    // Shuffle and try each instance
    const shuffled = [...instances].sort(() => Math.random() - 0.5);

    for (const host of shuffled) {
        try {
            const url = `https://${host}/streams/${videoId}`;
            // Directly fetch if possible, or via CORS proxy if needed
            let res = await fetch(url).catch(() => null);

            // Fallback to proxy if direct fetch fails (CORS)
            if (!res || !res.ok) {
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
                const proxyRes = await fetch(proxyUrl);
                if (!proxyRes.ok) continue;
                const data = await proxyRes.json();
                const json = JSON.parse(data.contents);
                const stream = json.audioStreams?.find(s => s.bitrate >= 128000) || json.audioStreams?.[0];
                if (stream?.url) return stream.url;
            } else {
                const json = await res.json();
                const stream = json.audioStreams?.find(s => s.bitrate >= 128000) || json.audioStreams?.[0];
                if (stream?.url) return stream.url;
            }
        } catch (e) {
            console.warn(`Piped host ${host} failed:`, e.message);
        }
    }
    return null;
}

/* ── Proxy Helpers (Cleaned & High Reliability) ───────────────── */
const PROXIES = [
    url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.cors.lol/?url=${encodeURIComponent(url)}`,
    url => `https://api.codetabs.com/v1/proxy?url=${encodeURIComponent(url)}`
]

async function fetchWithProxy(targetUrl) {
    let lastError = null
    const shuffled = [...PROXIES].sort(() => Math.random() - 0.5)

    for (const proxyFn of shuffled) {
        try {
            const proxyUrl = proxyFn(targetUrl)
            const res = await fetch(proxyUrl, {
                signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : null
            })
            // If proxy returns error but it's not a hard fail, we might want to try another
            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            let text = ""
            if (proxyUrl.includes('allorigins')) {
                const data = await res.json()
                text = data.contents
            } else {
                text = await res.text()
            }

            // Basic sanity check: if it's too small or contains "Bad Request", it's a fail
            if (!text || text.length < 150 || text.includes('Bad Request')) throw new Error('Invalid response')
            return text
        } catch (e) {
            lastError = e
            console.warn(`Proxy fail:`, e.message)
            continue
        }
    }
    throw lastError || new Error('All proxies failed')
}

/* ── Official Spotify API Helpers (No login required) ───────── */
const S_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const S_SEC = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

async function getSpotifyApiToken() {
    try {
        const cached = localStorage.getItem('sd_spotify_client_token')
        const expires = parseInt(localStorage.getItem('sd_spotify_client_expires') || '0')
        if (cached && Date.now() < expires) return cached

        const authUrl = 'https://accounts.spotify.com/api/token'
        const auth = btoa(`${S_ID}:${S_SEC}`)

        // Use proxies that are known to work with POST
        const tokenProxies = [
            `https://corsproxy.io/?${encodeURIComponent(authUrl)}`,
            `https://api.cors.lol/?url=${encodeURIComponent(authUrl)}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(authUrl)}` // Note: AllOrigins might fail POST
        ]

        for (const proxy of tokenProxies) {
            try {
                const res = await fetch(proxy, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'grant_type=client_credentials',
                    signal: AbortSignal.timeout ? AbortSignal.timeout(12000) : null
                })
                if (!res.ok) continue
                const data = await res.json()
                if (data.access_token) {
                    localStorage.setItem('sd_spotify_client_token', data.access_token)
                    localStorage.setItem('sd_spotify_client_expires', String(Date.now() + (data.expires_in - 60) * 1000))
                    return data.access_token
                }
            } catch (e) {
                console.warn(`Token request fail:`, e.message)
            }
        }
    } catch (e) {
        console.error('Master Spotify API failure:', e)
    }
    return null
}

// Global Spotify Fix
function getSpotifyEmbed(url) {
    try {
        const m = url.match(/spotify\.com\/(?:[a-zA-Z-]{2,10}\/)?(track|album|playlist)\/([a-zA-Z0-9]+)/)
        if (!m) return url.replace('open.spotify.com/', 'open.spotify.com/embed/')
        return `https://open.spotify.com/embed/${m[1]}/${m[2]}`
    } catch {
        return url.replace('open.spotify.com/', 'open.spotify.com/embed/')
    }
}

/* ── YouTube oEmbed metadata (no API key) ────────────────────── */
export async function fetchYTMeta(url) {
    try {
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
        if (!res.ok) throw new Error()
        const d = await res.json()
        const id = extractYTVideoId(url)
        return { title: d.title, author: d.author_name, thumbnail: id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null }
    } catch {
        const id = extractYTVideoId(url)
        return { title: null, author: 'YouTube', thumbnail: id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null }
    }
}

export async function fetchSpotifyMeta(url) {
    try {
        const token = await getSpotifyApiToken()
        if (token) {
            // Priority 1: Official API
            const m = url.match(/spotify\.com\/(?:[a-zA-Z-]+\/)?(track|album|playlist)\/([a-zA-Z0-9]+)/)
            if (m) {
                const [_, type, id] = m
                const res = await fetch(`https://api.spotify.com/v1/${type}s/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    return {
                        title: data.name,
                        author: data.artists?.[0]?.name || data.owner?.display_name || 'Spotify',
                        thumbnail: data.album?.images?.[0]?.url || data.images?.[0]?.url
                    }
                }
            }
        }

        // Priority 2: oEmbed via Proxy
        const oUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
        const jsonStr = await fetchWithProxy(oUrl)
        const d = JSON.parse(jsonStr)
        return {
            title: d.title,
            author: d.author_name || 'Spotify',
            thumbnail: d.thumbnail_url
        }
    } catch {
        return { title: 'Buscando título...', author: 'Spotify', thumbnail: null }
    }
}

/* ── Background metadata worker (Neobot-style) ──────────────── */
async function resolveTrackMeta(track, setQueue) {
    // Skip if we already have metadata or it's already a resolved YT track
    if (track.platform === 'youtube' && track.videoId && !track.loading) return

    try {
        let meta = null
        if (track.platform === 'youtube' && track.videoId) {
            meta = await fetchYTMeta(track.url)
        } else if (track.platform === 'spotify') {
            // Need metadata to have a valid search query later
            if (!track.author || track.title === 'Track de Spotify' || track.title === 'Track de Spotify') {
                meta = await fetchSpotifyMeta(track.url)
            }
        }

        if (meta) {
            setQueue(prev => prev.map(t => t.id === track.id ? { ...t, ...meta, loading: false } : t))
        } else {
            setQueue(prev => prev.map(t => t.id === track.id ? { ...t, loading: false } : t))
        }
    } catch (e) {
        setQueue(prev => prev.map(t => t.id === track.id ? { ...t, loading: false } : t))
    }
}

// Sequential resolver to avoid slamming the proxy
const metaQueue = []
let isProcessingMeta = false
async function processMetaQueue(setQueue) {
    if (isProcessingMeta || metaQueue.length === 0) return
    isProcessingMeta = true
    while (metaQueue.length > 0) {
        const track = metaQueue.shift()
        await resolveTrackMeta(track, setQueue)
        await new Promise(r => setTimeout(r, 600)) // 600ms delay between meta requests
    }
    isProcessingMeta = false
}

async function extractPlaylist(listId) {
    try {
        const url = `https://www.youtube.com/playlist?list=${listId}`
        const html = await fetchWithProxy(url)

        const videoIds = []
        const regex = /"videoId":"([^"]+)"/g
        let match
        while ((match = regex.exec(html)) !== null) {
            if (!videoIds.includes(match[1])) videoIds.push(match[1])
        }
        return videoIds.slice(0, 50) // Limit to 50 for performance
    } catch {
        return []
    }
}

/* ── Spotify Extractor (API + Scraper Fallback) ──────────────── */
async function extractSpotifyTracks(url) {
    try {
        const token = await getSpotifyApiToken()
        const m = url.match(/spotify\.com\/(?:[a-zA-Z-]+\/)?(playlist|album)\/([a-zA-Z0-9]+)/)

        if (token && m) {
            const [_, rawType, id] = m
            const type = rawType.toLowerCase() === 'playlist' ? 'playlists' : 'albums'
            // To get all tracks directly and avoid 404s on the root object, we request tracks
            const endpoint = `https://api.spotify.com/v1/${type}/${id}/tracks`

            const tryFetch = async (target) => {
                const res = await fetch(target, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (!res.ok) throw new Error()
                return await res.json()
            }

            try {
                const data = await tryFetch(endpoint).catch(() =>
                    tryFetch(`https://corsproxy.io/?${encodeURIComponent(endpoint)}`)
                )

                const items = data.items || []
                if (items.length > 0) {
                    return items.map(i => {
                        const t = i.track || i
                        if (!t || !t.id) return null
                        return {
                            url: `https://open.spotify.com/track/${t.id}`,
                            title: t.name || 'Pista de Spotify',
                            author: t.artists?.[0]?.name || 'Spotify',
                            thumbnail: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || null
                        }
                    }).filter(x => !!x)
                }
            } catch (e) { }
        }

        // Fallback to Pro Scraper if API fails or no token
        const embedUrl = getSpotifyEmbed(url)
        const html = await fetchWithProxy(embedUrl)

        // 1. Try internal Spotify Bridge Data (Best for Embeds)
        const resourceMatch = html.match(/<script id="resource" type="application\/json">([\s\S]*?)<\/script>/)
        if (resourceMatch) {
            try {
                const data = JSON.parse(resourceMatch[1])
                const rawTracks = data.tracks?.items || data.item?.tracks?.items || []
                if (rawTracks.length > 0) {
                    return rawTracks.map(i => {
                        const t = i.track || i
                        return {
                            url: `https://open.spotify.com/track/${t.id}`,
                            title: t.name,
                            author: t.artists?.[0]?.name || 'Spotify',
                            thumbnail: t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || null
                        }
                    })
                }
            } catch (e) { }
        }

        // 2. Bruteforce Regex (ID + Name pattern)
        const tracks = []
        const seen = new Set()
        const metaRegex = /"track":\{"id":"([a-zA-Z0-9]{22})","name":"([^"]+)"/g
        let match
        while ((match = metaRegex.exec(html)) !== null) {
            if (!seen.has(match[1])) {
                seen.add(match[1])
                tracks.push({ url: `https://open.spotify.com/track/${match[1]}`, title: match[2], author: 'Spotify' })
            }
        }

        if (tracks.length > 0) return tracks

        // 3. Ultra-fallback (IDs only)
        const idRegex = /\/track\/([a-zA-Z0-9]{22})/g
        while ((match = idRegex.exec(html)) !== null) {
            if (!seen.has(match[1])) {
                seen.add(match[1])
                tracks.push({ url: `https://open.spotify.com/track/${match[1]}`, title: 'Pista de Spotify', author: 'Spotify' })
            }
        }

        return tracks.slice(0, 100)
    } catch (e) {
        console.error('Expansion error:', e)
        return []
    }
}

async function searchYT(query, originalThumb = null) {
    try {
        const clean = query.replace(/\bspotify\b/gi, '').replace(/\bsoundcloud\b/gi, '').replace(/Resolviendo\.\.\./g, '').trim()
        if (!clean) return null
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}&sp=EgIQAQ%253D%253D`
        const html = await fetchWithProxy(url)
        const vidMatch = html.match(/"videoId":"([^"]+)"/)
        if (!vidMatch) return null
        const videoId = vidMatch[1]

        // Fetch YT meta but we will prefer the original thumbnail if provided
        const meta = await fetchYTMeta(`https://www.youtube.com/watch?v=${videoId}`)
        return {
            ...meta,
            videoId,
            platform: 'youtube',
            type: 'video',
            loading: false,
            // Keep original thumbnail (Spotify) if it exists, otherwise use YT's
            thumbnail: (originalThumb && !originalThumb.includes('ytimg.com')) ? originalThumb : meta.thumbnail
        }
    } catch (e) {
        console.error('Search error:', e)
        return null
    }
}

/* ── Provider ────────────────────────────────────────────────── */
export function AudioPlayerProvider({ children }) {
    const [queue, setQueueSt] = useState(() => readLS(QUEUE_KEY, []))
    const [idx, setIdxSt] = useState(() => {
        const q = readLS(QUEUE_KEY, [])
        const i = readLS(IDX_KEY, 0)
        return Math.min(i, Math.max(0, q.length - 1))
    })
    const [playing, setPlaying] = useState(false)
    const [volume, setVolumeSt] = useState(() => readLS('sd_audio_volume', 80))
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [loading, setLoading] = useState(false)
    const [liveTrackInfo, setLiveTrackInfo] = useState(null)
    const [adDetected, setAdDetected] = useState(false)  // True while an ad is playing
    // Likes
    const [likes, setLikesSt] = useState(() => readLS(LIKES_KEY, []))
    // Custom Playlists
    const [userPlaylists, setUserPlaylistsSt] = useState(() => readLS(PLAYLISTS_KEY, []))
    const [isNative, setIsNative] = useState(false) // Whether we are using the direct stream (no ads)

    const ytRef = useRef(null)         // Active YT.Player instance
    const shadowRef = useRef(null)     // Preload YT.Player (IFrame fallback)
    const audioRef = useRef(null)      // Native HTML5 Audio
    const ytReady = useRef(false)
    const progTimer = useRef(null)
    const infoTimer = useRef(null)
    const preloadHandled = useRef(null) // ID of track currently preloading
    const pendingRef = useRef(null)
    const currentIdxRef = useRef(idx)
    const intendedVideoId = useRef(null)  // The video we SHOULD be playing (for ad detection)
    const adMuted = useRef(false)          // Track if we muted because of an ad
    useEffect(() => { currentIdxRef.current = idx }, [idx])

    /* ── Persist helpers ─────────────────────────────────────── */
    const setQueue = useCallback(fn => setQueueSt(prev => {
        const next = typeof fn === 'function' ? fn(prev) : fn
        localStorage.setItem(QUEUE_KEY, JSON.stringify(next)); return next
    }), [])
    const setIdx = useCallback(fn => setIdxSt(prev => {
        const next = typeof fn === 'function' ? fn(prev) : fn
        localStorage.setItem(IDX_KEY, String(next)); return next
    }), [])
    const saveLikes = useCallback(next => { localStorage.setItem(LIKES_KEY, JSON.stringify(next)); return next }, [])
    const saveUserPlaylists = useCallback(next => { localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(next)); return next }, [])

    const current = queue[idx] ?? null

    /* ── Load YT IFrame API script ───────────────────────────── */
    useEffect(() => {
        if (window.YT?.Player) { ytReady.current = true; return }
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
        window.onYouTubeIframeAPIReady = () => {
            ytReady.current = true
            const p = pendingRef.current
            if (p) { pendingRef.current = null; _initPlayer(p) }
        }
    }, []) // eslint-disable-line

    /* ── Init / recreate the YT player ──────────────────────── */
    // payload: { type: 'video', videoId } | { type: 'playlist', playlistId }
    const _initPlayer = useCallback(payload => {
        if (!window.YT?.Player) return
        if (ytRef.current) {
            try {
                if (typeof ytRef.current.destroy === 'function') ytRef.current.destroy()
            } catch (e) { console.warn('YT destroy error:', e) }
            ytRef.current = null
        }
        setLoading(true); setLiveTrackInfo(null)

        const isPlaylist = payload.type === 'playlist'
        const playerVars = { autoplay: 1, controls: 0, playsinline: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, ...(isPlaylist ? { listType: 'playlist', list: payload.playlistId } : {}) }

        // Save the intended video ID for ad detection
        intendedVideoId.current = isPlaylist ? null : payload.videoId
        adMuted.current = false

        ytRef.current = new window.YT.Player('yt-hidden-player', {
            height: '1', width: '1',
            host: 'https://www.youtube-nocookie.com', // Privacy Enhanced Mode — reduces/eliminates ads
            videoId: isPlaylist ? '' : payload.videoId,
            playerVars,
            events: {
                onReady: e => {
                    e.target.setVolume(volume)
                    if (isPlaylist) e.target.loadPlaylist({ list: payload.playlistId, listType: 'playlist', index: 0 })
                    else e.target.playVideo()
                    setLoading(false); setPlaying(true)
                    setDuration(e.target.getDuration())
                    _startTimers()
                },
                onStateChange: e => {
                    const S = window.YT.PlayerState
                    if (e.data === S.PLAYING || e.data === S.BUFFERING) {
                        // Instant ad detection on every state change
                        const data = ytRef.current?.getVideoData?.()
                        const expected = intendedVideoId.current
                        if (expected && data?.video_id && data.video_id !== expected) {
                            // 🚫 AD DETECTED — mute instantly
                            try { ytRef.current.mute() } catch { }
                            adMuted.current = true
                            setAdDetected(true)
                            // Force cancel ad by reloading the real video
                            setTimeout(() => {
                                try {
                                    if (ytRef.current?.loadVideoById) {
                                        ytRef.current.loadVideoById(expected)
                                        ytRef.current.playVideo()
                                    }
                                } catch { }
                            }, 200)
                            return
                        }
                        // Real video playing
                        if (adMuted.current) {
                            try { ytRef.current.unMute(); ytRef.current.setVolume(volume) } catch { }
                            adMuted.current = false
                            setAdDetected(false)
                        }
                    }
                    if (e.data === S.PLAYING) { setPlaying(true); setLoading(false); _startTimers() }
                    if (e.data === S.PAUSED) { setPlaying(false); _stopTimers() }
                    if (e.data === S.BUFFERING) { setLoading(true) }
                    if (e.data === S.ENDED) {
                        if (!isPlaylist) { _stopTimers(); _advanceQueue() }
                    }
                },
                onError: () => { setLoading(false); _advanceQueue() }
            }
        })
    }, []) // Se quita 'volume' de las dependencias para evitar que el player se recree al mover el slider

    /* ── Volume Sync Effect ──────────────────────────────────── */
    useEffect(() => {
        if (ytRef.current && typeof ytRef.current.setVolume === 'function') {
            ytRef.current.setVolume(volume)
        }
    }, [volume])

    /* ── Progress + live track info timers ───────────────────── */
    const _startTimers = useCallback(() => {
        clearInterval(progTimer.current)
        clearInterval(infoTimer.current)

        progTimer.current = setInterval(() => {
            const p = ytRef.current; if (!p?.getCurrentTime) return
            const t = p.getCurrentTime(), d = p.getDuration() || 1
            setDuration(d); setProgress((t / d) * 100)

            // PRELOAD LOGIC: 30 seconds before end
            if (d > 0 && (d - t < 30) && !preloadHandled.current) {
                const q = readLS(QUEUE_KEY, [])
                const nextIdx = currentIdxRef.current + 1 < q.length ? currentIdxRef.current + 1 : 0
                const nextTrack = q[nextIdx]
                if (nextTrack && nextTrack.videoId && nextTrack.id !== currentIdxRef.current.id) {
                    _preloadNext(nextTrack)
                }
            }
        }, 1000)

        // Ad detection + auto-skip/mute
        infoTimer.current = setInterval(() => {
            const p = ytRef.current; if (!p?.getVideoData) return
            const data = p.getVideoData()
            if (!data?.video_id) return

            const expected = intendedVideoId.current
            const actual = data.video_id
            const isAd = expected && actual && actual !== expected

            if (isAd) {
                // --- AD DETECTED ---
                setAdDetected(true)
                if (!adMuted.current) {
                    // 1. Mute immediately so user doesn't hear it
                    try { p.mute() } catch { }
                    adMuted.current = true
                }
                // 2. Try to seek to the end to force skip
                try {
                    const dur = p.getDuration()
                    if (dur > 0) p.seekTo(dur, true)
                } catch { }
            } else {
                // --- REAL VIDEO ---
                setAdDetected(false)
                if (adMuted.current) {
                    // Restore volume after ad
                    try { p.unMute(); p.setVolume(volume) } catch { }
                    adMuted.current = false
                }
                // Update live track info for playlists
                if (!expected) {
                    intendedVideoId.current = actual // lock in for playlists
                }
                setLiveTrackInfo({
                    videoId: actual,
                    title: data.title,
                    author: data.author || '',
                    thumbnail: `https://img.youtube.com/vi/${actual}/mqdefault.jpg`,
                })
            }
        }, 500) // Check every 500ms for fast ad detection
    }, [volume])
    const _stopTimers = useCallback(() => { clearInterval(progTimer.current); clearInterval(infoTimer.current) }, [])

    /* ── Shadow Preloader ──────────────────────────────────── */
    const _preloadNext = useCallback(track => {
        if (!track.videoId || preloadHandled.current === track.id) return
        preloadHandled.current = track.id
        console.log('🕒 Shadow Preload starting for:', track.title)

        if (shadowRef.current) {
            try { shadowRef.current.destroy() } catch (e) { }
            shadowRef.current = null
        }

        shadowRef.current = new window.YT.Player('yt-shadow-player', {
            height: '1', width: '1',
            host: 'https://www.youtube-nocookie.com',
            videoId: track.videoId,
            playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1 },
            events: {
                onReady: e => {
                    e.target.mute()
                    e.target.playVideo()
                },
                onStateChange: e => {
                    // Let the ad play in shadow if any
                    const S = window.YT.PlayerState
                    if (e.data === S.PLAYING) {
                        console.log('✅ Shadow ready (ad passed or no ad)')
                    }
                }
            }
        })
    }, [])

    /* ── Advance to next queue item ──────────────────────────── */
    const _advanceQueue = useCallback(() => {
        setIdxSt(prev => {
            const next = prev + 1 < readLS(QUEUE_KEY, []).length ? prev + 1 : 0
            localStorage.setItem(IDX_KEY, String(next))
            // Ensure next is resolved before playing if possible
            setTimeout(() => _playAt(next), 100)
            return next
        })
    }, []) // eslint-disable-line

    const _resolveFullTrack = useCallback(async (track) => {
        if (!track) return null
        let updated = { ...track }

        // 1. Meta resolution (if needed)
        if (updated.platform === 'spotify') {
            if (!updated.author || updated.author === 'Spotify' || updated.title.includes('Buscando')) {
                const meta = await fetchSpotifyMeta(updated.url)
                if (meta.title && !meta.title.includes('Resolviendo')) {
                    updated = { ...updated, ...meta }
                }
            }
        }

        // 2. YouTube Search (if needed)
        if ((updated.platform === 'spotify' || updated.platform === 'soundcloud') && !updated.videoId) {
            let query = ""
            if (updated.platform === 'spotify') {
                query = `${updated.title} ${updated.author}`.replace('Resolviendo...', '').trim()
            } else {
                // For soundcloud, use the title derived from URL if nothing else
                query = updated.title.replace('Resolviendo...', '').trim()
            }

            if (query) {
                const yt = await searchYT(query, updated.thumbnail)
                if (yt) {
                    updated = { ...updated, ...yt, loading: false }
                    // Persist the resolution to the main queue
                    setQueue(prev => prev.map(t => t.id === updated.id ? updated : t))
                }
            }
        }
        return updated
    }, [setQueue])

    /* ── Play queue item at index ────────────────────────────── */
    const _playAt = useCallback(async newIdx => {
        const q = readLS(QUEUE_KEY, [])
        let track = q[newIdx]; if (!track) return

        setIdx(newIdx); setProgress(0); setDuration(0); setLiveTrackInfo(null)
        setLoading(true)

        // Resolve current track if not ready (Spotify or SoundCloud bot-style)
        if ((track.platform === 'spotify' || track.platform === 'soundcloud') && !track.videoId) {
            // Check internet connection
            if (!navigator.onLine) {
                console.warn('No internet: skipping audio resolution')
                setLoading(false)
                return
            }
            track = await _resolveFullTrack(track)
        }

        const videoId = track.videoId || (track.platform === 'youtube' ? extractYTVideoId(track.url) : null)

        // --- Try Option 2: Direct Audio Stream (No Ads) ---
        if (videoId) {
            const streamUrl = await fetchAudioStream(videoId)
            if (streamUrl) {
                console.log('💎 Option 2: Direct Stream active (Zero Ads)')
                setIsNative(true)
                if (ytRef.current) { try { ytRef.current.stopVideo() } catch (e) { } }

                const audio = audioRef.current
                if (audio) {
                    audio.src = streamUrl
                    audio.volume = volume / 100
                    audio.load()
                    audio.play().catch(e => console.error('Play error:', e))
                    setLoading(false); setPlaying(true)
                    _startTimers()
                }
                return
            }
        }

        // --- Fallback to IFrame (Previous system with bypasses) ---
        console.warn('⚠️ Option 2 failed. Falling back to IFrame Player.')
        setIsNative(false)
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = "" }

        // AUTO-PRELOAD: Resolve the NEXT track in background
        const nextIdx = newIdx + 1 < q.length ? newIdx + 1 : 0
        const nextTrack = q[nextIdx]
        if (nextTrack && (nextTrack.platform === 'spotify' || nextTrack.platform === 'soundcloud') && !nextTrack.videoId && navigator.onLine) {
            // FIRE AND FORGET - don't await, just let it resolve in background
            _resolveFullTrack(nextTrack).catch(() => { })
        }

        // If we have a shadow player ready for this track, SWAP THEM
        if (shadowRef.current && preloadHandled.current === track.id) {
            console.log('⚡ Swapping Shadow to Active')
            if (ytRef.current) {
                try { ytRef.current.destroy() } catch (e) { }
            }
            // Move shadow to ytRef
            ytRef.current = shadowRef.current
            shadowRef.current = null
            preloadHandled.current = null

            // Unmute and sync volume
            ytRef.current.unMute()
            ytRef.current.setVolume(volume)
            setLoading(false); setPlaying(true)
            _startTimers()
            return
        }

        preloadHandled.current = null
        if (track && (track.videoId || track.platform === 'youtube')) {
            const payload = track.type === 'playlist'
                ? { type: 'playlist', playlistId: track.playlistId }
                : { type: 'video', videoId: track.videoId }
            if (ytReady.current) _initPlayer(payload)
            else pendingRef.current = payload
        } else if (track && track.platform === 'soundcloud' && !track.videoId) {
            // Fallback for soundcloud if resolution failed or no internet
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [setIdx, _initPlayer, _resolveFullTrack])

    /* ── Controls ────────────────────────────────────────────── */
    const play = useCallback(() => {
        if (isNative) {
            audioRef.current?.play()
        } else {
            ytRef.current?.playVideo()
        }
        setPlaying(true)
    }, [isNative])

    const pause = useCallback(() => {
        if (isNative) {
            audioRef.current?.pause()
        } else {
            ytRef.current?.pauseVideo()
        }
        setPlaying(false)
    }, [isNative])

    const togglePlay = useCallback(() => {
        if (!current) return
        if (isNative) {
            playing ? audioRef.current?.pause() : audioRef.current?.play()
            setPlaying(!playing)
            return
        }
        if (!ytRef.current) { _playAt(idx); return }
        playing ? pause() : play()
    }, [current, playing, idx, _playAt, play, pause, isNative])

    const nextTrack = useCallback(() => {
        const q = readLS(QUEUE_KEY, [])
        const cur = currentIdxRef.current
        if (!isNative && q[cur]?.type === 'playlist' && ytRef.current?.nextVideo) {
            ytRef.current.nextVideo(); return
        }
        const next = cur + 1 < q.length ? cur + 1 : 0
        setIdx(next); setTimeout(() => _playAt(next), 50)
    }, [setIdx, _playAt, isNative])

    const prevTrack = useCallback(() => {
        const q = readLS(QUEUE_KEY, [])
        const cur = currentIdxRef.current
        if (!isNative && q[cur]?.type === 'playlist' && ytRef.current?.previousVideo) {
            ytRef.current.previousVideo(); return
        }

        // Time logic for "restart track" vs "previous track"
        const time = isNative ? audioRef.current?.currentTime : ytRef.current?.getCurrentTime()
        if (time > 3) {
            if (isNative) audioRef.current.currentTime = 0
            else ytRef.current.seekTo(0, true)
            return
        }

        const prev = cur > 0 ? cur - 1 : q.length - 1
        setIdx(prev); setTimeout(() => _playAt(prev), 50)
    }, [setIdx, _playAt, isNative])

    const seek = useCallback(pct => {
        if (isNative && audioRef.current) {
            audioRef.current.currentTime = (pct / 100) * audioRef.current.duration
            setProgress(pct)
            return
        }
        const p = ytRef.current; if (!p) return
        p.seekTo((pct / 100) * p.getDuration(), true); setProgress(pct)
    }, [isNative])

    const setVolume = useCallback(v => {
        setVolumeSt(v)
        localStorage.setItem('sd_audio_volume', String(v))
        if (isNative && audioRef.current) {
            audioRef.current.volume = v / 100
        }
        if (ytRef.current && typeof ytRef.current.setVolume === 'function') {
            ytRef.current.setVolume(v)
        }
    }, [isNative])

    /* ── Queue management ────────────────────────────────────── */
    const addTrack = useCallback(async rawUrl => {
        const url = rawUrl.trim()
        const platform = detectMusicPlatform(url)
        if (!platform) return { ok: false, error: 'URL no válida.' }

        // 1. Check for playlist
        if (platform === 'youtube') {
            const listId = extractYTPlaylistId(url)
            if (listId) {
                const ids = await extractPlaylist(listId)
                if (ids.length > 0) {
                    const tracks = ids.map(vidId => ({
                        id: Math.random().toString(36).substr(2, 9),
                        url: `https://youtube.com/watch?v=${vidId}`,
                        platform: 'youtube',
                        type: 'video',
                        videoId: vidId,
                        title: 'Cargando playlist...',
                        loading: true
                    }))
                    setQueue(prev => {
                        const next = [...prev, ...tracks]
                        if (prev.length === 0) setTimeout(() => _playAt(0), 100)
                        return next
                    })
                    // Add to sequential meta queue
                    metaQueue.push(...tracks)
                    processMetaQueue(setQueue)
                    return { ok: true, count: tracks.length }
                }
            }

            const videoId = extractYTVideoId(url)
            if (videoId) {
                const track = {
                    id: Math.random().toString(36).substr(2, 9),
                    url, platform: 'youtube', type: 'video', videoId,
                    title: 'Cargando...', loading: true
                }
                setQueue(prev => {
                    const next = [...prev, track]
                    if (prev.length === 0) setTimeout(() => _playAt(0), 100)
                    return next
                })
                metaQueue.push(track)
                processMetaQueue(setQueue)
                return { ok: true, track }
            }
        } else if (platform === 'spotify') {
            const isColl = url.includes('/playlist/') || url.includes('/album/')
            if (isColl) {
                const tracksData = await extractSpotifyTracks(url)
                if (tracksData.length > 0) {
                    const tracks = tracksData.map(t => {
                        // If we already have real title+author from Spotify API, don't show loading spinner
                        const hasRealMeta = t.title && t.title !== 'Pista de Spotify' && t.author && t.author !== 'Spotify'
                        return {
                            id: Math.random().toString(36).substr(2, 9),
                            url: t.url,
                            platform: 'spotify',
                            type: 'spotify',
                            title: t.title,
                            author: t.author,
                            thumbnail: t.thumbnail || null,
                            // loading=false means: title/author shown immediately
                            // ytPending=true means: still needs YouTube videoId resolution (happens at play time)
                            loading: !hasRealMeta,
                            ytPending: true
                        }
                    })
                    setQueue(prev => {
                        const next = [...prev, ...tracks]
                        if (prev.length === 0) setTimeout(() => _playAt(0), 100)
                        return next
                    })
                    // Only queue meta-resolution for tracks that still need title/author
                    const needsMeta = tracks.filter(t => t.loading)
                    if (needsMeta.length > 0) {
                        metaQueue.push(...needsMeta)
                        processMetaQueue(setQueue)
                    }
                    return { ok: true, count: tracks.length }
                } else {
                    return { ok: false, error: 'No se pudieron extraer canciones. ¿La lista es pública?' }
                }
            }

            // Single Spotify track: fetch metadata immediately so we can show title/author right away
            const singleMeta = await fetchSpotifyMeta(url).catch(() => null)
            const hasRealSingleMeta = singleMeta?.title && !singleMeta.title.includes('Buscando')
            const track = {
                id: Math.random().toString(36).substr(2, 9),
                url, platform: 'spotify', type: 'spotify',
                title: hasRealSingleMeta ? singleMeta.title : 'Buscando metadata...',
                author: hasRealSingleMeta ? singleMeta.author : '',
                thumbnail: singleMeta?.thumbnail || null,
                loading: !hasRealSingleMeta,
                ytPending: true
            }
            setQueue(prev => {
                const next = [...prev, track]
                if (prev.length === 0) setTimeout(() => _playAt(0), 100)
                return next
            })
            if (!hasRealSingleMeta) {
                metaQueue.push(track)
                processMetaQueue(setQueue)
            }
            return { ok: true, track }
        } else if (platform === 'soundcloud') {
            const track = {
                id: Math.random().toString(36).substr(2, 9),
                url, platform: 'soundcloud', type: 'soundcloud',
                title: url.split('/').pop()?.split('?')[0]?.replace(/[-_]/g, ' ') || 'Cargando...',
                author: 'SoundCloud',
                loading: false,
                ytPending: true
            }
            setQueue(prev => {
                const next = [...prev, track]
                if (prev.length === 0) setTimeout(() => _playAt(0), 100)
                return next
            })
            return { ok: true, track }
        }

        return { ok: false, error: 'No se pudo procesar el link.' }
    }, [setQueue, _playAt])

    const _addSingle = useCallback(track => {
        let wasEmpty = false
        setQueue(prev => {
            if (prev.length === 0) wasEmpty = true
            return [...prev, track]
        })
        if (wasEmpty) setTimeout(() => _playAt(0), 120)
        return track
    }, [setQueue, _playAt])

    const removeTrack = useCallback(id => setQueue(prev => prev.filter(t => t.id !== id)), [setQueue])

    const clearQueue = useCallback(() => {
        try { ytRef.current?.stopVideo() } catch { }
        setPlaying(false); setProgress(0); setLiveTrackInfo(null)
        setQueue([]); setIdx(0); _stopTimers()
    }, [setQueue, setIdx, _stopTimers])

    const playTrackNow = useCallback(trackId => {
        const q = readLS(QUEUE_KEY, [])
        const i = q.findIndex(t => t.id === trackId)
        if (i >= 0) _playAt(i)
    }, [_playAt])

    /* ── Likes ───────────────────────────────────────────────── */
    const isLiked = useCallback(id => likes.some(l => l.id === id), [likes])
    const toggleLike = useCallback(track => {
        setLikesSt(prev => {
            const already = prev.some(l => l.id === track.id)
            const next = already ? prev.filter(l => l.id !== track.id) : [...prev, { ...track, likedAt: Date.now() }]
            return saveLikes(next)
        })
    }, [saveLikes])
    const removeLike = useCallback(id => {
        setLikesSt(prev => saveLikes(prev.filter(l => l.id !== id)))
    }, [saveLikes])

    /* ── Custom Playlists ────────────────────────────────────── */
    const createPlaylist = useCallback(name => {
        if (!name.trim()) return
        const newPl = { id: Date.now().toString(), name: name.trim(), tracks: [], createdAt: Date.now() }
        setUserPlaylistsSt(prev => saveUserPlaylists([...prev, newPl]))
    }, [saveUserPlaylists])

    const deletePlaylist = useCallback(id => {
        setUserPlaylistsSt(prev => saveUserPlaylists(prev.filter(p => p.id !== id)))
    }, [saveUserPlaylists])

    const addToPlaylist = useCallback((playlistId, track) => {
        setUserPlaylistsSt(prev => saveUserPlaylists(prev.map(p => {
            if (p.id !== playlistId) return p
            if (p.tracks.some(t => t.url === track.url)) return p // No duplicates
            return { ...p, tracks: [...p.tracks, { ...track, addedAt: Date.now() }] }
        })))
    }, [saveUserPlaylists])

    const removeFromPlaylist = useCallback((playlistId, trackId) => {
        setUserPlaylistsSt(prev => saveUserPlaylists(prev.map(p => {
            if (p.id !== playlistId) return p
            return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
        })))
    }, [saveUserPlaylists])

    const playPlaylist = useCallback(playlistId => {
        const pl = userPlaylists.find(p => p.id === playlistId)
        if (!pl || pl.tracks.length === 0) return
        setQueue(pl.tracks)
        setIdx(0)
        setTimeout(() => _playAt(0), 150)
    }, [userPlaylists, setQueue, setIdx, _playAt])

    const forceSkipAd = useCallback(() => {
        const expected = intendedVideoId.current
        if (expected && ytRef.current?.loadVideoById) {
            try {
                ytRef.current.loadVideoById(expected)
                ytRef.current.playVideo()
                setAdDetected(false)
            } catch (e) { }
        }
    }, [])

    /* ── Computed "displayCurrent" — merges queue info + live playlist info ── */
    const displayCurrent = current
        ? (current.type === 'playlist' && liveTrackInfo
            ? { ...current, ...liveTrackInfo }   // live data overrides static
            : current)
        : null

    return (
        <AudioCtx.Provider value={{
            queue, current: displayCurrent, rawCurrent: current, idx, playing,
            volume, progress, duration, loading, liveTrackInfo, adDetected,
            play, pause, togglePlay, nextTrack, prevTrack, seek, setVolume, forceSkipAd,
            addTrack, removeTrack, clearQueue, playTrackNow,
            likes, isLiked, toggleLike, removeLike,
            userPlaylists, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, playPlaylist,
        }}>
            <div style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
                <div id="yt-hidden-player" />
                <div id="yt-shadow-player" />
                <audio
                    ref={audioRef}
                    id="native-audio-player"
                    onTimeUpdate={() => {
                        if (!isNative) return
                        const a = audioRef.current
                        if (a) {
                            setProgress((a.currentTime / a.duration) * 100)
                            setDuration(a.duration)
                        }
                    }}
                    onEnded={() => {
                        if (isNative) _advanceQueue()
                    }}
                />
            </div>
            {children}
        </AudioCtx.Provider>
    )
}
