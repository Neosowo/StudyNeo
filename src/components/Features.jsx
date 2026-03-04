import { HardDrive, Layers, Zap, CheckCircle2, ArrowRight } from 'lucide-react'

const features = [

    {
        icon: Layers,
        title: 'Ecosistema unificado',
        description: 'Notas, flashcards, tareas, calendario, hábitos y Pomodoro. Sin saltar entre apps ni perder el hilo.',
        tag: 'All-in-One',
    },
    {
        icon: Zap,
        title: 'Rápido y sin ruido',
        description: 'Interfaz diseñada para el foco total. Sin notificaciones, sin distracciones, sin anuncios. Solo tú y tu estudio.',
        tag: 'Zero distracción',
    },
]

export default function Features({ onAcceder }) {
    return (
        <section id="features" className="features-section">
            <div className="features-inner">
                <div className="features-layout">

                    {/* ── Sidebar ── */}
                    <div className="features-sidebar">
                        <div className="section-label">Por qué StudyNeo</div>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text-1)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                            Diseñado para<br />
                            <span style={{ color: 'var(--accent)' }}>concentrarte</span>
                        </h2>
                        <p style={{ color: 'var(--text-3)', fontSize: '1rem', lineHeight: 1.7 }}>
                            Eliminamos el ruido para que solo te preocupes de aprender.
                        </p>
                        <div className="features-checks">
                            {['Uso Gratuito', 'Plan Pro Ilimitado ($5)', 'Datos 100% seguros', 'Acceso Offline (Solo Pro)'].map(item => (
                                <div key={item} className="feature-check" style={{ color: 'var(--text-2)', fontSize: '0.9375rem', fontWeight: 500 }}>
                                    <CheckCircle2 size={15} color={item.includes('Pro') ? '#10b981' : 'var(--accent)'} style={{ flexShrink: 0 }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                        {onAcceder && (
                            <button
                                onClick={onAcceder}
                                id="features-acceder-btn"
                                style={{
                                    marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.625rem 1.25rem', background: 'var(--accent-dim)',
                                    border: '1px solid var(--accent-border)', borderRadius: '10px',
                                    color: 'var(--accent)', fontWeight: 700, fontSize: '0.875rem',
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                                }}
                            >
                                Probar ahora <ArrowRight size={15} />
                            </button>
                        )}
                    </div>

                    {/* ── Feature Cards ── */}
                    <div className="features-list">
                        {features.map((f) => {
                            const Icon = f.icon
                            return (
                                <div key={f.title} className="feature-card glass-card">
                                    <div style={{
                                        width: '3rem', height: '3rem', borderRadius: '0.75rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        background: 'var(--accent-dim)',
                                        border: '1px solid var(--accent-border)',
                                    }}>
                                        <Icon color="var(--accent)" size={22} strokeWidth={1.8} />
                                    </div>
                                    <div className="feature-card-body">
                                        <div className="feature-title-row">
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                                                {f.title}
                                            </h3>
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, padding: '0.125rem 0.5rem',
                                                borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em',
                                                background: 'var(--accent-dim)', color: 'var(--accent)',
                                                border: '1px solid var(--accent-border)',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {f.tag}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                                            {f.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}

                        {/* Pro Plan notice */}
                        <div className="feature-card glass-card" style={{ border: '1px solid #10b981', background: 'rgba(16,185,129,0.03)' }}>
                            <div style={{
                                width: '3rem', height: '3rem', borderRadius: '0.75rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                            }}>
                                <Zap color="#10b981" size={22} strokeWidth={1.8} />
                            </div>
                            <div className="feature-card-body">
                                <div className="feature-title-row">
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                                        StudyNeo Pro
                                    </h3>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '0.125rem 0.5rem',
                                        borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em',
                                        background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        Premium
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                                    El plan gratis tiene un límite en notas, tareas, flashcards y hábitos, y exige conexión contínua a internet. Si deseas uso <strong>ilimitado</strong>, tiempos personalizados, <strong>modo sin conexión a internet</strong>, auto-guardado rápido y temas exclusivos, desbloquea la versión Pro con un <strong> pago único</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
