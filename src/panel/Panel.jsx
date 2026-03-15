import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Flashcards from './pages/Flashcards'
import Tasks from './pages/Tasks'
import Pomodoro from './pages/Pomodoro'
import Postpone from './pages/Postpone'
import LinksVault from './pages/LinksVault'
import Calendar from './pages/Calendar'
import Habits from './pages/Habits'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import GradeCalc from './pages/GradeCalc'
import Eisenhower from './pages/Eisenhower'
import MusicQueue from './pages/MusicQueue'
import BrainJournal from './pages/BrainJournal'
import Community from './pages/Community'
import { Menu, X, WifiOff, Zap, Lock } from 'lucide-react'
import { useProContext } from '../ProContext'
import { WidgetProvider } from './components/FloatingWidgets'
import { AudioPlayerProvider } from './context/AudioPlayerContext'
import { PostponeProvider } from './context/PostponeContext'

const PAGES = {
    dashboard: Dashboard,
    notes: Notes,
    flashcards: Flashcards,
    tasks: Tasks,
    pomodoro: Pomodoro,
    postpone: Postpone,
    calendar: Calendar,
    habits: Habits,
    stats: Stats,
    links: LinksVault,
    gradecalc: GradeCalc,
    eisenhower: Eisenhower,
    spotify: MusicQueue,
    bitacora: BrainJournal,
    community: Community,
    settings: Settings,
}

const FULL_HEIGHT_PAGES = ['notes', 'calendar', 'flashcards']

export default function Panel({ user, onExit, updateUser }) {
    const { isPro } = useProContext()
    const [activePage, setActivePage] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
    const [isOffline, setIsOffline] = useState(!navigator.onLine)

    useEffect(() => {
        const handleOnline = () => setIsOffline(false)
        const handleOffline = () => setIsOffline(true)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        let lastWidth = window.innerWidth
        const handleResize = () => {
            const width = window.innerWidth
            const wasMobile = lastWidth < 1024
            const isNowMobile = width < 1024

            if (wasMobile !== isNowMobile) {
                setIsMobile(isNowMobile)
                setSidebarOpen(!isNowMobile)
            }
            lastWidth = width
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const PageComponent = PAGES[activePage]
    const isFullHeight = FULL_HEIGHT_PAGES.includes(activePage)

    const handleNavigate = (page) => {
        setActivePage(page)
        if (isMobile) setSidebarOpen(false)
    }

    if (isOffline && !isPro) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                    <WifiOff size={40} color="var(--accent)" />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-1)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>No tienes conexión</h1>
                <p style={{ color: 'var(--text-3)', fontSize: '1.125rem', maxWidth: '440px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                    Usar la plataforma <strong>sin internet (Offline)</strong> y acceder a todos tus apuntes es una función exclusiva del <strong>Plan Pro</strong>.
                </p>

                <div style={{ padding: '1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', maxWidth: '440px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Zap size={18} color="white" />
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-2)', textAlign: 'left', margin: 0, lineHeight: 1.5 }}>
                        Conéctate a internet para continuar usando el <strong>Plan Gratis</strong> o adquiere el <strong>Plan Pro</strong> para estudiar offline en cualquier momento.
                    </p>
                </div>

                <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                    Reintentar conexión
                </button>
            </div>
        )
    }

    return (
        <PostponeProvider>
            <AudioPlayerProvider>
                <WidgetProvider>
                    <div className={`panel-root ${isMobile ? 'is-mobile' : 'is-desktop'} ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>

                    {/* Botón flotante para móvil */}
                    {isMobile && (
                        <button
                            className={`mobile-toggle-btn ${sidebarOpen ? 'is-hidden' : 'is-visible'}`}
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                    )}

                    {/* Overlay para móvil */}
                    {isMobile && sidebarOpen && (
                        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
                    )}

                    <Sidebar
                        active={activePage}
                        onNavigate={handleNavigate}
                        onExit={onExit}
                        open={sidebarOpen}
                        onToggle={() => setSidebarOpen(o => !o)}
                        user={user}
                        isMobile={isMobile}
                    />

                    <main
                        className="panel-main"
                        style={{
                            marginLeft: isMobile ? '0' : (sidebarOpen ? '240px' : '64px'),
                            transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            width: isMobile ? '100%' : `calc(100% - ${sidebarOpen ? '240' : '64'}px)`,
                            ...(isFullHeight ? { overflow: 'hidden', height: '100vh' } : {}),
                        }}
                    >
                        <PageComponent user={user} updateUser={updateUser} activePage={activePage} />
                    </main>

                    <style>{`
                .panel-root { display: flex; min-height: 100vh; background: var(--bg-base); }
                @media (max-width: 1024px) {
                    .panel-main { 
                        padding-top: 72px !important;
                        margin-left: 0 !important; 
                        width: 100% !important;
                        overflow-x: hidden;
                    }
                }
            `}</style>
                    </div>
                </WidgetProvider>
            </AudioPlayerProvider>
        </PostponeProvider>
    )
}
