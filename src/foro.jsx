import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, Shield, ScrollText, MoreHorizontal, Sparkles, Github } from 'lucide-react'
import FeedbackForum from './components/FeedbackForum'
import './index.css'
import { storage, KEYS } from './utils/storage'
import { db, ref, onValue, push, set, onDisconnect } from './utils/firebase'

/* ══════════════════════════════════════════════════════════ */
/* ONLINE USERS MATCHING (Presence)                             */
/* ══════════════════════════════════════════════════════════ */
function OnlineUsers() {
  const [online, setOnline] = useState(1);
  useEffect(() => {
    if (!db) return;
    const connectedRef = ref(db, '.info/connected');
    const myConnRef = push(ref(db, 'studyneo/presence'));
    const unsubConn = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(myConnRef, true);
        onDisconnect(myConnRef).remove();
      }
    });
    const unsubPres = onValue(ref(db, 'studyneo/presence'), (snap) => {
      setOnline(snap.val() ? Object.keys(snap.val()).length : 1);
    });
    return () => { unsubConn(); unsubPres() };
  }, []);
  
  return (
    <div className="topbar-btn" style={{ pointerEvents: 'none', gap: '6px' }} title="Usuarios activos en este momento">
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', animation: 'glow-pulse 2s infinite' }} />
      <span className="topbar-btn-label" style={{ fontWeight: 'bold' }}>{online} en línea</span>
    </div>
  )
}

function ForoApp() {
  const theme = storage.get(KEYS.THEME, 'dark')
  const [footerMenuOpen, setFooterMenuOpen] = useState(false)
  const footerMenuRef = useRef(null)

  useEffect(() => {
    if (!footerMenuOpen) return
    const h = e => { if (footerMenuRef.current && !footerMenuRef.current.contains(e.target)) setFooterMenuOpen(false) }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [footerMenuOpen])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className={`app-container mode-zen ${theme === 'dark' ? '' : 'is-light'}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background orbs */}
      <div className="noise-overlay" />
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />

      {/* Topbar minimalist and perfectly aligned */}
      <header className="topbar scrolled" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <a href="/" className="topbar-logo enter-logo" style={{ textDecoration: 'none' }}>
          <img src="dist/icon.png" alt="StudyNeo" className="topbar-logo-img" />
          StudyNeo
        </a>

        <div className="topbar-actions enter-nav">
          <OnlineUsers />
          <a href="/" className="topbar-btn" style={{ textDecoration: 'none', padding: '0 12px', gap: '8px' }}>
            <ArrowLeft size={14} /> <span className="topbar-btn-label">Volver al Reloj</span>
          </a>
        </div>
      </header>
      
      <main style={{ flex: 1, padding: '20px 0' }}>
        <FeedbackForum onBack={() => window.location.href = '/'} lang={storage.get(KEYS.SETTINGS, {}).lang || 'es'} />
      </main>

      <footer className="app-footer">
        <div className="footer-links">
          <a href="/donar.html" className="footer-link donate-link">
            <Sparkles size={14} /> Donar
          </a>

          <a href="https://github.com/neosowo" target="_blank" rel="noreferrer" className="footer-link">
            <Github size={14} /> GitHub
          </a>

          <div className="footer-menu-container" ref={footerMenuRef}>
            <button 
              className={`footer-link ${footerMenuOpen ? 'active' : ''}`} 
              onClick={() => setFooterMenuOpen(!footerMenuOpen)}
            >
              <MoreHorizontal size={14} />
            </button>
            
            {footerMenuOpen && (
              <div className="footer-popover animate-scale">
                <a href="/privacidad.html" className="footer-popover-item">
                  <Shield size={12} /> Privacidad
                </a>
                <a href="/terminos.html" className="footer-popover-item">
                  <ScrollText size={12} /> Términos
                </a>
              </div>
            )}
          </div>
        </div>
        <p className="footer-credits">StudyNeo © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ForoApp />
  </React.StrictMode>
)
