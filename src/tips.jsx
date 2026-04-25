import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, BookOpen, Clock, Brain, Coffee, Target } from 'lucide-react'
import './index.css'
import { storage, KEYS } from './utils/storage'

const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  return memory <= 2 || cores <= 2;
};

function TipsApp() {
  const isLowEnd = isLowEndDevice()
  const theme = storage.get(KEYS.THEME, 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const articles = [
    {
      icon: <Clock />,
      title: "La Técnica Pomodoro: Cómo empezar",
      content: "La técnica Pomodoro consiste en dividir tu tiempo de estudio en bloques de 25 minutos seguidos de 5 minutos de descanso. Esto ayuda a mantener la frescura mental y evita el agotamiento. Después de cuatro bloques, toma un descanso más largo de 15 a 30 minutos."
    },
    {
      icon: <Brain />,
      title: "Entrando en el Estado de Flujo",
      content: "El estado de flujo es cuando estás tan inmerso en una actividad que pierdes la noción del tiempo. Para lograrlo, elimina las distracciones externas (notificaciones de móvil) y asegúrate de que el desafío de la tarea coincida con tus habilidades."
    },
    {
      icon: <Coffee />,
      title: "La Importancia de los Descansos",
      content: "El cerebro humano no puede mantener una concentración intensa durante horas. Los descansos cortos permiten que tu memoria de trabajo se 'limpie' y consolide la información aprendida. Durante el descanso, intenta alejarte de las pantallas."
    },
    {
      icon: <Target />,
      title: "Metas SMART para Estudiantes",
      content: "Define objetivos que sean Específicos, Medibles, Alcanzables, Relevantes y con un Tiempo definido. En lugar de decir 'voy a estudiar matemáticas', di 'voy a resolver 5 problemas de álgebra en 25 minutos'."
    }
  ]

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
      
      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade">
          <h1 style={{ fontSize: '32px', color: 'var(--text-1)', fontWeight: '800', marginBottom: '12px' }}>Consejos de Productividad</h1>
          <p style={{ color: 'var(--text-2)', fontSize: '16px' }}>Mejora tu rendimiento con estas técnicas probadas científicamente.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {articles.map((art, i) => (
            <div key={i} className="feedback-card animate-slide-up" style={{ padding: '30px', animationDelay: `${i * 0.1}s` }}>
              <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>
                {React.cloneElement(art.icon, { size: 28 })}
              </div>
              <h2 style={{ fontSize: '20px', color: 'var(--text-1)', marginBottom: '12px', fontWeight: '700' }}>{art.title}</h2>
              <p style={{ color: 'var(--text-2)', lineHeight: '1.6', fontSize: '14px' }}>{art.content}</p>
            </div>
          ))}
        </div>

        <div className="feedback-card animate-slide-up" style={{ marginTop: '40px', padding: '40px', textAlign: 'center' }}>
          <BookOpen size={32} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '22px', color: 'var(--text-1)', marginBottom: '12px' }}>¿Quieres aprender más?</h2>
          <p style={{ color: 'var(--text-2)', maxWidth: '600px', margin: '0 auto' }}>
            Estoy trabajando en una guía completa de estudio que publicaré pronto. Únete a nuestra comunidad para estar al tanto de las novedades.
          </p>
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
    <TipsApp />
  </React.StrictMode>
)
