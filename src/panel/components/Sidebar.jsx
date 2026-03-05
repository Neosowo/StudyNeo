import { useState } from 'react'
import {
    LayoutDashboard, CheckSquare, FileText, Settings, LogOut,
    Cloud, CloudOff, User, StickyNote, Music, Zap,
    ChevronRight, Repeat, Brain, Timer, CalendarDays,
    Flame, TrendingUp, Link2, Calculator, Briefcase, BookOpen, Users,
    LayoutGrid, SkipBack, SkipForward, Play, Pause, X
} from 'lucide-react'
import { useProContext } from '../../ProContext'
import { useSync } from '../hooks/useSync'
import { Zap as ZapIcon } from 'lucide-react'
import { useSfx } from '../hooks/useSfx'
import { useWidgets } from './FloatingWidgets'
import { useAudioPlayer } from '../context/AudioPlayerContext'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Sidebar({ active, onNavigate, onExit, open, onToggle, user, isMobile }) {
    const { isDirty, isSyncing, formatNextSync, isOffline, isQuotaExceeded } = useSync()
    const { isPro, proInfo, trialExpired } = useProContext()
    const { play } = useSfx()
    const { openWidget } = useWidgets()
    const { current, playing, togglePlay, nextTrack, prevTrack } = useAudioPlayer()
    const [quickNote] = useLocalStorage('sd_quick_note', '')

    const [widgetMode, setWidgetMode] = useState('music')

    // trialExpired viene del ProContext (calculado en usePro con Object.freeze)
    // SEGURIDAD: no se calcula aqui — no existe TRIAL_MILLIS en este archivo
    const trialStartedAt = proInfo?.trialStartedAt

    const MENU_ITEMS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notes', label: 'Mis Notas', icon: FileText },
        { id: 'flashcards', label: 'Flashcards', icon: Brain },
        { id: 'tasks', label: 'Tareas', icon: CheckSquare },
        { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
        { id: 'calendar', label: 'Calendario', icon: CalendarDays },
        { id: 'habits', label: 'Hábitos', icon: Flame },
        { id: 'links', label: 'Vault', icon: Link2 },
        { id: 'gradecalc', label: 'Promedios', icon: Calculator },
        { id: 'eisenhower', label: 'Eisenhower', icon: Briefcase },
        { id: 'spotify', label: 'Reproductor', icon: Music },
        { id: 'bitacora', label: 'Bitácora', icon: BookOpen },
        { id: 'settings', label: 'Ajustes', icon: Settings },
    ]

    // Remove duplicates or extra manual entries if needed
    const filteredMenu = MENU_ITEMS.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
    )

    const initial = user?.name?.charAt(0) || 'U'

    return (
        <aside className={`panel-sidebar ${open ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`} style={{ width: open || isMobile ? '240px' : '64px' }}>
            <div className="sidebar-logo" style={{
                padding: '20px 0',
                justifyContent: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '10px',
                minHeight: '64px'
            }}>
                {!open && !isMobile ? (
                    <button onClick={onToggle} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', display: 'flex' }}>
                        <ChevronRight size={20} />
                    </button>
                ) : (
                    <div style={{ display: 'flex', width: '100%', padding: '0 20px', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="logo-text" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>StudyNeo<span style={{ color: 'var(--accent)' }}>.</span></div>
                        <button onClick={onToggle} style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: '8px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', cursor: 'pointer' }}>
                            {isMobile ? <X size={14} /> : <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />}
                        </button>
                    </div>
                )}
            </div>

            <nav className="sidebar-nav" style={{ padding: open || isMobile ? '10px' : '10px 8px' }}>
                {filteredMenu.map((item) => {
                    const Icon = item.icon
                    const isActive = active === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => { onNavigate(item.id); play('pop') }}
                            className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                            style={{
                                justifyContent: open || isMobile ? 'flex-start' : 'center',
                                padding: open || isMobile ? '0.625rem 0.75rem' : '0.625rem 0',
                                width: '100%',
                            }}
                            title={!open ? item.label : ''}
                        >
                            <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
                            {(open || isMobile) && <span>{item.label}</span>}
                            {isActive && (open || isMobile) && <div className="sidebar-active-dot" />}
                        </button>
                    )
                })}
            </nav>

            <div className="sidebar-footer" style={{
                padding: '20px 10px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
            }}>
                {(open || isMobile) && (
                    <div className="sidebar-user" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', flexDirection: 'column', padding: '10px 8px', gap: '10px', borderRadius: '12px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                            <div className="sidebar-avatar" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                {user?.photoURL ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
                                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {isPro && <ZapIcon size={10} color="var(--accent)" fill="var(--accent)" />}
                                        <div title={`Sincronización: ${formatNextSync()}`}>
                                            {isOffline || isQuotaExceeded ? (
                                                <CloudOff size={10} color="var(--red)" />
                                            ) : (
                                                isSyncing ? (
                                                    <Cloud size={10} color="var(--accent)" className="sync-pulse" />
                                                ) : (
                                                    isDirty ? (
                                                        <Cloud size={10} color="var(--yellow)" />
                                                    ) : (
                                                        <Cloud size={10} color="var(--accent)" />
                                                    )
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '0.625rem', color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</span>
                                </div>
                            </div>
                        </div>

                        {(isPro || !trialExpired) && (
                            <div style={{ width: '100%', position: 'relative' }}>
                                <button
                                    onClick={() => { setWidgetMode(widgetMode === 'music' ? 'note' : 'music'); play('pop') }}
                                    style={{
                                        position: 'absolute', top: '-18px', right: '0',
                                        background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                                        borderRadius: '50%', width: '22px', height: '22px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-4)', cursor: 'pointer', zIndex: 5,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Repeat size={10} />
                                </button>

                                <div style={{ background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                                    {widgetMode === 'music' && current ? (
                                        <div style={{ padding: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                                                    <img src={current.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{current.title}</p>
                                                    <p style={{ fontSize: '8px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sonando ahora</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                <button onClick={() => { prevTrack(); play('pop') }} style={playerBtn}><SkipBack size={12} fill="currentColor" /></button>
                                                <button onClick={() => { togglePlay(); play('click') }} style={{ ...playerBtn, width: '32px', height: '32px', background: 'var(--accent)', color: 'white', border: 'none' }}>
                                                    {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" style={{ marginLeft: '2px' }} />}
                                                </button>
                                                <button onClick={() => { nextTrack(); play('pop') }} style={playerBtn}><SkipForward size={12} fill="currentColor" /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '8px' }}>
                                            <div style={{ maxHeight: '40px', overflow: 'hidden', marginBottom: '8px' }}>
                                                <p style={{ fontSize: '10px', color: 'var(--text-2)', lineHeight: 1.4, fontStyle: quickNote ? 'normal' : 'italic' }}>
                                                    {quickNote || 'Sin apuntes rápidos...'}
                                                </p>
                                            </div>
                                            <button onClick={() => { openWidget('quicknote'); play('click') }} style={{ width: '100%', height: '24px', background: 'var(--bg-hover)', border: 'none', borderRadius: '6px', color: 'var(--yellow)', fontSize: '9px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                <StickyNote size={10} /> VER APUNTES
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!open && !isMobile && (
                    <div className="sidebar-avatar" style={{ borderRadius: '12px', overflow: 'hidden', width: '42px', height: '42px', cursor: 'pointer', border: '2px solid var(--border-subtle)' }} onClick={onToggle}>
                        {user?.photoURL ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
                    </div>
                )}

                <button onClick={onExit} style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--red)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                    width: open || isMobile ? '100%' : 'auto',
                    justifyContent: open || isMobile ? 'flex-start' : 'center'
                }} className="logout-button-hover">
                    <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
                    {(open || isMobile) && <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Cerrar Sesión</span>}
                </button>
            </div>
        </aside>
    )
}

const playerBtn = {
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-2)',
    cursor: 'pointer',
    transition: 'all 0.2s',
}
