import { useState } from 'react'
import { BookOpen, Eye, EyeOff, LogIn, UserPlus, ArrowRight, Sparkles, Brain, FileText, Timer, Calendar, Flame, AlertCircle } from 'lucide-react'

function AuthInput({ label, type, value, onChange, placeholder, id }) {
    const [show, setShow] = useState(false)
    const isPass = type === 'password'
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label htmlFor={id} style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-3)', paddingLeft: '0.25rem' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    id={id}
                    type={isPass && show ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="auth-input"
                    autoComplete={isPass ? 'current-password' : 'off'}
                    style={{
                        paddingRight: isPass ? '2.5rem' : '1rem'
                    }}
                />
                {isPass && (
                    <button
                        type="button"
                        onClick={() => setShow(s => !s)}
                        style={{
                            position: 'absolute', right: '0.875rem', top: '50%',
                            transform: 'translateY(-50%)', background: 'none', border: 'none',
                            color: 'var(--text-4)', cursor: 'pointer', display: 'flex',
                            padding: '0.25rem', borderRadius: '6px', transition: 'color 0.2s'
                        }}
                    >
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    )
}

export default function AuthPage({ onAuth }) {
    const [mode, setMode] = useState('login') // 'login' | 'register'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const reset = () => { setName(''); setEmail(''); setPassword(''); setConfirm(''); setError('') }
    const switchMode = (m) => { setMode(m); reset() }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (mode === 'register') {
            if (!name.trim()) return setError('El nombre es requerido.')
            if (!email.includes('@')) return setError('Email no válido.')
            if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
            if (password !== confirm) return setError('Las contraseñas no coinciden.')
        }

        setLoading(true)
        await new Promise(r => setTimeout(r, 600)) // simulate network

        const result = await (mode === 'login'
            ? onAuth.login(email, password)
            : onAuth.register(name.trim(), email, password))

        setLoading(false)
        if (result.error) setError(result.error)
    }

    return (
        <div className="auth-root" style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex' }}>
            {/* Left panel - branding */}
            <div className="auth-brand-panel" style={{
                flex: 1, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '2rem', borderRight: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden'
            }}>
                <div className="auth-brand-inner" style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3.5rem' }}>
                        <div style={{
                            width: '2.5rem', height: '2.5rem', borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px var(--accent-dim)'
                        }}>
                            <BookOpen size={20} color="white" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
                            StudyNeo
                        </span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-1)', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
                        Tu estudio<br />
                        <span style={{ color: 'var(--accent)' }}>dinámico</span><br />
                        y autónomo.
                    </h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '360px' }}>
                        Notas, flashcards, tareas y Pomodoro en un solo lugar. Diseñado para que fluyas.
                    </p>

                    <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                            [Brain, 'Flashcards con repetición espaciada'],
                            [FileText, 'Editor de notas persistente'],
                            [Timer, 'Pomodoro con contador de sesiones'],
                            [Calendar, 'Calendario de exámenes y tareas'],
                            [Flame, 'Hábitos con racha diaria'],
                        ].map(([Icon, text]) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', color: 'var(--text-3)', fontSize: '0.9375rem', fontWeight: 500 }}>
                                <span style={{ background: 'var(--bg-hover)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                    <Icon size={16} color="var(--accent)" />
                                </span>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative glow */}
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--accent)', filter: 'blur(120px)', opacity: 0.08, borderRadius: '50%' }} />
            </div>

            {/* Right panel - form */}
            <div className="auth-form-panel" style={{ flex: '0 0 520px', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="auth-form-inner" style={{ width: '100%', maxWidth: '360px' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                            {mode === 'login' ? '¡Qué bueno verte!' : 'Únete a StudyNeo'}
                        </h2>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-3)' }}>
                            {mode === 'login'
                                ? 'Inicia sesión para retomar tus metas.'
                                : 'Tu primer paso hacia el estudio inteligente.'}
                        </p>
                    </div>

                    {/* Mode tabs */}
                    <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '12px', padding: '4px', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
                        {[['login', <LogIn size={14} />, 'Entrar'], ['register', <UserPlus size={14} />, 'Registro']].map(([m, icon, label]) => (
                            <button
                                key={m}
                                onClick={() => switchMode(m)}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    padding: '0.625rem 1rem', borderRadius: '9px', border: 'none', cursor: 'pointer',
                                    fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: 700,
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: mode === m ? 'var(--accent)' : 'transparent',
                                    color: mode === m ? 'white' : 'var(--text-3)',
                                    boxShadow: mode === m ? '0 4px 12px var(--accent-dim)' : 'none'
                                }}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {mode === 'register' && (
                            <>
                                <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', marginBottom: '0.5rem' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', lineHeight: 1.4, fontWeight: 500 }}>
                                        <Sparkles size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} color="var(--accent)" />
                                        Usa un <strong>correo real</strong> al que tengas acceso. 
                                    </p>
                                </div>
                                <AuthInput id="auth-name" label="¿Cómo te llamas?" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
                            </>
                        )}
                        <AuthInput id="auth-email" label="Tu correo" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
                        <AuthInput id="auth-pass" label="Tu clave" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
                        {mode === 'register' && (
                            <AuthInput id="auth-confirm" label="repite la clave" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirmar contraseña" />
                        )}

                        {mode === 'login' && (
                            <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                                <a href="#forgot-pass" style={{ fontSize: '0.8125rem', color: 'var(--text-4)', textDecoration: 'none', fontWeight: 600 }}>
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        )}

                        {error && (
                            <div style={{ padding: '0.875rem', borderRadius: '10px', background: 'var(--red-dim)', border: '1px solid rgba(212,32,32,0.15)', color: 'var(--red)', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-submit-btn"
                            style={{
                                width: '100%', height: '48px', borderRadius: '12px', border: 'none',
                                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                                color: 'white', fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                padding: '0 1.25rem', marginTop: '0.5rem', transition: 'all 0.2s',
                                boxShadow: '0 8px 16px var(--accent-dim)',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? (
                                <span style={{ margin: 'auto', display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                            ) : (
                                <>
                                    <span>{mode === 'login' ? 'Entrar a estudiar' : 'Comenzar ahora'}</span>
                                    <ArrowRight size={18} style={{ marginLeft: 'auto' }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode switch helper for small screens or alternate feel */}
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-4)' }}>
                        {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, marginLeft: '0.5rem', cursor: 'pointer' }}>
                            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                        </button>
                    </p>

                </div>
            </div>
        </div>
    )
}
