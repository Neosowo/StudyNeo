import { useState } from 'react'
import { Check, Save, Camera, Lock, Coffee, Sparkles, X, Zap, Star } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTheme, THEMES } from '../../ThemeContext'
import { useProContext } from '../../ProContext'


import ProUpgradeModal from '../../ProUpgradeModal'

// ── Theme card ─────────────────────────────────────────────────────────────────
function ThemeCard({ themeData, isActive, onSelect, onLocked, isPro }) {
    const { id, name, emoji, preview, premium } = themeData
    const locked = premium && !isPro

    return (
        <button
            onClick={() => locked ? onLocked(themeData) : onSelect(id)}
            style={{
                display: 'flex', flexDirection: 'column', gap: '0.625rem',
                padding: '1rem', borderRadius: '12px', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left',
                background: isActive ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                border: isActive ? '2px solid var(--accent)' : locked ? '2px dashed var(--border-default)' : '2px solid var(--border-default)',
                transition: 'all 0.18s ease',
                position: 'relative', overflow: 'hidden', width: '100%',
                opacity: locked ? 0.72 : 1,
            }}
        >
            {/* Preview bar */}
            <div style={{ width: '100%', height: '52px', borderRadius: '8px', background: preview.bg, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '28%', background: preview.surface, borderRight: `1px solid ${preview.accent}20` }} />
                <div style={{ position: 'absolute', left: '28%', top: 0, right: 0, bottom: 0, padding: '6px' }}>
                    <div style={{ height: '5px', borderRadius: '3px', background: preview.text, opacity: 0.8, width: '50%' }} />
                </div>
                {/* Lock overlay */}
                {locked && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', background: 'rgba(0,0,0,0.38)', borderRadius: '8px'
                    }}>
                        <Lock size={18} color="rgba(255,255,255,0.9)" />
                    </div>
                )}
            </div>
            {/* Name row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ fontSize: '1rem' }}>{emoji}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-1)' }}>{name}</span>
                </div>
                {isActive && <Check size={14} color="var(--accent)" />}
                {locked && (
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--accent-border)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Pro
                    </span>
                )}
            </div>
        </button>
    )
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function Section({ title, children }) {
    return (
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '1rem', letterSpacing: '-0.01em', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                {title}
            </h2>
            {children}
        </div>
    )
}

function SettingRow({ label, sub, children }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)' }}>{label}</p>
                {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '2px' }}>{sub}</p>}
            </div>
            <div style={{ flexShrink: 0, width: '100%', maxWidth: '350px' }}>{children}</div>
        </div>
    )
}

// ── Pro section ───────────────────────────────────────────────────────────────
function ProSection({ isPro, loading, error, activateCode, setError }) {
    const [code, setCode] = useState('')
    const [success, setSuccess] = useState(false)

    const handleActivate = async () => {
        setError(null)
        const ok = await activateCode(code)
        if (ok) { setSuccess(true); setCode('') }
    }

    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    // ─ Ya tiene Pro ──────────────────────────────────────────────────────────
    if (isPro) return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'linear-gradient(135deg, var(--accent-dim), transparent)', border: '1.5px solid var(--accent-border)', borderRadius: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={22} color="white" fill="white" />
            </div>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-1)' }}>StudyNeo Pro activo</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, background: 'var(--accent)', color: 'white', padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>PRO</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', margin: 0 }}>Tienes acceso completo a todos los temas y funciones premium. ¡Gracias por apoyar! 🎉</p>
            </div>
        </div>
    )

    const freeF = ['Hasta 10 notas', 'Hasta 15 tareas', 'Hasta 10 flashcards', 'Hasta 3 hábitos', 'Hasta 10 enlaces web']
    const proF = ['Bóveda de Todo Ilimitada', 'Acceso sin conexión (Offline)', 'Auto-guardado rápido (1 min)', 'Temporizador personalizado', '6 temas premium exclusivos']

    // ─ No tiene Pro ─────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-2)', marginBottom: '0.75rem' }}>🆓 Gratis</div>
                    {freeF.map(f => <div key={f} style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Check size={12} color="#10b981" />{f}</div>)}
                </div>
                <div style={{ background: 'var(--accent-dim)', border: '1.5px solid var(--accent-border)', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--accent)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Zap size={14} fill="var(--accent)" />Pro</div>
                    {proF.map(f => <div key={f} style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Star size={12} color="var(--accent)" />{f}</div>)}
                </div>
            </div>

            {showUpgradeModal && <ProUpgradeModal onClose={() => setShowUpgradeModal(false)} />}

            {/* How to get Pro */}
            <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h3 style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '0.9375rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={16} fill="var(--accent)" /> Obtener Código de Activación
                    </h3>
                    <p style={{ color: 'var(--text-4)', fontSize: '0.75rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                        Apoya a StudyNeo con Deuna o Ko-fi, envíame el comprobante <br />y recibe tu código en tu correo para desbloquear todo.
                    </p>
                </div>
                <button
                    onClick={() => setShowUpgradeModal(true)}
                    style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                >
                    Ver métodos de pago →
                </button>
            </div>

            {/* Code input */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '1.25rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-2)', marginBottom: '0.75rem' }}>¿Ya tienes un código? Ingrésalo aquí:</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        className="panel-input"
                        value={code}
                        onChange={e => { setCode(e.target.value.toUpperCase()); setError(null) }}
                        placeholder="XXXX-XXXX-XXXX"
                        style={{ letterSpacing: '0.12em', fontWeight: 700, flex: 1 }}
                        maxLength={14}
                    />
                    <button
                        onClick={handleActivate}
                        disabled={loading || !code.trim()}
                        style={{ padding: '0 1rem', height: '44px', borderRadius: '10px', border: 'none', background: 'var(--text-1)', color: 'var(--bg-base)', fontWeight: 800, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: loading || !code.trim() ? 0.6 : 1 }}
                    >
                        {loading ? '...' : 'Activar Pro'}
                    </button>
                </div>
                {error && <p style={{ color: 'var(--red)', fontSize: '0.8125rem', marginTop: '0.5rem', fontWeight: 600 }}>⚠️ {error}</p>}
                {success && <p style={{ color: '#10b981', fontSize: '0.8125rem', marginTop: '0.5rem', fontWeight: 700 }}>✓ ¡Plan Pro activado! Los cambios se aplican de inmediato.</p>}
            </div>
        </div>
    )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Settings({ user, updateUser }) {
    const { theme, setTheme } = useTheme()
    const { isPro, proInfo, loading: proLoading, error: proError, activateCode, setError: setProError } = useProContext()
    const [soundEnabled, setSoundEnabled] = useLocalStorage('sd_sound_enabled', true)
    const [pomodoroSettings, setPomodoroSettings] = useLocalStorage('sd_pomodoro_settings', { focus: 25, short: 5, long: 15 })
    const [displayName, setDisplayName] = useState(user?.name || '')
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
    const [savedName, setSavedName] = useState(false)
    const [savedPhoto, setSavedPhoto] = useState(false)
    const [lockedThemeModal, setLockedThemeModal] = useState(false)

    const handleSaveName = () => {
        if (!displayName.trim()) return
        updateUser({ name: displayName.trim() })
        setSavedName(true)
        setTimeout(() => setSavedName(false), 2000)
    }

    const handleSavePhoto = () => {
        updateUser({ photoURL: photoURL.trim() })
        setSavedPhoto(true)
        setTimeout(() => setSavedPhoto(false), 2000)
    }

    const darkThemes = THEMES.filter(t => t.category === 'Oscuro')
    const lightThemes = THEMES.filter(t => t.category === 'Claro')

    return (
        <div className="page-container">
            {lockedThemeModal && <ProUpgradeModal onClose={() => setLockedThemeModal(false)} />}

            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div>
                        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Configuración
                            {isPro && (
                                <span style={{ fontSize: '0.6rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.1em', textTransform: 'uppercase', verticalAlign: 'middle' }}>PRO</span>
                            )}
                        </h1>
                        <p className="page-subtitle">Personaliza tu cuenta y apariencia</p>
                    </div>
                </div>
            </div>

            <Section title="👤 Perfil">
                <SettingRow label="Nombre" sub="Cómo te verán otros usuarios">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input className="panel-input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Tu nombre" />
                        <button className="btn-primary-sm" onClick={handleSaveName}>
                            {savedName ? <Check size={16} /> : <Save size={16} />}
                        </button>
                    </div>
                </SettingRow>

                <SettingRow label="Imagen de Perfil (URL)" sub="Pega el enlace de una imagen (.jpg, .png)">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input className="panel-input" value={photoURL} onChange={e => setPhotoURL(e.target.value)} placeholder="https://ejemplo.com/foto.jpg" />
                        <button className="btn-primary-sm" onClick={handleSavePhoto}>
                            {savedPhoto ? <Check size={16} /> : <Camera size={16} />}
                        </button>
                    </div>
                </SettingRow>

                <SettingRow label="Correo" sub="Tu identificador de cuenta">
                    <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-hover)', borderRadius: '10px', fontSize: '0.8125rem', color: 'var(--text-3)', fontWeight: 600 }}>
                        {user?.email}
                    </div>
                </SettingRow>

                <SettingRow label="Efectos de Sonido" sub="Sonidos satisfactorios al completar tareas">
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                        <div
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            style={{
                                width: '48px', height: '26px', borderRadius: '13px',
                                background: soundEnabled ? 'var(--accent)' : 'var(--bg-hover-2)',
                                position: 'relative', transition: 'all 0.3s'
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: '3px',
                                left: soundEnabled ? '25px' : '3px',
                                width: '20px', height: '20px', borderRadius: '50%',
                                background: 'white', transition: 'all 0.3s'
                            }} />
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: soundEnabled ? 'var(--accent)' : 'var(--text-4)' }}>
                            {soundEnabled ? 'Activados' : 'Silenciados'}
                        </span>
                    </label>
                </SettingRow>
            </Section>

            <Section title="⚡ Plan Pro">
                <ProSection
                    isPro={isPro}
                    proInfo={proInfo}
                    loading={proLoading}
                    error={proError}
                    activateCode={activateCode}
                    setError={setProError}
                />
            </Section>

            <Section title="🎨 Apariencia">
                {!isPro && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', padding: '0.625rem 0.875rem', background: 'var(--accent-dim)', borderRadius: '8px', border: '1px solid var(--accent-border)' }}>
                        <Lock size={13} color="var(--accent)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>6 temas adicionales disponibles con Plan Pro</span>
                    </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                    {[...darkThemes, ...lightThemes].map(t => (
                        <ThemeCard
                            key={t.id}
                            themeData={t}
                            isActive={theme === t.id}
                            isPro={isPro}
                            onSelect={(id) => {
                                if (t.premium && !isPro) { setLockedThemeModal(true); return }
                                setTheme(id)
                            }}
                            onLocked={() => setLockedThemeModal(true)}
                        />
                    ))}
                </div>
            </Section>

            <Section title="⏱️ Temporizador">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
                    {['focus', 'short', 'long'].map(k => (
                        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-4)' }}>
                                {k === 'focus' ? 'Foco' : k === 'short' ? 'Corto' : 'Largo'}
                            </label>
                            <input
                                type="number"
                                className="panel-input"
                                value={pomodoroSettings[k]}
                                onChange={e => setPomodoroSettings(p => ({ ...p, [k]: parseInt(e.target.value) }))}
                                disabled={!isPro}
                                title={!isPro ? 'Requiere Plan Pro' : ''}
                                style={{ opacity: !isPro ? 0.6 : 1, cursor: !isPro ? 'not-allowed' : 'text' }}
                            />
                        </div>
                    ))}
                </div>
                {!isPro && (
                    <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Lock size={14} color="var(--accent)" /> Los tiempos personalizados son exclusivos del Plan Pro.
                    </div>
                )}
            </Section>
        </div>
    )
}
