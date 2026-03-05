import { useState, useEffect } from 'react'
import {
    Music, Link, Play, Pause, ExternalLink, Zap, Lock,
    RefreshCw, X, SkipForward, SkipBack, Heart, Trash2,
    Shuffle, Volume2, ChevronRight, List, Loader2, CheckCircle,
    Minimize2, AlertCircle, LogOut
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'
import { useAudioPlayer } from '../context/AudioPlayerContext'
import {
    connectSpotify, getSpotifyToken, disconnectSpotify,
    fetchSpotifyProfile, fetchSpotifyPlaylists, refreshSpotifyToken,
    getCurrentRedirectUri
} from '../../utils/spotifyAuth'
import { useWidgets } from '../components/FloatingWidgets'

/* ─── Curated Spotify playlists (as Spotify URLs → resolved via bot-style) ── */
const PRESETS = [
    { label: 'Lo-Fi Beats', emoji: '☕', url: 'https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn', desc: 'Chill y tranquilo para estudiar' },
    { label: 'Deep Focus', emoji: '🧠', url: 'https://open.spotify.com/playlist/37i9dQZF1DX9sQDbOMReFI', desc: 'Concentración máxima' },
    { label: 'Brain Food', emoji: '⚡', url: 'https://open.spotify.com/playlist/37i9dQZF1DWXLeA8Omikj7', desc: 'Instrumentales para pensar' },
    { label: 'Peaceful Piano', emoji: '🎹', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', desc: 'Piano suave y relajante' },
    { label: 'Chill Hits', emoji: '🌊', url: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6', desc: 'Ambiente chill para trabajar' },
    { label: 'Classical Focus', emoji: '🎻', url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', desc: 'Clásicos para potenciar la memoria' },
]

/* ─── SoundCloud embed (unchanged, only used for SC urls) ─── */
function SCEmbed({ url }) {
    const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%231db954&auto_play=true&show_user=true`
    return (
        <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
            <iframe width="100%" height="166" src={src} allow="autoplay"
                title="SoundCloud" style={{ display: 'block', border: 'none' }} />
        </div>
    )
}

/* ─── Mini Now Playing Card ─── */
function NowPlayingCard({ current, playing, onToggle, onNext, onPrev, progress, duration, onSeek, volume, onVolume, adDetected, onForceSkipAd }) {
    if (!current) return null
    const thumb = current.thumbnail || `https://img.youtube.com/vi/${current.videoId}/mqdefault.jpg`
    const fmtTime = s => { const t = Math.round(s || 0); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}` }
    const elapsed = duration ? (progress / 100) * duration : 0

    return (
        <div style={{
            background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))',
            borderRadius: '18px', border: '1.5px solid var(--border-subtle)',
            padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
            {/* Track info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                        src={thumb}
                        alt=""
                        style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                    {current.loading && (
                        <div style={{ position: 'absolute', inset: 0, background: '#0008', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Loader2 size={22} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {adDetected ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: '#ff4b2b', borderRadius: '8px', color: 'white', animation: 'pulse 2s infinite' }}>
                            <Zap size={13} fill="white" />
                            <p style={{ fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.02em' }}>ANUNCIO BLOQUEADO</p>
                        </div>
                    ) : (
                        <>
                            <p style={{ fontWeight: 900, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>
                                {current.title || 'Cargando…'}
                            </p>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {current.author || current.uploader || ''}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {adDetected && (
                <button
                    onClick={onForceSkipAd}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <SkipForward size={14} fill="white" /> Saltar anuncio manualmente
                </button>
            )}

            {/* Progress bar */}
            <div>
                <div
                    style={{ height: '5px', background: 'var(--bg-hover-2, #ffffff18)', borderRadius: '9999px', cursor: 'pointer', overflow: 'hidden' }}
                    onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const pct = ((e.clientX - rect.left) / rect.width) * 100
                        onSeek(Math.max(0, Math.min(100, pct)))
                    }}
                >
                    <div style={{ height: '100%', width: `${progress || 0}%`, background: 'linear-gradient(90deg, var(--accent), #1db954)', transition: 'width 0.8s linear', borderRadius: '9999px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 700 }}>{fmtTime(elapsed)}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 700 }}>{fmtTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
                <button onClick={onPrev} style={ctrlBtn}><SkipBack size={18} /></button>
                <button onClick={onToggle} style={{ ...ctrlBtn, width: '52px', height: '52px', background: 'var(--accent)', color: 'white', borderRadius: '50%', border: 'none' }}>
                    {playing ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '2px' }} />}
                </button>
                <button onClick={onNext} style={ctrlBtn}><SkipForward size={18} /></button>
            </div>

            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={14} color="var(--text-4)" style={{ flexShrink: 0 }} />
                <input type="range" min={0} max={100} value={volume}
                    onChange={e => onVolume(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 700, width: '34px', textAlign: 'right' }}>{volume}%</span>
            </div>
        </div>
    )
}

const ctrlBtn = {
    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
    borderRadius: '50%', width: '44px', height: '44px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text-1)'
}

/* ─── Queue Row ─── */
function QueueRow({ track, isCurrent, onPlay, onRemove, isLiked, onLike }) {
    const thumb = track.thumbnail || (track.videoId ? `https://img.youtube.com/vi/${track.videoId}/mqdefault.jpg` : null)
    // loading = true → still fetching Spotify title/author
    // ytPending = true (& loading=false) → has Spotify title, just needs YT videoId at play time
    const isMetaLoading = track.loading
    const isYTPending = !track.loading && track.platform === 'spotify' && !track.videoId

    return (
        <div
            onClick={onPlay}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 12px', borderRadius: '10px', cursor: 'pointer',
                background: isCurrent ? 'var(--accent-dim, #6c63ff18)' : 'transparent',
                border: isCurrent ? '1px solid var(--accent-border, #6c63ff33)' : '1px solid transparent',
                transition: 'all 0.15s'
            }}
            onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent' }}
        >
            {thumb
                ? <img src={thumb} alt="" style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isMetaLoading
                        ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        : <Music size={14} color="var(--text-4)" />}
                </div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isCurrent ? 'var(--accent)' : 'var(--text-1)' }}>
                    {isMetaLoading ? '⏳ Cargando…' : (track.title || 'Desconocido')}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {track.author || ''}
                </p>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button onClick={onLike} title={isLiked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#e74c3c' : 'var(--text-4)', display: 'flex', padding: '4px' }}>
                    <Heart size={13} fill={isLiked ? '#e74c3c' : 'none'} />
                </button>
                <button onClick={onRemove} title="Quitar de la cola"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', padding: '4px' }}>
                    <X size={13} />
                </button>
            </div>
        </div>
    )
}

/* ─── Main export ─────────────────────────────────────────── */
export default function MusicPlayer() {
    const { isPro } = useProContext()
    const { openWidget } = useWidgets()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [tab, setTab] = useState('presets')
    const [inputUrl, setInputUrl] = useState('')
    const [history, setHistory] = useLocalStorage('sd_music_history', [])
    const [loadingPreset, setLoadingPreset] = useState(null)
    const [loadingUrl, setLoadingUrl] = useState(false)
    const [feedbackMsg, setFeedbackMsg] = useState(null) // { ok, text }
    const [spotifyToken, setSpotifyToken] = useState(() => getSpotifyToken())
    const [spotifyProfile, setSpotifyProfile] = useState(null)
    const [spotifyPlaylists, setSpotifyPlaylists] = useState([])
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [connectError, setConnectError] = useState(null)
    const [showQueue, setShowQueue] = useState(false)

    const {
        queue, current, idx, playing, volume, progress, duration,
        togglePlay, nextTrack, prevTrack, seek, setVolume,
        addTrack, removeTrack, clearQueue, playTrackNow,
        isLiked, toggleLike, adDetected, forceSkipAd
    } = useAudioPlayer()

    /* ── Spotify connect ── */
    useEffect(() => {
        const token = getSpotifyToken()
        if (!token) return
        setSpotifyToken(token)
        setLoadingProfile(true)
        Promise.all([fetchSpotifyProfile(token), fetchSpotifyPlaylists(token)])
            .then(([profile, lists]) => { if (profile) setSpotifyProfile(profile); setSpotifyPlaylists(lists || []) })
            .finally(() => setLoadingProfile(false))
    }, [])

    const handleConnect = async () => {
        setConnecting(true); setConnectError(null)
        try {
            const result = await connectSpotify()
            if (result?.ok) {
                const token = getSpotifyToken()
                setSpotifyToken(token)
                if (token) {
                    const [profile, lists] = await Promise.all([fetchSpotifyProfile(token), fetchSpotifyPlaylists(token)])
                    if (profile) setSpotifyProfile(profile)
                    setSpotifyPlaylists(lists || [])
                }
            } else { setConnectError(result?.error || 'Error al conectar') }
        } catch (e) { setConnectError(e.message) }
        finally { setConnecting(false) }
    }

    const handleDisconnect = () => {
        disconnectSpotify(); setSpotifyToken(null); setSpotifyProfile(null); setSpotifyPlaylists([])
    }

    const showFeedback = (ok, text) => {
        setFeedbackMsg({ ok, text })
        setTimeout(() => setFeedbackMsg(null), 4000)
    }

    /* ── Load a preset (Spotify playlist URL) → resolve via AudioContext ── */
    const loadPreset = async (preset) => {
        if (loadingPreset === preset.label) return
        setLoadingPreset(preset.label)
        clearQueue()
        const res = await addTrack(preset.url)
        if (res?.ok) {
            showFeedback(true, `✅ Cargando ${preset.label} · ${res.count} canciones (bot-style)`)
        } else {
            showFeedback(false, res?.error || '❌ No se pudo cargar la playlist')
        }
        setLoadingPreset(null)
    }

    /* ── Load a user's Spotify playlist ── */
    const loadMyPlaylist = async (pl) => {
        const url = `https://open.spotify.com/playlist/${pl.id}`
        setLoadingPreset(pl.id)
        clearQueue()
        const res = await addTrack(url)
        if (res?.ok) {
            showFeedback(true, `✅ Cargando ${pl.name} · ${res.count} canciones`)
        } else {
            showFeedback(false, res?.error || '❌ No se pudo cargar la playlist')
        }
        setLoadingPreset(null)
    }

    /* ── Load URL (YouTube, Spotify track/playlist, SoundCloud) ── */
    const loadUrl = async (url) => {
        if (!url.trim()) return
        setLoadingUrl(true)
        const res = await addTrack(url.trim())
        if (res?.ok) {
            const msg = res.count ? `✅ +${res.count} canciones añadidas` : `✅ Canción añadida a la cola`
            showFeedback(true, msg)
            setHistory(prev => [url, ...prev.filter(u => u !== url)].slice(0, 8))
            setInputUrl('')
        } else {
            showFeedback(false, res?.error || '❌ URL no reconocida o sin canciones')
        }
        setLoadingUrl(false)
    }

    /* ── Paywall ── */
    if (!isPro) return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div><h1 className="page-title">Music Player</h1><p className="page-subtitle">Tu música mientras estudias</p></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: '12px' }}>
                    <Lock size={14} color="var(--accent)" /><span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>Solo Pro</span>
                </div>
            </div>
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-surface), var(--accent-dim))', border: '2px solid var(--accent-border)' }}>
                <div style={{ fontSize: '64px', marginBottom: '1.5rem' }}>🎧</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Music Player Integrado</h2>
                <p style={{ color: 'var(--text-3)', maxWidth: '420px', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Carga playlists de <strong>Spotify</strong>, pega links de <strong>YouTube Music</strong> o <strong>SoundCloud</strong> y escucha directo en tu panel — sin embeds, cada canción se resuelve individualmente vía YouTube.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem' }}>
                    {['🎵 Spotify→YT', '▶️ YouTube Music', '☁️ SoundCloud'].map(t => <div key={t} style={{ padding: '8px 16px', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '13px', fontWeight: 700 }}>{t}</div>)}
                </div>
                <button onClick={() => setShowUpgrade(true)} style={{ padding: '1rem 2.5rem', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Zap size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Desbloquear con Pro
                </button>
            </div>
        </div>
    )

    /* ── Pro UI ── */
    return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="page-title">Music Player</h1>
                    <p className="page-subtitle">
                        {current ? `▶ ${current.title?.slice(0, 35) || 'Reproduciendo…'}` : 'Escucha música mientras estudias'}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => setShowQueue(q => !q)} title="Ver cola"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: showQueue ? 'var(--accent-dim)' : 'var(--bg-elevated)', color: showQueue ? 'var(--accent)' : 'var(--text-3)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700 }}>
                        <List size={13} /> Cola {queue.length > 0 && `(${queue.length})`}
                    </button>
                    {/* Spotify connect badge */}
                    {spotifyToken ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {spotifyProfile?.images?.[0] && <img src={spotifyProfile.images[0].url} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />}
                            <div style={{ lineHeight: 1.2 }}>
                                <p style={{ fontWeight: 800, fontSize: '13px', color: '#1db954' }}>✓ Spotify conectado</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 600 }}>{spotifyProfile?.display_name}</p>
                            </div>
                            <button onClick={handleDisconnect} title="Desconectar" style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                                <LogOut size={15} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleConnect} disabled={connecting}
                            style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: connecting ? 'var(--bg-hover)' : '#1db954', color: connecting ? 'var(--text-3)' : 'white', fontWeight: 900, fontSize: '14px', cursor: connecting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            <Music size={16} /> {connecting ? 'Conectando…' : 'Conectar Spotify'}
                        </button>
                    )}
                </div>
            </div>

            {/* Feedback toast */}
            {feedbackMsg && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: '12px', border: `1px solid ${feedbackMsg.ok ? 'var(--accent-border, #6c63ff44)' : '#ff444444'}`, background: feedbackMsg.ok ? 'var(--accent-dim, #6c63ff12)' : '#ff000012', fontSize: '0.875rem', fontWeight: 700, color: feedbackMsg.ok ? 'var(--accent)' : '#ff4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {feedbackMsg.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {feedbackMsg.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: showQueue ? '1fr 340px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
                <div>
                    {/* Now Playing */}
                    {current && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <NowPlayingCard
                                current={current}
                                playing={playing}
                                onToggle={togglePlay}
                                onNext={nextTrack}
                                onPrev={prevTrack}
                                progress={progress}
                                duration={duration}
                                onSeek={seek}
                                volume={volume}
                                onVolume={setVolume}
                                adDetected={adDetected}
                                onForceSkipAd={forceSkipAd}
                            />
                        </div>
                    )}

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        {[
                            { id: 'presets', label: '🎵 Playlists Chill' },
                            ...(spotifyToken ? [{ id: 'mylists', label: '📚 Mis Playlists' }] : []),
                            { id: 'url', label: '🔗 Pegar URL' },
                        ].map(t => (
                            <button key={t.id} onClick={() => setTab(t.id)} style={{
                                padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '13px', fontWeight: 700, transition: 'all 0.18s',
                                background: tab === t.id ? 'var(--accent)' : 'var(--bg-elevated)',
                                color: tab === t.id ? 'white' : 'var(--text-3)',
                            }}>{t.label}</button>
                        ))}
                    </div>

                    {/* ── Presets ── */}
                    {tab === 'presets' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.875rem' }}>
                            {PRESETS.map(p => {
                                const loading = loadingPreset === p.label
                                return (
                                    <div key={p.label} onClick={() => loadPreset(p)} className="panel-card"
                                        style={{ cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '14px', padding: '1rem 1.25rem', border: '1.5px solid var(--border-subtle)', transition: 'all 0.2s', opacity: loading ? 0.7 : 1 }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                                            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : p.emoji}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-1)', marginBottom: '2px' }}>{p.label}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 600 }}>{p.desc}</p>
                                            <p style={{ fontSize: '10px', color: '#1db954', fontWeight: 700, marginTop: '2px' }}>🎵 → ▶️ bot-style</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* ── Mis Playlists (Spotify connected) ── */}
                    {tab === 'mylists' && (
                        <div className="panel-card">
                            {!spotifyToken ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <p style={{ color: 'var(--text-4)', fontWeight: 700, marginBottom: '1rem' }}>Conecta Spotify para ver tus playlists</p>
                                    <button onClick={handleConnect} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: '#1db954', color: 'white', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Conectar Spotify
                                    </button>
                                </div>
                            ) : loadingProfile ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-4)' }}>
                                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Cargando tus playlists…</p>
                                </div>
                            ) : spotifyPlaylists.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-4)', fontWeight: 700 }}>No se encontraron playlists públicas.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '480px', overflowY: 'auto' }} className="custom-scrollbar">
                                    {spotifyPlaylists.map(pl => (
                                        <div key={pl.id}
                                            onClick={() => loadMyPlaylist(pl)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--bg-base)', borderRadius: '10px', border: '1px solid var(--border-subtle)', cursor: loadingPreset === pl.id ? 'wait' : 'pointer', transition: 'border-color 0.15s', opacity: loadingPreset === pl.id ? 0.6 : 1 }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#1db95460'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                                            {pl.images?.[0]
                                                ? <img src={pl.images[0].url} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />
                                                : <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#1db95420', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' }}>🎵</div>
                                            }
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 700, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</p>
                                                <p style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 600 }}>{pl.tracks?.total} canciones · bot-style</p>
                                            </div>
                                            {loadingPreset === pl.id
                                                ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                                                : <ChevronRight size={14} color="var(--text-4)" />
                                            }
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── URL Paste ── */}
                    {tab === 'url' && (
                        <div className="panel-card">
                            <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>
                                Pega un link de YouTube, SoundCloud o Spotify
                            </p>
                            <div style={{ background: 'var(--bg-base)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', fontSize: '12px', color: 'var(--text-3)', fontWeight: 600, lineHeight: 1.6 }}>
                                💡 <strong>Spotify:</strong> Cada canción se busca individualmente en YouTube (como el bot).<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<strong>YouTube:</strong> Video o playlist directo. <strong>SoundCloud:</strong> Embed nativo.
                            </div>
                            <form onSubmit={e => { e.preventDefault(); loadUrl(inputUrl.trim()) }} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
                                    <Link size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', pointerEvents: 'none' }} />
                                    <input className="panel-input" style={{ paddingLeft: '38px', width: '100%' }}
                                        value={inputUrl} onChange={e => setInputUrl(e.target.value)}
                                        placeholder="https://open.spotify.com/playlist/…  |  youtube.com/…  |  soundcloud.com/…"
                                        disabled={loadingUrl} />
                                </div>
                                <button type="submit" className="btn-primary-sm" style={{ padding: '0 22px', opacity: loadingUrl ? 0.6 : 1, cursor: loadingUrl ? 'wait' : 'pointer' }} disabled={loadingUrl}>
                                    {loadingUrl ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <><Play size={15} /> Añadir</>}
                                </button>
                            </form>

                            {history.length > 0 && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Historial</p>
                                        <button onClick={() => setHistory([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', fontSize: '11px', fontWeight: 700 }}>Limpiar</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        {history.map(url => (
                                            <div key={url} onClick={() => loadUrl(url)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-border)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
                                                <RefreshCw size={12} color="var(--text-4)" style={{ flexShrink: 0 }} />
                                                <span style={{ flex: 1, fontSize: '12px', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{url}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Sidebar Queue ── */}
                {showQueue && (
                    <div className="panel-card" style={{ position: 'sticky', top: '1rem', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                            <p style={{ fontWeight: 900, fontSize: '0.9375rem' }}>Cola ({queue.length})</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {queue.length > 0 && (
                                    <button onClick={clearQueue} title="Limpiar cola"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', padding: '4px' }}>
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <button onClick={() => setShowQueue(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', padding: '4px' }}>
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                        {queue.length === 0 ? (
                            <p style={{ color: 'var(--text-4)', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center', padding: '2rem 0' }}>
                                La cola está vacía.<br />Carga una playlist o pega un URL.
                            </p>
                        ) : (
                            <div style={{ overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
                                {queue.map((track, i) => (
                                    <QueueRow
                                        key={track.id}
                                        track={track}
                                        isCurrent={i === idx}
                                        onPlay={() => playTrackNow(track.id)}
                                        onRemove={() => removeTrack(track.id)}
                                        isLiked={isLiked(track.id)}
                                        onLike={() => toggleLike(track)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
