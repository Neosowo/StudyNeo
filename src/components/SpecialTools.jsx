import { FileText, Brain, CheckSquare, Timer, Calendar, Flame, BarChart2, Link2, Settings, ArrowRight, Calculator } from 'lucide-react'

const tools = [
    {
        icon: Calculator,
        title: 'Calculadora de Notas',
        description: 'Calcula tu promedio: parciales, % práctico y examen de recuperación.',
        tag: 'En el panel',
    },
    {
        icon: FileText,
        title: 'Editor de Notas',
        description: 'Escribe y organiza tus apuntes con auto-guardado. Markdown friendly y búsqueda instantánea.',
        tag: 'En el panel',
    },
    {
        icon: Brain,
        title: 'Flashcards Anki',
        description: 'Crea mazos de tarjetas con flip 3D y modo de estudio con seguimiento de aciertos y errores.',
        tag: 'En el panel',
    },
    {
        icon: Timer,
        title: 'Modo Pomodoro',
        description: 'Temporizador 25/5/15 con círculo animado, contador de sesiones y avance automático.',
        tag: 'En el panel',
    },
    {
        icon: Calendar,
        title: 'Calendario',
        description: 'Gestiona exámenes, entregas y eventos. Vista mensual con colores por categoría y próximos eventos.',
        tag: 'En el panel',
    },
    {
        icon: CheckSquare,
        title: 'Gestión de Tareas',
        description: 'Tareas con prioridad (Alta/Media/Baja), materia, filtros y progreso en tiempo real.',
        tag: 'En el panel',
    },
    {
        icon: Flame,
        title: 'Rastreador de Hábitos',
        description: 'Marca hábitos diarios, visualiza tu racha de días consecutivos y sigue tu constancia semanal.',
        tag: 'En el panel',
    },
    {
        icon: Link2,
        title: 'Bóveda de Links',
        description: 'Guarda recursos web por materia y tipo. Copia URL, busca y filtra por tag con un clic.',
        tag: 'En el panel',
    },
    {
        icon: BarChart2,
        title: 'Estadísticas',
        description: 'Visualiza tu progreso: tareas, flashcards, sesiones Pomodoro, hábitos y logros desbloqueables.',
        tag: 'En el panel',
    },
    {
        icon: Settings,
        title: 'Configuración',
        description: 'Personaliza tu experiencia: nombre de usuario, elige entre 8 temas, tiempos Pomodoro y más.',
        tag: 'En el panel',
    },
]

export default function SpecialTools({ onAcceder }) {
    return (
        <section id="tools" className="tools-section">
            <div className="tools-inner">

                {/* ── Header ── */}
                <div className="tools-header">
                    <div className="tools-header-left">
                        <div className="section-label">Todo en uno</div>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                            10 herramientas,<br /><span style={{ color: 'var(--accent)' }}>un solo panel</span>
                        </h2>
                    </div>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '18rem' }}>
                        Todo lo que un estudiante de alto rendimiento necesita. Sin apps externas, sin cuentas adicionales, todo en StudyNeo.
                    </p>
                </div>

                {/* ── Tools Grid ── */}
                <div className="tools-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                    {tools.map((tool) => {
                        const Icon = tool.icon
                        return (
                            <div key={tool.title} className="tool-card glass-card" style={{ cursor: 'default', position: 'relative', overflow: 'hidden' }}>
                                <div style={{
                                    width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'var(--accent-dim)',
                                    border: '1px solid var(--accent-border)',
                                    flexShrink: 0,
                                }}>
                                    <Icon size={20} strokeWidth={1.8} color="var(--accent)" />
                                </div>
                                <div className="tool-card-body">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                                            {tool.title}
                                        </h3>
                                        <span style={{
                                            fontSize: '9px', fontWeight: 700, padding: '1px 6px',
                                            borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em',
                                            background: 'var(--accent-dim)', color: 'var(--accent)',
                                            border: '1px solid var(--accent-border)',
                                            whiteSpace: 'nowrap', flexShrink: 0,
                                        }}>
                                            {tool.tag}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.7 }}>
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* ── CTA Banner ── */}
                <div className="cta-banner">
                    <div className="cta-body">
                        <h3 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-1)' }}>
                            ¿Listo para estudiar<br />de verdad?
                        </h3>
                        <p style={{ color: 'var(--text-2)', fontSize: '15px', fontWeight: 500 }}>
                            Sin tarjeta. Empieza en menos de 30 segundos.
                        </p>
                    </div>
                    <button onClick={onAcceder} className="cta-btn" id="cta-crear-cuenta-btn">
                        Crear cuenta gratis
                        <ArrowRight size={16} />
                    </button>
                </div>

            </div>
        </section>
    )
}
