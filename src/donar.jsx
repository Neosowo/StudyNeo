import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ArrowLeft, Heart, Coffee, CreditCard, ExternalLink, Globe, Sparkles, X, QrCode } from 'lucide-react'
import './index.css'
import { storage, KEYS } from './utils/storage'

/* ── QR Modal ─────────────────────────────────────────────── */
function QrModal({ info, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  if (!info) return null

  return (
    <div
      className="qr-overlay animate-fade"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="qr-modal animate-scale">
        <div className="qr-modal-header">
          <span className="qr-modal-title"><QrCode size={16} /> Escanea para donar</span>
          <button className="notes-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="qr-modal-body">
          <img src={info.img} alt={info.text} className="qr-image" />
          <p className="qr-caption">{info.text}</p>
          {info.url && (
            <a
              href={info.url}
              target="_blank"
              rel="noreferrer"
              className="qr-link-btn"
              style={{ background: info.color }}
            >
              <ExternalLink size={14} /> {info.label}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Donation Card ────────────────────────────────────────── */
function DonationLink({ href, onClick, icon: Icon, title, subtitle, color, bgColor, badge }) {
  const inner = (
    <>
      <div className="donation-icon" style={{ background: bgColor, color }}>
        <Icon size={24} />
      </div>
      <div className="donation-info">
        <span className="donation-title">{title}</span>
        <span className="donation-subtitle">{subtitle}</span>
      </div>
      {badge
        ? <span className="donation-badge">{badge}</span>
        : <ExternalLink size={16} className="donation-arrow" />}
    </>
  )

  if (onClick) {
    return (
      <button
        className="donation-link-card"
        style={{ '--hover-color': color, '--bg-color': bgColor }}
        onClick={onClick}
      >
        {inner}
      </button>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="donation-link-card"
      style={{ '--hover-color': color, '--bg-color': bgColor }}
    >
      {inner}
    </a>
  )
}

/* ── Main App ─────────────────────────────────────────────── */
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  return memory <= 2 || cores <= 2;
};

function DonarApp() {
  const [isLowEnd] = useState(isLowEndDevice)
  const theme = storage.get(KEYS.THEME, 'dark')
  const [qrInfo, setQrInfo] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className={`app-layout ${theme === 'dark' ? '' : 'is-light'} ${isLowEnd ? 'is-low-end' : ''}`} style={{ minHeight: '100vh' }}>
      {!isLowEnd && (
        <>
          <div className="noise-overlay" />
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
          <div className="ambient-orb ambient-orb-3" />
        </>
      )}
      {isLowEnd && <div className="static-ambient-bg" />}

      {/* Navbar — same as all other pages */}
      <header className="topbar scrolled" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <a href={import.meta.env.BASE_URL} className="topbar-logo enter-logo" style={{ textDecoration: 'none' }}>
          <img src={`${import.meta.env.BASE_URL}icon.png`} alt="StudyNeo" className="topbar-logo-img" />
          StudyNeo
        </a>
        <div className="topbar-actions enter-nav">
          <a href={import.meta.env.BASE_URL} className="topbar-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
            <ArrowLeft size={14} /> <span>Volver</span>
          </a>
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div className="feedback-card animate-slide-up" style={{ padding: '40px' }}>
          {/* Profile */}
          <div className="donation-profile" style={{ marginBottom: '32px' }}>
            <div className="donation-avatar">
              <img src="https://storage.ko-fi.com/cdn/useruploads/a7a66b56-b7e5-4c34-950a-5e755ffca8ed_3115c574-42de-4d20-9726-c707a8543944.png" alt="Developer" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              <div className="donation-avatar-badge"><Sparkles size={12} /></div>
            </div>
            <h1 className="donation-name">Apoya a StudyNeo</h1>
            <p className="donation-bio">Tu apoyo me ayuda a mantener este proyecto libre de publicidad y accesible para todos.</p>
          </div>

          {/* Donation links */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DonationLink
              onClick={() => setQrInfo({
                img: `${import.meta.env.BASE_URL}qr-paypal.jpeg`, text: 'PayPal · @neosowo',
                url: 'https://paypal.me/neosowo', label: 'Abrir PayPal.me', color: '#003087'
              })}
              icon={CreditCard}
              title="PayPal"
              subtitle="Donar vía @neosowo"
              color="#003087"
              bgColor="rgba(0, 48, 135, 0.1)"
              badge={<><QrCode size={14} /> Ver QR</>}
            />
            <DonationLink
              href="https://ko-fi.com/neosowo"
              icon={Coffee}
              title="Ko-fi"
              subtitle="Cómprame un café"
              color="#FF5E5B"
              bgColor="rgba(255, 94, 91, 0.1)"
            />
            <DonationLink
              onClick={() => setQrInfo({
                img: `${import.meta.env.BASE_URL}qr.png`, text: 'Deuna! Ecuador',
                url: null, label: null, color: '#00BFA5'
              })}
              icon={Globe}
              title="Deuna!"
              subtitle="Escanea con la app"
              color="#00BFA5"
              bgColor="rgba(0, 191, 165, 0.1)"
              badge={<><QrCode size={14} /> Ver QR</>}
            />
          </div>

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Heart size={20} style={{ color: 'var(--red)', marginBottom: '8px' }} fill="var(--red)" />
            <p style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: '500' }}>¡Gracias por todo!</p>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '11px', color: 'var(--text-4)' }}>
        StudyNeo © {new Date().getFullYear()}
      </footer>

      <QrModal info={qrInfo} onClose={() => setQrInfo(null)} />

      <style>{`
        .donation-profile { text-align: center; }
        .donation-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-2)); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; font-weight: bold; color: white; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .donation-avatar-badge { position: absolute; bottom: 0; right: 0; background: var(--yellow); color: #000; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid var(--bg-surface); }
        .donation-name { font-size: 26px; font-weight: 800; color: var(--text-1); margin-bottom: 8px; }
        .donation-bio { font-size: 14px; color: var(--text-2); line-height: 1.5; max-width: 320px; margin: 0 auto; }
        .donation-link-card { display: flex; align-items: center; padding: 16px; border-radius: 20px; background: var(--bg-hover-2); border: 1px solid var(--border-subtle); text-decoration: none; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); cursor: pointer; color: var(--text-1); width: 100%; font-family: inherit; }
        .donation-link-card:hover { transform: translateY(-3px) scale(1.01); border-color: var(--hover-color); background: var(--bg-color); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .donation-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-right: 16px; transition: transform 0.3s; flex-shrink: 0; }
        .donation-link-card:hover .donation-icon { transform: rotate(-5deg); }
        .donation-info { flex: 1; display: flex; flex-direction: column; text-align: left; }
        .donation-title { font-weight: 700; font-size: 16px; margin-bottom: 2px; }
        .donation-subtitle { font-size: 13px; color: var(--text-3); }
        .donation-arrow { color: var(--text-4); transition: transform 0.3s; }
        .donation-link-card:hover .donation-arrow { transform: translateX(3px); color: var(--hover-color); }
        .donation-badge { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--accent); background: var(--accent-dim); border: 1px solid var(--accent-border); border-radius: 10px; padding: 5px 12px; white-space: nowrap; }
        .deuna-card { cursor: default; opacity: 0.8; }
        .deuna-card:hover { transform: none !important; box-shadow: none !important; border-color: var(--border-subtle) !important; background: var(--bg-hover-2) !important; }
        /* QR Modal */
        .qr-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .qr-modal { background: var(--bg-elevated); border: 1px solid var(--border-strong); border-radius: 24px; width: 100%; max-width: 320px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.6); }
        .qr-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-subtle); }
        .qr-modal-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--text-1); }
        .qr-modal-body { display: flex; flex-direction: column; align-items: center; padding: 24px; gap: 16px; }
        .qr-image { width: 220px; height: 220px; object-fit: contain; border-radius: 16px; border: 4px solid var(--border-subtle); background: white; padding: 8px; }
        .qr-caption { font-size: 13px; font-weight: 700; color: var(--text-2); }
        .qr-link-btn { display: flex; align-items: center; gap: 8px; padding: 10px 24px; background: #003087; color: white; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none; transition: opacity 0.2s; }
        .qr-link-btn:hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DonarApp />
  </React.StrictMode>
)
