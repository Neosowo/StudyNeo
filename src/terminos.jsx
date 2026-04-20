import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, ScrollText } from 'lucide-react'
import './index.css'
import { storage, KEYS } from './utils/storage'

function TerminosApp() {
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
            <div style={{ background: 'var(--blue-dim)', padding: '10px', borderRadius: '12px', color: 'var(--blue)' }}>
              <ScrollText size={24} />
            </div>
            <h1 style={{ fontSize: '28px', color: 'var(--text-1)', fontWeight: '700' }}>Términos y Condiciones</h1>
          </div>

          <div style={{ color: 'var(--text-2)', lineHeight: '1.6', fontSize: '15px' }}>
            <p style={{ marginBottom: '20px' }}>Bienvenido a <strong>StudyNeo</strong>. Al utilizar nuestra aplicación, aceptas los siguientes términos:</p>
            
            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>1. Uso del Servicio</h2>
            <p>StudyNeo es una herramienta de productividad. Debes utilizarla de manera responsable y respetuosa, especialmente en las áreas públicas como el foro.</p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>2. Contenido del Usuario</h2>
            <p>Eres el único responsable de la información que ingresas en la aplicación. No nos hacemos responsables por la pérdida de datos debido a limpieza del navegador o fallos técnicos, ya que los datos residen localmente en tu dispositivo.</p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>3. Comportamiento en el Foro</h2>
            <p>El foro es un espacio para compartir sugerencias y feedback. Queda prohibido el lenguaje ofensivo, spam, o cualquier contenido que vulnere los derechos de otros. Nos reservamos el derecho de eliminar mensajes que no cumplan con estas normas.</p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>4. Propiedad Intelectual</h2>
            <p>El código y diseño de StudyNeo son propiedad de su creador. Puedes utilizar la aplicación para fines personales de productividad.</p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px' }}>5. Descargo de Responsabilidad</h2>
            <p>La aplicación se ofrece "tal cual", sin garantías de ningún tipo. No garantizamos que el servicio sea ininterrumpido o libre de errores.</p>

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
    <TerminosApp />
  </React.StrictMode>
)
