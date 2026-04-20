import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, Shield } from 'lucide-react'
import './index.css'
import { storage, KEYS } from './utils/storage'

function PrivacidadApp() {
  const theme = storage.get(KEYS.THEME, 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className={`app-container mode-zen ${theme === 'dark' ? '' : 'is-light'}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="noise-overlay" />
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />

      <header className="topbar scrolled" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <a href="/" className="topbar-logo enter-logo" style={{ textDecoration: 'none' }}>
          <img src="/./icon.png" alt="StudyNeo" className="topbar-logo-img" />
          StudyNeo
        </a>

        <div className="topbar-actions enter-nav">
          <a href="/" className="topbar-btn" style={{ textDecoration: 'none', padding: '0 12px', gap: '8px' }}>
            <ArrowLeft size={14} /> <span className="topbar-btn-label">Volver</span>
          </a>
        </div>
      </header>
      
      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div className="feedback-card animate-slide-up" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--accent-dim)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              <Shield size={24} />
            </div>
            <h1 style={{ fontSize: '28px', color: 'var(--text-1)', fontWeight: '700' }}>Política de Privacidad</h1>
          </div>

          <div style={{ color: 'var(--text-2)', lineHeight: '1.6', fontSize: '15px' }}>
            <p style={{ marginBottom: '20px' }}>En <strong>StudyNeo</strong>, valoramos tu privacidad por encima de todo. Nuestra filosofía es simple: <strong>No recolectamos tus datos personales.</strong></p>
            
            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>1. Información que NO recolectamos</h2>
            <p>No guardamos nombres, correos electrónicos, ni ninguna información de identificación personal. No utilizamos cookies de rastreo de terceros.</p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>2. Almacenamiento Local</h2>
            <p>Tus tareas, notas y configuraciones se guardan exclusivamente en el <strong>almacenamiento local (LocalStorage)</strong> de tu navegador. Esto significa que los datos nunca salen de tu dispositivo a menos que decidas exportarlos manualmente.</p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>3. Foro y Sugerencias</h2>
            <p>El foro de sugerencias es <strong>completamente anónimo</strong>. No guardamos direcciones IP ni identidades de los usuarios. Cualquier mensaje que publiques será visible para todos de forma anónima.</p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>4. Servicios de Terceros</h2>
            <p>Utilizamos Firebase para las funciones de tiempo real (contador de usuarios en línea y foro), pero no asociamos ninguna identidad a tu conexión.</p>

            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-4)' }}>Última actualización: Abril 2026</p>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '11px', color: 'var(--text-4)' }}>
        StudyNeo © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivacidadApp />
  </React.StrictMode>
)
