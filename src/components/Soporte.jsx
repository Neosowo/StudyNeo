import { BookOpen, ArrowLeft, Headphones, Send, HelpCircle, ChevronDown, ChevronUp, Check, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { db, auth } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const CONTACT_EMAIL = 'studyneo.sup@gmail.com'

const faqs = [
    {
        q: '¿StudyNeo funciona sin internet?',
        a: 'Sí. Todo se guarda primero en tu dispositivo. Puedes usar notas, tareas, flashcards y el Pomodoro sin conexión. La sincronización con la nube ocurre automáticamente cuando vuelves a conectarte.',
    },
    {
        q: '¿Puedo usar StudyNeo en mi celular?',
        a: 'Sí, StudyNeo está optimizado para móviles. Desde cualquier navegador en tu celular, entra a la misma URL y accede con tu cuenta. Toda tu información estará sincronizada.',
    },
    {
        q: '¿Cómo recupero mi contraseña?',
        a: 'Usa el formulario de contacto de esta página o escríbeme directamente. Cuéntame tu correo de cuenta y te ayudaré a restablecer el acceso en menos de 24 horas.',
    },
    {
        q: '¿Puedo eliminar mi cuenta?',
        a: 'Sí. Ve a Configuración → Cuenta y encontrarás la opción de eliminar tu cuenta permanentemente. Esta acción borra todos tus datos de la nube de forma irreversible.',
    },
    {
        q: '¿Cómo activo el Plan Pro?',
        a: 'Apoya el proyecto desde el pie de página (Ko-fi o Deuna), luego escríbeme con tu correo de StudyNeo y la captura del pago. Te enviaré un código de activación que ingresas en Configuración → Plan Pro.',
    },
    {
        q: '¿Qué pasa si se agota la cuota de Firebase?',
        a: 'StudyNeo sigue funcionando al 100% en modo local. Cuando se restablezca la sincronización en la nube, todos tus datos se sincronizarán automáticamente sin pérdida de información.',
    },
    {
        q: '¿Cómo reporto un error?',
        a: 'Usa el formulario de contacto en esta misma página. Describe el problema y, si puedes, incluye pasos para reproducirlo. Responderé en menos de 48 horas.',
    },
]

const MESSAGE_TYPES = [
    { value: 'soporte', label: '🛠️ Soporte técnico' },
    { value: 'pro', label: '⚡ Activar Plan Pro' },
    { value: 'error', label: '🐛 Reportar un error' },
    { value: 'sugerencia', label: '💡 Sugerencia' },
    { value: 'otro', label: '💬 Otro' },
]

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{
            background: 'var(--bg-surface)', border: `1px solid ${open ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
            borderRadius: '12px', overflow: 'hidden', marginBottom: '0.625rem', transition: 'border-color 0.2s',
        }}>
            <button onClick={() => setOpen(o => !o)} style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.25rem',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-1)',
                fontWeight: 600, fontSize: '0.9375rem', fontFamily: 'inherit'
            }}>
                <span>{q}</span>
                {open ? <ChevronUp size={16} color="var(--accent)" /> : <ChevronDown size={16} color="var(--text-4)" />}
            </button>
            {open && (
                <div style={{ padding: '0 1.25rem 1rem', color: 'var(--text-3)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {a}
                </div>
            )}
        </div>
    )
}

function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', type: 'soporte', message: '' })
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState(null)

    // Pre-fill if user is logged in
    const user = auth.currentUser
    const initialEmail = user?.email || ''
    const initialName = user?.displayName || ''

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!form.name.trim()) return setError('Por favor ingresa tu nombre.')
        if (!form.email.trim() || !form.email.includes('@')) return setError('Ingresa un correo válido.')
        if (!form.message.trim() || form.message.length < 10) return setError('El mensaje debe tener al menos 10 caracteres.')

        setSending(true)
        try {
            await addDoc(collection(db, 'messages'), {
                name: form.name.trim(),
                email: form.email.trim(),
                type: form.type,
                message: form.message.trim(),
                uid: user?.uid || null,
                read: false,
                replied: false,
                createdAt: serverTimestamp(),
            })
            setSent(true)
        } catch (err) {
            if (!navigator.onLine) {
                setError('Sin conexión. Por favor escríbeme directamente a ' + CONTACT_EMAIL)
            } else {
                setError('Error al enviar. Inténtalo de nuevo o escríbeme a ' + CONTACT_EMAIL)
            }
        }
        setSending(false)
    }

    if (sent) return (
        <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.3)',
            borderRadius: '16px', padding: '2rem', textAlign: 'center'
        }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
            <h3 style={{ fontWeight: 800, color: 'var(--text-1)', marginBottom: '0.5rem' }}>¡Mensaje enviado!</h3>
            <p style={{ color: 'var(--text-3)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Lo recibí y te responderé en <strong style={{ color: 'var(--text-2)' }}>menos de 48 horas</strong>.
                Revisa también tu carpeta de spam.
            </p>
            <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', type: 'soporte', message: '' }) }}
                style={{ marginTop: '1.25rem', background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-3)', borderRadius: '10px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8125rem' }}
            >
                Enviar otro mensaje
            </button>
        </div>
    )

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Tu nombre *</label>
                    <input
                        className="panel-input"
                        value={form.name || initialName}
                        onChange={e => set('name', e.target.value)}
                        placeholder="Juan García"
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Tu correo *</label>
                    <input
                        className="panel-input"
                        type="email"
                        value={form.email || initialEmail}
                        onChange={e => set('email', e.target.value)}
                        placeholder="tu@correo.com"
                    />
                </div>
            </div>

            <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Tipo de mensaje *</label>
                <select
                    className="panel-input"
                    value={form.type}
                    onChange={e => set('type', e.target.value)}
                    style={{ width: '100%', cursor: 'pointer' }}
                >
                    {MESSAGE_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>Mensaje *</label>
                <textarea
                    className="panel-input"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Describe tu consulta con el mayor detalle posible..."
                    rows={5}
                    style={{ resize: 'vertical', minHeight: '120px', width: '100%', boxSizing: 'border-box' }}
                />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-4)' }}>{form.message.length} caracteres</span>
            </div>

            {error && (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(212,32,32,0.08)', border: '1px solid rgba(212,32,32,0.25)', borderRadius: '10px', color: 'var(--red)', fontSize: '0.8125rem', fontWeight: 600 }}>
                    ⚠️ {error}
                </div>
            )}

            <button
                type="submit"
                disabled={sending}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.875rem', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    color: 'white', fontWeight: 800, fontSize: '0.9375rem',
                    cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    opacity: sending ? 0.7 : 1, transition: 'all 0.2s'
                }}
            >
                <Send size={16} /> {sending ? 'Enviando...' : 'Enviar mensaje'}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', textAlign: 'center', lineHeight: 1.5 }}>
                También puedes escribirme directamente a{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>{CONTACT_EMAIL}</a>
            </p>
        </form>
    )
}

export default function Soporte({ onBack }) {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
            {/* Header */}
            <header style={{
                background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)',
                padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                position: 'sticky', top: 0, zIndex: 100
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600,
                        fontSize: '0.875rem', padding: '6px 10px', borderRadius: '8px', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                    <ArrowLeft size={16} /> Volver al inicio
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                    <div style={{
                        width: '1.875rem', height: '1.875rem', borderRadius: '9px',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <BookOpen size={14} color="white" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>StudyNeo</span>
                </div>
            </header>

            <main style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
                {/* Hero */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Headphones size={26} color="var(--accent)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', margin: 0 }}>
                            Soporte & Contacto
                        </h1>
                        <p style={{ color: 'var(--text-4)', fontSize: '0.8125rem', margin: '4px 0 0' }}>
                            Responderé en menos de 48 horas hábiles
                        </p>
                    </div>
                </div>
                <p style={{ color: 'var(--text-3)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
                    ¿Tienes algún problema, sugerencia o quieres activar tu Plan Pro? Escríbeme directamente desde aquí.
                </p>

                {/* Contact form */}
                <div style={{
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: '20px', padding: '1.75rem', marginBottom: '3rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                        <MessageSquare size={18} color="var(--accent)" />
                        <h2 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-1)', margin: 0 }}>
                            Envíame un mensaje
                        </h2>
                    </div>
                    <ContactForm />
                </div>

                {/* FAQ */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HelpCircle size={20} color="var(--accent)" /> Preguntas frecuentes
                    </h2>
                    {faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
                </div>
            </main>
        </div>
    )
}
