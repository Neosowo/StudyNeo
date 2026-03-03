/**
 * ProUpgradeModal.jsx
 * Modal de solicitud de Plan Pro con:
 * - Instrucciones de pago (Deuna QR + Ko-fi)
 * - Campo de mensaje
 * - Subida de captura de pantalla a Firebase Storage
 * - Guarda la solicitud en Firestore → proRequests
 * 
 * El admin la verá en #admin → Solicitudes Pro con la imagen adjunta
 * y podrá generar + enviar el código con un clic.
 */
import { useState, useRef } from 'react'
import { db, auth } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {
    X, Send, Check, Zap, Coffee, ImagePlus,
    AlertCircle, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react'

function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return [4, 4, 4].map(len => {
        let s = ''
        for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
        return s
    }).join('-')
}

// ── Overlay ────────────────────────────────────────────────────────────────────
function Overlay({ children, onClose }) {
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem', animation: 'fadeIn 0.2s ease'
            }}
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()} style={{
                background: 'var(--bg-surface)', border: '1.5px solid var(--accent-border)',
                borderRadius: '22px', padding: '0', maxWidth: '480px', width: '100%',
                maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 0 80px var(--accent-dim), 0 24px 80px rgba(0,0,0,0.5)',
                position: 'relative'
            }}>
                {children}
            </div>
        </div>
    )
}

// ── Step indicator ─────────────────────────────────────────────────────────────
function Steps({ current, total }) {
    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} style={{
                    height: '4px', borderRadius: '2px', transition: 'all 0.3s',
                    flex: i === current ? 2 : 1,
                    background: i <= current ? 'var(--accent)' : 'var(--border-default)',
                }} />
            ))}
        </div>
    )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ProUpgradeModal({ onClose }) {
    const [step, setStep] = useState(0)
    const [method, setMethod] = useState('deuna')
    const [name, setName] = useState(auth.currentUser?.displayName || '')
    const [email, setEmail] = useState(auth.currentUser?.email || '')
    const [message, setMessage] = useState('')
    const [file, setFile] = useState(null)
    const [previewURL, setPreviewURL] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const fileRef = useRef()

    const handleFile = (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (f.size > 5 * 1024 * 1024) { setError('Imagen demasiado grande. Máximo 5 MB.'); return }
        if (!f.type.startsWith('image/')) { setError('Solo se permiten imágenes.'); return }
        setFile(f)
        setPreviewURL(URL.createObjectURL(f))
        setError(null)
    }

    const handleSubmit = async () => {
        setError(null)
        if (!name.trim()) return setError('Ingresa tu nombre.')
        if (!email.includes('@')) return setError('Ingresa un correo válido.')
        if (!message.trim()) return setError('Indica detalles del pago.')
        if (!file) return setError('Adjunta la captura del comprobante.')

        setUploading(true)
        try {
            // Conversión a Base64 con compresión agresiva (para que entre en Firestore)
            const base64Image = await new Promise((resolve, reject) => {
                const img = new Image()
                const url = URL.createObjectURL(file)
                img.onload = () => {
                    URL.revokeObjectURL(url)
                    const canvas = document.createElement('canvas')
                    const MAX_SIZE = 800 // Reducimos tamaño para ahorrar espacio
                    let w = img.width, h = img.height
                    if (w > h) { if (w > MAX_SIZE) { h *= MAX_SIZE / w; w = MAX_SIZE } }
                    else { if (h > MAX_SIZE) { w *= MAX_SIZE / h; h = MAX_SIZE } }
                    canvas.width = w; canvas.height = h
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, w, h)
                    resolve(canvas.toDataURL('image/jpeg', 0.6)) // Calidad 60%
                }
                img.onerror = reject
                img.src = url
            })

            await addDoc(collection(db, 'proRequests'), {
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                screenshotBase64: base64Image, // Guardamos la imagen como texto
                uid: auth.currentUser?.uid || null,
                status: 'pending',
                method: method,
                createdAt: serverTimestamp(),
            })

            setStep(2)
        } catch (err) {
            console.error(err)
            setError('Error al enviar. Inténtalo de nuevo.')
        }
        setUploading(false)
    }

    return (
        <Overlay onClose={onClose}>
            {/* Header */}
            <div style={{
                padding: '1.25rem 1.5rem 1rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={16} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: '0.9375rem', color: 'var(--text-1)' }}>Obtener Plan Pro</div>
                        {(step === 1 || step === 2) && <Steps current={step} total={2} />}
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'var(--bg-hover)', border: 'none', color: 'var(--text-3)', cursor: 'pointer', borderRadius: '8px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={16} />
                </button>
            </div>

            <div style={{ padding: '1.5rem' }}>

                {/* ── PASO 0: MÉTODOS DE PAGO ─────────────────────────────────── */}
                {step === 0 && (
                    <div>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-2)', fontWeight: 700, marginBottom: '0.375rem' }}>
                            Obtener Plan Pro
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                            Desbloquea <strong>recursos ilimitados</strong> (notas, tareas, flashcards y links), temporizador Pomodoro personalizado, 6 temas premium, <strong>modo offline (sin internet)</strong> y <strong>auto-guardado rápido (1 min)</strong>. Es <strong>solo un pago de $5.00</strong> y el acceso es tuyo para siempre.
                        </p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                            <button onClick={() => setMethod('deuna')} style={{ flex: 1, padding: '0.625rem', borderRadius: '9px', background: method === 'deuna' ? 'var(--accent)' : 'var(--bg-elevated)', color: method === 'deuna' ? 'white' : 'var(--text-3)', fontWeight: 800, fontSize: '0.8125rem', border: `1px solid ${method === 'deuna' ? 'var(--accent)' : 'var(--border-subtle)'}`, transition: 'all 0.2s', cursor: 'pointer' }}>
                                Ecuador (Deuna)
                            </button>
                            <button onClick={() => setMethod('kofi')} style={{ flex: 1, padding: '0.625rem', borderRadius: '9px', background: method === 'kofi' ? '#29abe0' : 'var(--bg-elevated)', color: method === 'kofi' ? 'white' : 'var(--text-3)', fontWeight: 800, fontSize: '0.8125rem', border: `1px solid ${method === 'kofi' ? '#29abe0' : 'var(--border-subtle)'}`, transition: 'all 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                                <Coffee size={14} /> Global (Ko-fi)
                            </button>
                        </div>

                        {method === 'deuna' && (
                            <>
                                {/* Deuna */}
                                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>⛁</span>
                                        <div>
                                            <div style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '0.9375rem' }}>Deuna</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>Escanea el QR con tu app Deuna y paga $5.00</div>
                                        </div>
                                    </div>
                                    <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', display: 'inline-block', lineHeight: 0 }}>
                                        <img src={`${import.meta.env.BASE_URL}qr.png`} alt="QR Deuna" style={{ width: '160px', height: '160px', display: 'block', borderRadius: '4px' }} />
                                    </div>

                                </div>

                                <button
                                    onClick={() => setStep(1)}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    Ya pagué, enviar comprobante <ChevronRight size={18} />
                                </button>
                            </>
                        )}

                        {method === 'kofi' && (
                            <>
                                {/* Ko-fi */}
                                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Coffee size={24} color="#29abe0" />
                                        <div style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '1rem' }}>Paga con tarjeta o PayPal en Ko-fi</div>
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', marginBottom: '1.25rem' }}>
                                        Realiza un pago único de <strong>$5.00 USD</strong> en mi página oficial de Ko-fi. No necesitas cuenta.
                                    </p>
                                    <a href="https://ko-fi.com/neosowo" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '10px', background: '#29abe0', color: 'white', fontWeight: 800, fontSize: '0.875rem', textDecoration: 'none' }}>
                                        Ir a pagar en Ko-fi <ExternalLink size={14} />
                                    </a>
                                </div>

                                <button
                                    onClick={() => setStep(1)}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', fontWeight: 800, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    Ya pagué, enviar comprobante <ChevronRight size={18} />
                                </button>
                                <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-4)', textAlign: 'center', lineHeight: 1.5 }}>
                                    ¿Tienes algún problema con tu pago?<br />Contacta en: <strong style={{ color: 'var(--accent)' }}>studyneo.sup@gmail.com</strong>
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* ── PASO 1: FORMULARIO + CAPTURA ────────────────────────────── */}
                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8125rem', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content', marginBottom: '-0.25rem' }}>
                            <ChevronLeft size={15} /> Volver
                        </button>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
                            Envíame tu comprobante para verificar el pago y activar tu cuenta en menos de <strong style={{ color: 'var(--text-2)' }}>24 horas</strong>.
                        </p>

                        {/* Name + Email */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                            <div>
                                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-4)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nombre *</label>
                                <input className="panel-input" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" style={{ width: '100%', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-4)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Correo StudyNeo *</label>
                                <input className="panel-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" style={{ width: '100%', boxSizing: 'border-box' }} />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-4)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Detalles del Pago *</label>
                            <textarea
                                className="panel-input"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder='Ej: "Pagué $5 con Deuna hoy a las 2:30 PM. Ref: 12345"'
                                rows={2}
                                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: '60px' }}
                            />
                        </div>

                        {/* Screenshot upload */}
                        <div>
                            <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-4)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Captura del comprobante *
                            </label>

                            {previewURL ? (
                                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--accent-border)' }}>
                                    <img src={previewURL} alt="Comprobante" style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', background: '#000', display: 'block' }} />
                                    <button
                                        onClick={() => { setFile(null); setPreviewURL(null) }}
                                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    style={{
                                        border: '2px dashed var(--border-default)', borderRadius: '12px',
                                        padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer',
                                        background: 'var(--bg-elevated)', transition: 'all 0.2s'
                                    }}
                                >
                                    <ImagePlus size={24} color="var(--accent)" style={{ margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontWeight: 700, color: 'var(--text-2)', fontSize: '0.8125rem', margin: 0 }}>
                                        Clic para adjuntar comprobante
                                    </p>
                                </div>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(212,32,32,0.08)', border: '1px solid rgba(212,32,32,0.25)', borderRadius: '10px' }}>
                                <AlertCircle size={15} color="var(--red)" />
                                <span style={{ color: 'var(--red)', fontSize: '0.8125rem', fontWeight: 600 }}>{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            style={{
                                width: '100%', padding: '0.875rem', borderRadius: '12px', border: 'none',
                                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                                color: 'white', fontWeight: 800, fontSize: '0.9375rem',
                                cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                opacity: uploading ? 0.7 : 1
                            }}
                        >
                            {uploading ? (
                                <>Enviando...</>
                            ) : (
                                <><Send size={16} /> Enviar comprobante</>
                            )}
                        </button>

                        <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                            Tu notificación se envía de forma segura a Firestore para ser revisada manualmente.
                        </p>
                    </div>
                )}

                {/* ── PASO 2: ÉXITO (DEUNA) ───────────────────────────────────────────── */}
                {step === 2 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 32px var(--accent-dim)' }}>
                            <Check size={36} color="white" strokeWidth={3} />
                        </div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.375rem', color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                            ¡Solicitud enviada!
                        </h3>
                        <p style={{ color: 'var(--text-3)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Recibí tu comprobante. Verificaré el pago y te enviaré el código de activación Pro a{' '}
                            <strong style={{ color: 'var(--accent)' }}>{email}</strong>{' '}
                            en menos de <strong style={{ color: 'var(--text-2)' }}>24 horas</strong>.
                        </p>
                        <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>
                                Cuando recibas el código, ve a{' '}
                                <strong style={{ color: 'var(--text-2)' }}>Panel → Configuración → Plan Pro</strong>{' '}
                                e ingrésalo para activar tu cuenta.
                            </p>
                        </div>
                        <button onClick={onClose} style={{ padding: '0.625rem 1.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'none', color: 'var(--text-3)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.875rem' }}>
                            Entendido, cerrar
                        </button>
                    </div>
                )}


            </div>
        </Overlay>
    )
}
