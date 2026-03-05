/**
 * MusicQueue — Discord-bot style music player
 * Tabs: Cola | Spotify | Me gusta
 */
import { useState, useRef, useEffect } from 'react'
import {
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    Plus, Trash2, Music, X, ListMusic, Heart, Minimize2,
    ChevronRight, RefreshCw, Zap, Lock
} from 'lucide-react'
import { auth } from '../../firebase'
import { useAudioPlayer } from '../context/AudioPlayerContext'
import { useWidgets } from '../components/FloatingWidgets'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'

/* ── platform icons (inline SVG badges) ────────────────────── */
function YTIcon({ size = 12 }) {
    return (
        <svg width={size * 1.4} height={size} viewBox="0 0 18 12" fill="none" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
            <rect width="18" height="12" rx="3" fill="#FF0000" />
            <polygon points="7,3 7,9 13,6" fill="white" />
        </svg>
    )
}
function SCIcon({ size = 12 }) {
    return <span style={{ fontSize: size * 0.9, lineHeight: 1, color: '#f50', fontWeight: 900, flexShrink: 0 }}>☁</span>
}
function PLIcon({ size = 12 }) {
    return (
        <svg width={size * 1.4} height={size} viewBox="0 0 18 12" fill="none" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
            <rect width="18" height="12" rx="3" fill="#FF0000" />
            <rect x="3" y="3.5" width="6" height="1.5" rx="0.75" fill="white" />
            <rect x="3" y="6.5" width="6" height="1.5" rx="0.75" fill="white" />
            <polygon points="12,3 12,9 17,6" fill="white" />
        </svg>
    )
}
function SPIcon({ size = 12 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
            <circle cx="10" cy="10" r="10" fill="#1DB954" />
            <path d="M5 7.3c3.3-1 7.2-.6 9.8 1.3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M5.5 10c2.8-.9 5.9-.5 8.1 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6 12.5c2.2-.7 4.5-.4 6.2.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    )
}

function formatTime(s) {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function PlaylistAddButton({ track, playlists = [], onAdd }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{ position: 'relative' }}>
            <button onClick={e => { e.stopPropagation(); setOpen(!open) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', padding: '3px', borderRadius: 6, display: 'flex', flexShrink: 0 }}>
                <Plus size={13} />
            </button>
            {open && (
                <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: 5, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, zIndex: 99, minWidth: 150, padding: 5, boxShadow: 'var(--shadow-md)' }}>
                    <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-4)', padding: '4px 8px', textTransform: 'uppercase' }}>Guardar en playlist</p>
                    {playlists.length === 0 ? (
                        <p style={{ fontSize: 10, color: 'var(--text-3)', padding: '4px 8px' }}>Crea una playlist primero</p>
                    ) : (
                        playlists.map(pl => (
                            <div key={pl.id} onClick={e => { e.stopPropagation(); onAdd(pl.id, track); setOpen(false) }}
                                onMouseEnter={e => e.target.style.background = 'var(--bg-hover)'}
                                onMouseLeave={e => e.target.style.background = 'transparent'}
                                style={{ fontSize: 11, padding: '6px 8px', borderRadius: 5, cursor: 'pointer', color: 'var(--text-1)' }}>
                                {pl.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

/* ── Spotify preset playlists ───────────────────────────────── */
const SP_PLAYLISTS = [
    { id: '37i9dQZF1DX8NTLI2TtZa6', label: 'Lo-Fi Beats', emoji: '☕', desc: 'Beats relajados para estudiar' },
    { id: '37i9dQZF1DWZeKCadgRdKQ', label: 'Deep Focus', emoji: '🎯', desc: 'Concentración máxima' },
    { id: '37i9dQZF1DX4sWSpwq3LiO', label: 'Peaceful Piano', emoji: '🎹', desc: 'Piano ambiental tranquilo' },
    { id: '37i9dQZF1DXbvABJXBIyiY', label: 'Ambient Chill', emoji: '🌊', desc: 'Ambiente suave' },
    { id: '37i9dQZF1DX4PP3DA4J0N8', label: 'Jazz for Study', emoji: '🎷', desc: 'Jazz clásico de estudio' },
    { id: '37i9dQZF1DX9XIFQuFvzM4', label: 'Feelin\' Good', emoji: '☀️', desc: 'Para mantenerte motivado' },
    { id: '37i9dQZF1DX1s9knjAYLOe', label: 'Late Night Coding', emoji: '🌙', desc: 'Para sesiones nocturnas' },
    { id: '37i9dQZF1DWWQRwui0ExPn', label: 'Synthwave Study', emoji: '🕹️', desc: 'Electrónico concentración' },
]

/* ─────────────────────────────────────────────────────────────
   NOW PLAYING BAR
   Improved to show either YT player or Embed player (Spotify/SoundCloud)
───────────────────────────────────────────────────────────── */
function NowPlaying({ current, playing, progress, duration, volume, loading, togglePlay, nextTrack, prevTrack, seek, setVolume, isLiked, toggleLike }) {
    if (!current) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-4)' }}>
            <Music size={36} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Añade links para empezar</p>
            <p style={{ fontSize: '0.8rem', marginTop: 4, opacity: 0.7 }}>YouTube, playlists o SoundCloud</p>
        </div>
    )

    const liked = isLiked(current.id)
    const pct = progress || 0
    const isPlaylist = current.type === 'playlist'

    // DECISION: Show YT player IF we have a videoId (resolved or native YT)
    // OTHERWISE show the platform embed (Spotify/SoundCloud)
    const showYT = !!current.videoId || current.platform === 'youtube'

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                {/* Thumbnail */}
                <div style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                    {current.thumbnail
                        ? <img src={current.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <Music size={28} color="var(--text-4)" />
                    }
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, minWidth: 0 }}>
                        <div style={{ fontWeight: 900, fontSize: '0.9375rem', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-1)', lineHeight: 1.3, flex: 1, minWidth: 0, paddingRight: 8 }}>
                            {current.title || current.url}
                        </div>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-4)', fontWeight: 600 }}>{current.author}</div>
                    {isPlaylist && <p style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700, marginTop: 3 }}>📋 Playlist completa en reproducción</p>}
                </div>
                {/* Like */}
                <button onClick={() => toggleLike(current)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#e63946' : 'var(--text-4)', padding: '4px', borderRadius: 8, display: 'flex', transition: 'all .2s', flexShrink: 0 }}>
                    <Heart size={20} fill={liked ? '#e63946' : 'none'} />
                </button>
            </div>

            {/* Searching YT audio state (Visual only, no text) */}
            {!showYT && (current.platform === 'spotify' || current.platform === 'soundcloud') && (
                <div style={{ marginBottom: '1.25rem', height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-hover)', borderRadius: 12, border: '1px solid var(--border-subtle)', color: 'var(--text-4)' }}>
                    <RefreshCw size={24} className="spin" style={{ opacity: 0.5 }} />
                </div>
            )}

            {/* Embed Player Fallback ONLY for SoundCloud (not Spotify) */}
            {!showYT && current.platform === 'soundcloud' && (
                <div style={{ marginBottom: '1.25rem', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', height: 120 }}>
                    <iframe
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(current.url)}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    />
                </div>
            )}

            {/* Seek bar — only for single YouTube videos */}
            {!isPlaylist && current.platform === 'youtube' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.125rem' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 700, width: 36, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{formatTime((pct / 100) * duration)}</span>
                    <div
                        onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * 100) }}
                        style={{ flex: 1, height: 5, background: 'var(--bg-hover-2)', borderRadius: 9999, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 9999, transition: 'width 0.6s linear' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 700, width: 36, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{formatTime(duration)}</span>
                </div>
            )}

            {/* Controls — only for YouTube (Spotify/SC have their own embed UI) */}
            {current.platform === 'youtube' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <button onClick={prevTrack} style={ctrlBtn}><SkipBack size={18} /></button>
                    <button onClick={togglePlay} style={{ ...ctrlBtn, width: 52, height: 52, background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '50%', boxShadow: '0 4px 18px var(--accent-glow)' }}>
                        {loading ? <RefreshCw size={20} className="spin" /> : playing ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
                    </button>
                    <button onClick={nextTrack} style={ctrlBtn}><SkipForward size={18} /></button>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button onClick={() => setVolume(volume > 0 ? 0 : 80)} style={{ ...ctrlBtn, width: 34, height: 34 }}>
                            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        </button>
                        <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)}
                            style={{ width: 80, accentColor: 'var(--accent)' }} />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <button onClick={prevTrack} style={ctrlBtn}><SkipBack size={18} /></button>
                    <span style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Usa los controles del reproductor integrado
                    </span>
                    <button onClick={nextTrack} style={{ ...ctrlBtn, marginLeft: 'auto' }}><SkipForward size={18} /></button>
                </div>
            )}
        </div>
    )
}

const ctrlBtn = {
    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
    borderRadius: '50%', width: 44, height: 44, display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    color: 'var(--text-1)', transition: 'all 0.15s', flexShrink: 0
}

/* ─────────────────────────────────────────────────────────────
   QUEUE ITEM
───────────────────────────────────────────────────────────── */
function QueueItem({ track, index, isActive, onPlay, onRemove, isLiked, onLike, playlists = [], onAddToPlaylist }) {
    const liked = isLiked(track.id)
    const [showPlMenu, setShowPlMenu] = useState(false)
    return (
        <div
            onClick={() => onPlay(track.id)}
            style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.875rem', borderRadius: 10, cursor: 'pointer',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--accent-border)' : 'transparent'}`,
                transition: 'all .15s',
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
                position: 'relative'
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; setShowPlMenu(false) }}
        >
            <span style={{ width: 20, fontSize: '11px', fontWeight: 800, color: isActive ? 'var(--accent)' : 'var(--text-4)', textAlign: 'center', flexShrink: 0 }}>
                {isActive ? '▶' : index + 1}
            </span>
            {track.thumbnail
                ? <img src={track.thumbnail} alt="" style={{ width: 40, height: 40, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 40, height: 40, borderRadius: 7, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Music size={14} color="var(--text-4)" />
                </div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isActive ? 'var(--accent)' : 'var(--text-1)', width: '100%', minWidth: 0, paddingRight: 8 }}>
                    {track.title || track.url}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-4)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{track.author || ''}</span>
                    {track.type === 'playlist' && <span style={{ fontSize: '9px', background: 'var(--accent-dim)', color: 'var(--accent)', padding: '1px 5px', borderRadius: 4, fontWeight: 800, flexShrink: 0 }}>PLAYLIST</span>}
                </div>
            </div>
            <button onClick={e => { e.stopPropagation(); onLike(track) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#e63946' : 'var(--text-4)', padding: '3px', borderRadius: 6, display: 'flex', flexShrink: 0, transition: 'color .15s' }}>
                <Heart size={13} fill={liked ? '#e63946' : 'none'} />
            </button>
            <PlaylistAddButton track={track} playlists={playlists} onAdd={onAddToPlaylist} />
            <button onClick={e => { e.stopPropagation(); onRemove(track.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-1)', padding: '3px', borderRadius: 6, display: 'flex', flexShrink: 0, transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}>
                <X size={13} />
            </button>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function MusicQueue({ user }) {
    const { isPro, proInfo, trialExpired, startTrial } = useProContext()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const { openWidget } = useWidgets()
    const {
        queue, current, idx, playing, volume, progress, duration, loading,
        togglePlay, nextTrack, prevTrack, seek, setVolume,
        addTrack, removeTrack, clearQueue, playTrackNow,
        likes, isLiked, toggleLike, removeLike,
        userPlaylists, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, playPlaylist
    } = useAudioPlayer()

    const [inputUrl, setInputUrl] = useState('')
    const [adding, setAdding] = useState(false)
    const [addError, setAddError] = useState('')
    const [tab, setTab] = useState('queue')       // queue | spotify | likes | playlists
    const [playlistName, setPlaylistName] = useState('')
    const [spActive, setSpActive] = useState(null)          // active Spotify preset id
    const inputRef = useRef()

    // ── Trial — trialExpired viene del ProContext (calculado en usePro, no aqui) ──
    // SEGURIDAD: no existe TRIAL_MILLIS aqui. Los componentes no calculan nada.

    const [timeLeft, setTimeLeft] = useState(null)

    // Auto-start trial + countdown display (solo para mostrar tiempo, no decide expiración)
    useEffect(() => {
        if (isPro) return
        if (!proInfo?.trialStartedAt && auth.currentUser) startTrial()

        const DISPLAY_MS = 2 * 24 * 60 * 60 * 1000 // Solo para UI del contador
        const tick = () => {
            if (!proInfo?.trialStartedAt) { setTimeLeft(DISPLAY_MS); return }
            const remaining = DISPLAY_MS - (Date.now() - proInfo.trialStartedAt.getTime())
            setTimeLeft(remaining > 0 ? remaining : 0)
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [isPro, proInfo?.trialStartedAt, auth.currentUser])

    // SEGURIDAD: trialExpired viene del ProContext (calculado en usePro con Object.freeze)
    // Los componentes NO calculan expiración — ni TRIAL_MILLIS existe aqui
    const isTrialActive = !isPro && (!proInfo?.trialStartedAt || !trialExpired)
    const canUseQueue = isPro || isTrialActive

    // Force spotify tab if trial expired
    useEffect(() => {
        if (trialExpired && tab !== 'spotify') {
            setTab('spotify')
        }
    }, [trialExpired, tab])

    const formatTimeLeft = (ms) => {
        if (ms === null) return 'Calculando...'
        if (ms <= 0) return 'Expirado'
        const totalSecs = Math.floor(ms / 1000)
        const days = Math.floor(totalSecs / (3600 * 24))
        const hours = Math.floor((totalSecs % (3600 * 24)) / 3600)
        const mins = Math.floor((totalSecs % 3600) / 60)
        const secs = totalSecs % 60

        if (days >= 1) {
            return `${days}d ${hours}h`
        }
        if (hours >= 1) {
            return `${hours}h ${mins}m`
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleAdd = async (url = inputUrl.trim()) => {
        if (!url) return
        if (trialExpired) {
            setShowUpgrade(true)
            return
        }
        setAdding(true); setAddError('')
        const res = await addTrack(url)
        if (res.ok) { setInputUrl(''); inputRef.current?.focus() }
        else setAddError(res.error)
        setAdding(false)
    }

    return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}

            {/* ── Header ── */}
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="page-title">Music Player</h1>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-4)' }}>
                        {current ? `▶ ${current.title}` : `${queue.length} pistas en cola`}
                    </p>
                </div>

                {/* Trial Time Left Indicator */}
                {!isPro && proInfo?.trialStartedAt && !trialExpired && (
                    <div style={{
                        padding: '8px 16px',
                        borderRadius: 12,
                        background: 'var(--accent-dim)',
                        border: '1px solid var(--accent-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        transition: 'all 0.3s'
                    }}>
                        <Zap size={14} color="var(--accent)" className="spin" />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>Tiempo de prueba</span>
                            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-1)', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{formatTimeLeft(timeLeft)}</span>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1.5rem', alignItems: 'start' }}>

                {/* ── Left: Now Playing + Tabs ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Now Playing - Hidden if expired */}
                    {!trialExpired && (
                        <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
                            <NowPlaying
                                current={current} playing={playing} progress={progress}
                                duration={duration} volume={volume} loading={loading}
                                togglePlay={togglePlay} nextTrack={nextTrack} prevTrack={prevTrack}
                                seek={seek} setVolume={setVolume}
                                isLiked={isLiked} toggleLike={toggleLike}
                            />
                        </div>
                    )}

                    {/* Tabs - Only show all if not expired */}
                    <div style={{ display: 'flex', background: 'var(--bg-hover)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)', gap: 4 }}>
                        {[
                            ['queue', `🎵 Cola (${queue.length})`],
                            ['playlists', `📋 Playlists (${userPlaylists.length})`],
                            ['likes', `❤️ Favoritos`],
                            ['spotify', 'Spotify'],
                        ].filter(([id]) => !trialExpired || id === 'spotify').map(([id, label]) => {
                            return (
                                <button key={id}
                                    onClick={() => setTab(id)}
                                    style={{
                                        flex: 1,
                                        padding: '7px 0',
                                        borderRadius: 9,
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontWeight: 800,
                                        fontSize: 13,
                                        transition: 'all .18s',
                                        background: tab === id ? 'var(--bg-surface)' : 'transparent',
                                        color: tab === id ? 'var(--text-1)' : 'var(--text-4)',
                                        boxShadow: tab === id ? 'var(--shadow-sm)' : 'none',
                                        position: 'relative'
                                    }}>
                                    {label}
                                </button>
                            )
                        })}
                    </div>

                    {/* ── Tab: Queue ── */}
                    {tab === 'queue' && (
                        <div className="panel-card" style={{ padding: 0, overflow: 'hidden', opacity: !isPro && timeLeft === 0 ? 0.6 : 1, pointerEvents: !isPro && timeLeft === 0 ? 'none' : 'auto' }}>
                            {queue.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-4)' }}>
                                    <ListMusic size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 700 }}>La cola está vacía</p>
                                    <p style={{ fontSize: '0.8125rem', marginTop: 4 }}>Pega links de YouTube o SoundCloud →</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{queue.length} pistas</span>
                                        <button onClick={clearQueue} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: 'var(--red)', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Trash2 size={12} /> Limpiar todo
                                        </button>
                                    </div>
                                    <div style={{ maxHeight: '380px', overflowY: 'auto', overflowX: 'hidden', padding: '0.5rem' }}>
                                        {queue.map((track, i) => (
                                            <QueueItem
                                                key={track.id} track={track} index={i}
                                                isActive={i === idx}
                                                onPlay={playTrackNow} onRemove={removeTrack}
                                                isLiked={isLiked} onLike={toggleLike}
                                                playlists={userPlaylists} onAddToPlaylist={addToPlaylist}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Tab: Spotify ── */}
                    {tab === 'spotify' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

                            {/* Active Spotify embed */}
                            {spActive && (
                                <div className="panel-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12 }}>
                                    <iframe
                                        key={spActive}
                                        src={`https://open.spotify.com/embed/playlist/${spActive}?utm_source=generator&theme=0`}
                                        width="100%" height="352"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                        style={{ display: 'block', border: 'none' }}
                                        title="Spotify Playlist"
                                    />
                                </div>
                            )}

                            {/* Preset grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '0.625rem' }}>
                                {SP_PLAYLISTS.map(pl => {
                                    const isActive = spActive === pl.id
                                    return (
                                        <button key={pl.id} onClick={() => setSpActive(isActive ? null : pl.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem',
                                                borderRadius: 12, border: `1.5px solid ${isActive ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
                                                background: isActive ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                                                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all .2s',
                                            }}
                                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = '#1DB95440'; e.currentTarget.style.background = '#1DB95410' } }}
                                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-elevated)' } }}
                                        >
                                            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{pl.emoji}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 800, fontSize: '0.8125rem', color: isActive ? 'var(--accent)' : 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.label}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                                    <SPIcon size={11} />
                                                    <span style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 600 }}>Spotify</span>
                                                </div>
                                            </div>
                                            {isActive && <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800 }}>▶</span>}
                                        </button>
                                    )
                                })}
                            </div>

                        </div>
                    )}

                    {/* ── Tab: Playlists ── */}
                    {tab === 'playlists' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: !isPro && timeLeft === 0 ? 0.6 : 1, pointerEvents: !isPro && timeLeft === 0 ? 'none' : 'auto' }}>
                            <div className="panel-card" style={{ padding: '1rem' }}>
                                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Nueva Playlist</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        className="panel-input"
                                        placeholder="Nombre de la lista..."
                                        value={playlistName}
                                        onChange={e => setPlaylistName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (createPlaylist(playlistName), setPlaylistName(''))}
                                    />
                                    <button
                                        onClick={() => { createPlaylist(playlistName); setPlaylistName('') }}
                                        className="btn-primary" style={{ padding: '0.625rem 1rem' }}
                                    >
                                        Crear
                                    </button>
                                </div>
                            </div>

                            {userPlaylists.length === 0 ? (
                                <div className="panel-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-4)' }}>
                                    <ListMusic size={32} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 700 }}>Organiza tu música</p>
                                    <p style={{ fontSize: '0.8125rem', marginTop: 4 }}>Crea una playlist y añade canciones desde la cola</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                    {userPlaylists.map(pl => (
                                        <div key={pl.id} className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
                                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ minWidth: 0 }}>
                                                    <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</p>
                                                    <p style={{ fontSize: '10px', color: 'var(--text-4)' }}>{pl.tracks.length} canciones</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                                    <button onClick={() => playPlaylist(pl.id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>
                                                        Play
                                                    </button>
                                                    <button onClick={() => deletePlaylist(pl.id)} style={{ background: 'none', border: 'none', padding: 5, color: 'var(--text-4)', cursor: 'pointer' }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {pl.tracks.length > 0 && (
                                                <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '0.5rem' }}>
                                                    {pl.tracks.map(t => (
                                                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px', borderRadius: 6, transition: 'background .1s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <p style={{ fontSize: '11px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</p>
                                                            </div>
                                                            <button onClick={() => removeFromPlaylist(pl.id, t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-4)', padding: 2, cursor: 'pointer' }}><X size={10} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {/* ── Tab: Likes ── */}
                    {tab === 'likes' && (
                        <div className="panel-card" style={{ padding: 0, overflow: 'hidden', opacity: !isPro && timeLeft === 0 ? 0.6 : 1, pointerEvents: !isPro && timeLeft === 0 ? 'none' : 'auto' }}>
                            {likes.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-4)' }}>
                                    <Heart size={36} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 700 }}>Aún no tienes favoritos</p>
                                    <p style={{ fontSize: '0.8125rem', marginTop: 4 }}>Toca ❤️ en cualquier pista para guardarla</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{likes.length} favoritos</span>
                                    </div>
                                    <div style={{ maxHeight: '380px', overflowY: 'auto', overflowX: 'hidden', padding: '0.5rem' }}>
                                        {[...likes].reverse().map(track => (
                                            <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: 10, transition: 'background .15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                {track.thumbnail
                                                    ? <img src={track.thumbnail} alt="" style={{ width: 40, height: 40, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                                                    : <div style={{ width: 40, height: 40, borderRadius: 7, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Music size={14} color="var(--text-4)" />
                                                    </div>
                                                }
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontWeight: 700, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-1)' }}>{track.title || track.url}</p>
                                                    <p style={{ fontSize: '0.6875rem', color: 'var(--text-4)', fontWeight: 600 }}>{track.author}</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => { addTrack(track.url) }}
                                                        title="Añadir a la cola"
                                                        style={{ background: 'var(--accent-dim)', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, fontFamily: 'inherit' }}>
                                                        + Cola
                                                    </button>
                                                    <PlaylistAddButton track={track} playlists={userPlaylists} onAdd={addToPlaylist} />
                                                    <button onClick={() => removeLike(track.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e63946', padding: '3px', display: 'flex', borderRadius: 6 }}>
                                                        <Heart size={14} fill="#e63946" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Right: Add + queue preview ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Add track - Hidden if expired */}
                    {!trialExpired && (
                        <div className="panel-card">
                            <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Añadir a la cola</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        ref={inputRef}
                                        className="panel-input"
                                        value={inputUrl}
                                        onChange={e => { setInputUrl(e.target.value); setAddError('') }}
                                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                                        placeholder="Link de YT, SoundCloud o Spotify…"
                                        style={{ paddingRight: '2.5rem' }}
                                    />
                                    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 5, pointerEvents: 'none' }}>
                                        {inputUrl.includes('youtu') && <YTIcon />}
                                        {inputUrl.includes('soundcloud') && <SCIcon />}
                                        {inputUrl.includes('spotify') && <SPIcon />}
                                    </div>
                                </div>
                                {addError && (
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: '8px 12px', background: 'var(--red-dim, rgba(239,68,68,.12))', borderRadius: 8, border: '1px solid rgba(239,68,68,.25)' }}>
                                        <span style={{ fontSize: 14 }}>⚠️</span>
                                        <p style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 700, lineHeight: 1.4 }}>{addError}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleAdd()}
                                    disabled={!inputUrl.trim()}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 12, border: 'none', background: !inputUrl.trim() ? 'var(--bg-hover)' : 'var(--accent)', color: !inputUrl.trim() ? 'var(--text-4)' : 'white', fontWeight: 800, fontSize: 14, cursor: !inputUrl.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
                                >
                                    <Plus size={16} /> Añadir a la cola
                                </button>
                            </div>
                            {/* Supported platforms — just icons */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '0.875rem', padding: '0.625rem', background: 'var(--bg-hover)', borderRadius: 12 }}>
                                <YTIcon size={14} />


                                <SPIcon size={14} />
                                <span style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 2 }}>YT · Playlists · Spotify</span>
                            </div>
                        </div>
                    )}

                    {/* Up next preview - Hidden if expired */}
                    {!trialExpired && queue.length > 0 && (
                        <div className="panel-card" style={{ padding: '1rem' }}>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Siguiente en cola</p>
                            {queue.slice(idx, idx + 4).map((t, i) => (
                                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < Math.min(3, queue.length - idx) - 1 ? '1px solid var(--border-subtle)' : 'none', minWidth: 0 }}>
                                    <span style={{ fontSize: '10px', color: i === 0 ? 'var(--accent)' : 'var(--text-4)', fontWeight: 800, width: 18, flexShrink: 0 }}>{i === 0 ? '▶' : `${idx + i + 1}.`}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '11px', color: i === 0 ? 'var(--text-1)' : 'var(--text-3)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {t.title || t.url}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    )
}
