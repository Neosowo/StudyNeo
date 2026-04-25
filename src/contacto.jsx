import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import './index.css'
import { storage, KEYS } from './utils/storage'

const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  return memory <= 2 || cores <= 2;
};

function ContactoApp() {
  const isLowEnd = isLowEndDevice()
  const theme = storage.get(KEYS.THEME, 'dark')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    // En un caso real, aquí iría la lógica de envío (ej: EmailJS o un endpoint backend)
  }

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
      
      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div className="feedback-card animate-slide-up" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--accent-dim)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              <Mail size={24} />
            </div>
            <h1 style={{ fontSize: '28px', color: 'var(--text-1)', fontWeight: '700' }}>Contacto</h1>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-2)', fontSize: '15px' }}>
                ¿Tienes alguna pregunta, sugerencia o problema técnico? Envíame un mensaje y te responderé lo antes posible.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-1)', fontSize: '14px', fontWeight: '500' }}>Nombre</label>
                <input 
                  type="text" 
                  required 
                  className="todo-input" 
                  placeholder="Tu nombre" 
                  style={{ width: '100%', background: 'var(--bg-hover-2)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px', color: 'var(--text-1)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-1)', fontSize: '14px', fontWeight: '500' }}>Correo Electrónico</label>
                <input 
                  type="email" 
                  required 
                  className="todo-input" 
                  placeholder="tu@email.com" 
                  style={{ width: '100%', background: 'var(--bg-hover-2)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px', color: 'var(--text-1)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-1)', fontSize: '14px', fontWeight: '500' }}>Mensaje</label>
                <textarea 
                  required 
                  rows="5"
                  className="todo-input" 
                  placeholder="¿En qué podemos ayudarte?" 
                  style={{ width: '100%', background: 'var(--bg-hover-2)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px', color: 'var(--text-1)', resize: 'none' }}
                ></textarea>
              </div>

              <button type="submit" className="nav-settings-apply" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', marginTop: '10px' }}>
                <Send size={16} /> Enviar Mensaje
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }} className="animate-fade">
              <CheckCircle2 size={48} style={{ color: 'var(--green)', marginBottom: '16px' }} />
              <h2 style={{ fontSize: '24px', color: 'var(--text-1)', marginBottom: '12px' }}>¡Mensaje Enviado!</h2>
              <p style={{ color: 'var(--text-2)', marginBottom: '24px' }}>
                Gracias por contactarme. He recibido tu mensaje y te responderé pronto.
              </p>
              <button onClick={() => setSubmitted(false)} className="topbar-btn" style={{ margin: '0 auto' }}>
                Enviar otro mensaje
              </button>
            </div>
          )}

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-4)' }}>También puedes escribirme a: <strong>studyneo.sup@gmail.com</strong></p>
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
    <ContactoApp />
  </React.StrictMode>
)
