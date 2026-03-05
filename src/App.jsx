import { useEffect, useState } from 'react'
import { useAuth } from './panel/hooks/useAuth'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import SpecialTools from './components/SpecialTools'
import Footer from './components/Footer'
import AuthPage from './panel/auth/AuthPage'
import Panel from './panel/Panel'
import NoteShare from './panel/pages/NoteShare'
import Privacidad from './components/Privacidad'
import Terminos from './components/Terminos'
import Soporte from './components/Soporte'
import { ProProvider } from './ProContext'
import ForgotPass from './panel/auth/ForgotPass'
import { Mail } from 'lucide-react'

function getRoute() {
  const h = window.location.hash
  if (h.startsWith('#share/note/')) return 'share'
  if (h === '#panel') return 'panel'
  if (h === '#auth') return 'auth'
  if (h === '#privacidad') return 'privacidad'
  if (h === '#terminos') return 'terminos'
  if (h === '#soporte') return 'soporte'
  if (h === '#forgot-pass') return 'forgot-pass'
  return 'landing'
}

export default function App() {
  const { user, login, register, logout, updateUser, resetPassword } = useAuth()
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const goToAuth = () => {
    window.location.hash = '#auth'
    setRoute('auth')
  }

  const goToPanel = () => {
    window.location.hash = '#panel'
    setRoute('panel')
  }

  const exitToLanding = () => {
    window.location.hash = ''
    setRoute('landing')
  }

  // If user clicks acceder and is already logged in → go directly to panel
  const handleAcceder = () => {
    if (user) goToPanel()
    else goToAuth()
  }

  // Handle successful auth → go to panel
  const authHandlers = {
    login: async (email, password) => {
      const result = await login(email, password)
      if (result.ok) goToPanel()
      if (result.needsVerification) setRoute('verify-email')
      return result
    },
    register: async (name, email, password) => {
      const result = await register(name, email, password)
      if (result.ok) setRoute('verify-email')
      return result
    },
  }

  const handleLogout = () => {
    logout()
    exitToLanding()
  }

  // Panel route - requires auth
  if (route === 'panel') {
    if (!user) {
      window.location.hash = '#auth'
      return <AuthPage onAuth={authHandlers} />
    }
    return (
      <ProProvider>
        <Panel onExit={handleLogout} user={user} updateUser={updateUser} />
      </ProProvider>
    )
  }

  // Auth route
  if (route === 'auth') {
    // If already logged in, skip auth
    if (user) {
      goToPanel()
      return null
    }
    return <AuthPage onAuth={authHandlers} />
  }

  // Share route
  if (route === 'share') {
    const noteId = window.location.hash.split('/').pop()
    return <NoteShare noteId={noteId} />
  }

  // Legal routes
  const goLanding = () => { window.location.hash = ''; setRoute('landing') }
  if (route === 'privacidad') return <Privacidad onBack={goLanding} />
  if (route === 'terminos') return <Terminos onBack={goLanding} />
  if (route === 'soporte') return <Soporte onBack={goLanding} />
  if (route === 'forgot-pass') return <ForgotPass onBack={goLanding} onReset={resetPassword} />

  // Verify Email Route
  if (route === 'verify-email') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', textAlign: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '400px', background: 'var(--bg-surface)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ background: 'var(--accent-dim)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <Mail size={40} color="var(--accent)" />
          </div>
          <h2 style={{ fontWeight: 900, fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-1)' }}>Verifica tu correo</h2>
          <p style={{ color: 'var(--text-3)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Hemos enviado un enlace de seguridad a tu bandeja de entrada. Por favor, <b>haz clic en el enlace</b> para activar tu cuenta.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => window.location.reload()}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}
            >
              Ya verifiqué, entrar
            </button>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Landing page
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onAcceder={handleAcceder} />
      <main style={{ flex: 1 }}>
        <Hero onAcceder={handleAcceder} />
        <Features onAcceder={handleAcceder} />
        <SpecialTools onAcceder={handleAcceder} />
      </main>
      <Footer />
    </div>
  )
}
