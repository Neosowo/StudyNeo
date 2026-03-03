import { useState } from 'react'
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPass({ onBack, onReset }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim() || !email.includes('@')) {
            setError('Ingresa un correo válido.')
            return
        }

        // Anti-spam protection
        const lastReset = localStorage.getItem('sd_last_reset_time')
        const now = Date.now()
        const COOLDOWN = 9 * 60 * 1000 // 9 minutes
        if (lastReset && now - parseInt(lastReset) < COOLDOWN) {
            const timeLeft = Math.ceil((COOLDOWN - (now - parseInt(lastReset))) / 60000)
            setError(`Espera ${timeLeft} minutos antes de intentar de nuevo.`)
            return
        }

        setError('')
        setLoading(true)
        const res = await onReset(email)
        setLoading(false)

        if (res.error) {
            setError(res.error)
        } else {
            localStorage.setItem('sd_last_reset_time', Date.now().toString())
            setSent(true)
        }
    }

    if (sent) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '24px', background: 'var(--green-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem'
                    }}>
                        <CheckCircle2 size={40} color="var(--green)" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-1)', marginBottom: '1rem' }}>¡Correo enviado!</h2>

                    <div style={{ background: 'var(--bg-hover)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-subtle)', marginBottom: '2.5rem', textAlign: 'left' }}>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Guía para encontrarlo:</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 900, color: 'var(--accent)' }}>1</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                                    Busca el remitente: <code style={{ color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 4px', borderRadius: '4px' }}>noreply@studyneo...</code>
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 900, color: 'var(--accent)' }}>2</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                                    Revisa <strong>Spam</strong>, <strong>Promociones</strong> o la pestaña "Otros".
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 900, color: 'var(--accent)' }}>3</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                                    Espera al menos 2 minutos; a veces el servidor de Google tarda un poco.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        <button onClick={onBack} className="btn-primary" style={{ width: '100%', height: '48px', fontWeight: 800, borderRadius: '12px' }}>
                            Regresar al inicio
                        </button>
                        <button
                            onClick={() => setSent(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-4)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', padding: '0.5rem' }}
                        >
                            ¿No llegó nada? Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '380px' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                        color: 'var(--text-4)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', marginBottom: '2.5rem',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-4)'}
                >
                    <ArrowLeft size={16} /> Volver
                </button>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                        Recuperar clave
                    </h2>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
                        Dinos tu correo y te enviaremos instrucciones para generar una nueva contraseña.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-3)', paddingLeft: '0.25rem' }}>
                            Tu correo electrónico
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="ejemplo@correo.com"
                                className="auth-input"
                                style={{ paddingLeft: '3rem' }}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '1rem', borderRadius: '12px', background: 'var(--red-dim)',
                            border: '1px solid rgba(212,32,32,0.1)', color: 'var(--red)',
                            fontSize: '0.8125rem', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center'
                        }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="auth-submit-btn"
                        style={{
                            width: '100%', height: '48px', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                            color: 'white', fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            marginTop: '0.5rem', transition: 'all 0.2s', boxShadow: '0 8px 16px var(--accent-dim)',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Procesando...' : (
                            <>
                                <span>Enviar enlace</span>
                                <ArrowRight size={18} style={{ marginLeft: 'auto' }} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
