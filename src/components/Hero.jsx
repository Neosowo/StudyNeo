import { useState } from 'react'
import { ArrowRight, Terminal, Plus, X, Check, Flame } from 'lucide-react'

const metrics = [
    { value: '10', label: 'Herramientas integradas' },
    { value: 'GRATIS', label: 'Con limitaciones' },
    { value: 'PRO', label: 'Plan Gratis & Premium' },
]

function CheckMark() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

export default function Hero({ onAcceder }) {
    const [demoTasks, setDemoTasks] = useState([
        { id: 1, text: 'Anatomía: Repaso óseo', done: false },
        { id: 2, text: 'Flashcards: Fisiología', done: true },
        { id: 3, text: 'Series de Taylor — Cálculo II', done: false }
    ])
    const [newTask, setNewTask] = useState('')

    const addTask = (e) => {
        e.preventDefault()
        if (!newTask.trim()) return
        setDemoTasks([...demoTasks, { id: Date.now(), text: newTask, done: false }])
        setNewTask('')
    }

    const toggleTask = (id) => {
        setDemoTasks(demoTasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
    }

    const deleteTask = (id) => {
        setDemoTasks(demoTasks.filter(t => t.id !== id))
    }

    return (
        <section className="hero-section grid-dot-bg">
            <div className="noise-overlay" />

            <div className="hero-inner">
                <div className="hero-grid">

                    {/* ── Left Column ── */}
                    <div className="hero-left fade-up-1">
                        <div className="hero-badge fade-up-1">
                            <span style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: 'var(--accent)', display: 'inline-block',
                                animation: 'pulse 2s ease-in-out infinite',
                            }} />
                            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em' }}>
                                StudyNeo Betav1.8
                            </span>
                        </div>

                        <h1 className="hero-title fade-up-2">
                            Tu espacio<br />
                            <span style={{ color: 'var(--accent)' }}>de estudio</span><br />
                            dinámico
                        </h1>

                        <p className="hero-desc fade-up-3">
                            Notas, flashcards, tareas, calendario y Pomodoro en un solo lugar. Estudia sin distracciones desde cualquier dispositivo.
                        </p>

                        <div className="hero-actions fade-up-4">
                            <button onClick={onAcceder} className="btn-primary" id="hero-start-btn">
                                Empezar
                                <ArrowRight size={18} />
                            </button>

                        </div>

                        <div className="hero-metrics fade-up-4">
                            {metrics.map((m) => (
                                <div key={m.label} className="metric-item">
                                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)' }}>{m.value}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right Column (Interactive Demo) ── */}
                    <div className="hero-right">
                        <div className="hero-card" style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.5)', border: '1.5px solid var(--accent-border)', position: 'relative' }}>

                            <div className="hero-card-header">
                                <Terminal size={14} color="var(--accent)" />
                                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-4)' }}>
                                    proyectos / metas.tasks
                                </span>
                            </div>

                            <div className="hero-tasks" style={{ pointerEvents: 'auto' }}>
                                <p style={{ color: 'var(--text-4)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}># Planificador Diario</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {demoTasks.map(task => (
                                        <div key={task.id} className="hero-task-row" style={{ group: 'true' }}>
                                            <div
                                                onClick={() => toggleTask(task.id)}
                                                className="hero-checkbox"
                                                style={{
                                                    cursor: 'pointer',
                                                    background: task.done ? 'var(--accent)' : 'transparent',
                                                    border: task.done ? '1px solid var(--accent)' : '1px solid var(--accent-border)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white'
                                                }}
                                            >
                                                {task.done && <Check size={12} strokeWidth={4} />}
                                            </div>
                                            <span
                                                onClick={() => toggleTask(task.id)}
                                                style={{
                                                    color: task.done ? 'var(--text-4)' : 'var(--text-1)',
                                                    textDecoration: task.done ? 'line-through' : 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: task.done ? 500 : 700,
                                                    flex: 1,
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {task.text}
                                            </span>
                                            <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }} className="demo-delete">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={addTask} style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-subtle)', marginTop: '0.75rem', paddingTop: '0.75rem' }}>
                                    <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '1.1rem' }}>+</span>
                                    <input
                                        type="text"
                                        placeholder="Pulsa Enter para añadir..."
                                        value={newTask}
                                        onChange={e => setNewTask(e.target.value)}
                                        style={{
                                            background: 'none', border: 'none', color: 'var(--text-1)',
                                            fontSize: '0.8125rem', fontFamily: 'inherit', outline: 'none',
                                            width: '100%'
                                        }}
                                    />
                                </form>
                            </div>
                        </div>

                        <div className="hero-mini-cards">
                            <div className="hero-mini-card">
                                <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                                    Próximo examen
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)' }}>4 días</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginTop: '0.25rem' }}>Física Mecánica — Ex.Final</p>
                            </div>
                            <div className="hero-mini-card">
                                <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                                    Tu racha
                                </p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    12 <Flame size={20} fill="var(--accent)" />
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginTop: '0.25rem' }}>+2 sesiones hoy</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
