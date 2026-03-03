import {
    LayoutDashboard, FileText, Brain, CheckSquare,
    Timer, Calendar, Flame, BarChart3, Link,
    Calculator, Settings, LogOut, ChevronLeft,
    ChevronRight, Cloud, CloudOff, X, BookOpen
} from 'lucide-react'
import { useSync } from '../hooks/useSync'
import { useProContext } from '../../ProContext'
import { Zap } from 'lucide-react'

export default function Sidebar({ active, onNavigate, onExit, open, onToggle, user, isMobile }) {
    const { isDirty, isSyncing, formatNextSync, isOffline, isQuotaExceeded } = useSync()
    const { isPro } = useProContext()

    const MENU_ITEMS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notes', label: 'Notas', icon: FileText },
        { id: 'flashcards', label: 'Flashcards', icon: Brain },
        { id: 'tasks', label: 'Tareas', icon: CheckSquare },
        { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
        { id: 'calendar', label: 'Calendario', icon: Calendar },
        { id: 'habits', label: 'Hábitos', icon: Flame },
        { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
        { id: 'links', label: 'Bóveda de Links', icon: Link },
        { id: 'gradecalc', label: 'Calculadora de Notas', icon: Calculator },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ]

    const initial = user?.name ? user.name[0].toUpperCase() : '?'

    return (
        <aside
            className={`sidebar ${open ? 'open' : 'closed'} ${isMobile ? 'mobile-drawer' : ''}`}
            style={{
                width: isMobile ? '280px' : (open ? '240px' : '64px'),
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border-subtle)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: (isMobile && !open) ? 'translateX(-100%)' : 'translateX(0)',
                boxShadow: (isMobile && open) ? '10px 0 50px rgba(0,0,0,0.3)' : 'none',
                overflow: 'hidden'
            }}
        >
            <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 1.25rem', justifyContent: (open || isMobile) ? 'space-between' : 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                {(open || isMobile) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={15} color="white" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '0.9375rem', letterSpacing: '-0.02em' }}>StudyNeo</span>
                    </div>
                )}
                {isMobile ? (
                    <button onClick={onToggle} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}>
                        <X size={20} />
                    </button>
                ) : (
                    <button onClick={onToggle} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}>
                        {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                )}
            </div>

            <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', overflowX: 'hidden' }} className="custom-scrollbar">
                {(open || isMobile) && <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.75rem' }}>Menú</p>}
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = active === item.id
                    return (
                        <button
                            key={item.id}
                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.625rem 0.75rem', borderRadius: '10px',
                                border: 'none', cursor: 'pointer',
                                background: isActive ? 'var(--accent-dim)' : 'transparent',
                                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                                transition: 'all 0.15s ease',
                                justifyContent: (open || isMobile) ? 'flex-start' : 'center'
                            }}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ flexShrink: 0 }} />
                            {(open || isMobile) && <span style={{ fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>}
                            {isActive && (open || isMobile) && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }} />}
                        </button>
                    )
                })}
            </nav>

            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '12px', background: 'var(--bg-hover)' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: user?.photoURL ? 'transparent' : 'var(--accent)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8125rem', fontWeight: 800, flexShrink: 0, overflow: 'hidden'
                    }}>
                        {user?.photoURL ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
                    </div>
                    {(open || isMobile) && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                                {isPro && <Zap size={10} color="var(--accent)" fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 4px var(--accent-dim))' }} />}
                                <div
                                    title={`Próxima sincronización en ${formatNextSync()}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'help',
                                        transition: 'all 0.4s'
                                    }}
                                >
                                    {isOffline ? (
                                        <CloudOff size={14} color="var(--red)" />
                                    ) : isQuotaExceeded ? (
                                        <CloudOff size={14} color="#f59e0b" />
                                    ) : isSyncing ? (
                                        <Cloud size={14} color="var(--accent)" className="sync-pulse" />
                                    ) : isDirty ? (
                                        <CloudOff size={14} color="#f59e0b" />
                                    ) : (
                                        <Cloud size={14} color="#10b981" />
                                    )}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onExit}
                    className="sidebar-item danger"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem',
                        borderRadius: '10px', border: 'none', background: 'transparent', color: 'var(--red)',
                        cursor: 'pointer', transition: 'all 0.15s', justifyContent: (open || isMobile) ? 'flex-start' : 'center'
                    }}
                >
                    <LogOut size={18} />
                    {(open || isMobile) && <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Salir</span>}
                </button>
            </div>
        </aside>
    )
}
