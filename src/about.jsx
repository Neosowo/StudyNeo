import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, Info, Heart, Code, Zap } from 'lucide-react'
import './index.css'
import { storage, KEYS } from './utils/storage'

const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  return memory <= 2 || cores <= 2;
};

function AboutApp() {
  const isLowEnd = isLowEndDevice()
  const theme = storage.get(KEYS.THEME, 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className={`app-container mode-zen ${theme === 'dark' ? '' : 'is-light'} ${isLowEnd ? 'is-low-end' : ''}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isLowEnd && (
        <>
          <div className="noise-overlay" />
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
          <div className="ambient-orb ambient-orb-3" />
        </>
      )}
      {isLowEnd && <div className="static-ambient-bg" />}

      <header className="topbar scrolled" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <a href={import.meta.env.BASE_URL} className="topbar-logo enter-logo" style={{ textDecoration: 'none' }}>
          <img src={`${import.meta.env.BASE_URL}icon.png`} alt="StudyNeo" className="topbar-logo-img" />
          StudyNeo
        </a>

        <div className="topbar-actions enter-nav">
          <a href={import.meta.env.BASE_URL} className="topbar-btn" style={{ textDecoration: 'none', padding: '0 12px', gap: '8px' }}>
            <ArrowLeft size={14} /> <span className="topbar-btn-label">Volver</span>
          </a>
        </div>
      </header>
      
      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div className="feedback-card animate-slide-up" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--accent-dim)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              <Info size={24} />
            </div>
            <h1 style={{ fontSize: '28px', color: 'var(--text-1)', fontWeight: '700' }}>Sobre StudyNeo</h1>
          </div>

          <div style={{ color: 'var(--text-2)', lineHeight: '1.6', fontSize: '15px' }}>
            <p style={{ marginBottom: '20px' }}>
              <strong>StudyNeo</strong> es una plataforma de productividad diseñada para estudiantes y profesionales que buscan optimizar su tiempo de estudio sin sacrificar su bienestar mental.
            </p>
            
            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={18} /> Mi Misión
            </h2>
            <p>
              Creo que el estudio no debe ser una carga, sino un proceso fluido y organizado. Mi misión es proporcionar herramientas minimalistas pero potentes que ayuden a los usuarios a entrar en el "estado de flujo" y mantener la concentración por más tiempo.
            </p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} /> ¿Por qué StudyNeo?
            </h2>
            <p>
              A diferencia de otras aplicaciones de productividad, StudyNeo se centra en la privacidad y la velocidad. No necesitas crear una cuenta ni compartir tus datos personales. Todo se guarda localmente en tu navegador, dándote control total sobre tu información.
            </p>

            <h2 style={{ color: 'var(--text-1)', fontSize: '18px', marginTop: '24px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} /> Tecnología
            </h2>
            <p>
              StudyNeo está construido con las últimas tecnologías web para garantizar una experiencia fluida incluso en dispositivos de gama baja. Utilizamos React para la interfaz, GSAP para animaciones suaves y Firebase para nuestras funciones comunitarias anónimas.
            </p>

            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-4)' }}>Hecho con ❤️ por Erick</p>
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
    <AboutApp />
  </React.StrictMode>
)
