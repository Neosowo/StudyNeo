import { useState, useEffect } from 'react'
import { BookOpen, Menu, X, LogIn } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const LIGHT_THEMES = ['light', 'cream', 'sakura']

export default function Navbar({ onAcceder }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme } = useTheme()
    const isLight = LIGHT_THEMES.includes(theme)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Logo is always B&W — inverts based on light/dark
    const logoBg = isLight ? '#111111' : '#ffffff'
    const logoIcon = isLight ? '#ffffff' : '#111111'

    return (
        <header
            className="site-header nav-blur"
            style={{
                background: scrolled
                    ? isLight ? 'rgba(255,255,255,0.92)' : 'rgba(5,5,5,0.90)'
                    : 'transparent',
                borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
            }}
        >
            <nav>
                <a href="#" className="nav-logo">
                    <div style={{
                        width: '2.25rem', height: '2.25rem', borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px var(--accent-dim)'
                    }}>
                        <BookOpen size={16} color="white" strokeWidth={2.5} />
                    </div>
                    <span style={{ color: 'var(--text-1)', fontWeight: 800, letterSpacing: '-0.03em', fontSize: '1.25rem' }}>StudyNeo</span>
                </a>

                <button onClick={onAcceder} className="nav-cta-btn" id="nav-acceder-btn">
                    <span className="nav-cta-icon"><LogIn size={14} strokeWidth={2} /></span>
                    <span>Acceder</span>
                    <span className="nav-cta-shine" />
                </button>

                <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            {menuOpen && (
                <div className="nav-mobile-menu" style={{ background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(5,5,5,0.98)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <button
                        onClick={() => { setMenuOpen(false); onAcceder() }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--accent)', color: 'white', fontWeight: 700, padding: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.9375rem' }}
                    >
                        <LogIn size={16} /> Acceder al Panel
                    </button>
                </div>
            )}
        </header>
    )
}
