import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, CheckSquare, Circle, Tag, Share2, Users, X, UserPlus, Mail, Settings, Check, BookOpen, Zap, Volume2, Minimize2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'
import { useWidgets } from '../components/FloatingWidgets'

export default function Tasks() {
    const [tasks, setTasks] = useLocalStorage('sd_tasks', [])
    const [subjects, setSubjects] = useLocalStorage('sd_subjects', [])
    const [soundEnabled] = useLocalStorage('sd_sound_enabled', true)
    const { isPro } = useProContext()
    const { openWidget } = useWidgets()
    const [showUpgrade, setShowUpgrade] = useState(false)

    // Audio system
    const playSound = (url) => {
        if (!soundEnabled) return
        const audio = new Audio(url)
        audio.volume = 0.4
        audio.play().catch(() => { })
    }

    const AUDIO = {
        done: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
        delete: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
        add: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
    }
    const [text, setText] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [filter, setFilter] = useState('all')
    const [subjectFilter, setSubjectFilter] = useState('All')
    const [sharingId, setSharingId] = useState(null)
    const [emailInvite, setEmailInvite] = useState('')
    const [showSubjectManager, setShowSubjectManager] = useState(false)
    const [newSubject, setNewSubject] = useState('')

    // Open subject manager if no subjects exist
    useEffect(() => {
        if (subjects.length === 0) {
            setShowSubjectManager(true)
        } else if (!selectedSubject) {
            setSelectedSubject(subjects[0])
        }
    }, [subjects, selectedSubject])

    const addTask = () => {
        if (!isPro && tasks.length >= 15) {
            setShowUpgrade(true)
            return
        }
        if (!text.trim() || !selectedSubject) return
        setTasks(prev => [{
            id: Date.now(),
            text: text.trim(),
            subject: selectedSubject,
            done: false,
            collaborators: [],
            createdAt: new Date().toISOString()
        }, ...prev])
        setText('')
    }

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                if (!t.done) playSound(AUDIO.done)
                return { ...t, done: !t.done }
            }
            return t
        }))
    }

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id))
        playSound(AUDIO.delete)
    }

    const clearDone = () => {
        setTasks(prev => prev.filter(t => !t.done))
    }

    const addSubject = () => {
        const s = newSubject.trim()
        if (!s || subjects.includes(s)) return
        setSubjects(prev => [...prev, s])
        setNewSubject('')
        if (!selectedSubject) setSelectedSubject(s)
    }

    const removeSubject = (s) => {
        setSubjects(prev => prev.filter(x => x !== s))
        if (selectedSubject === s) setSelectedSubject(subjects.find(x => x !== s) || '')
        if (subjectFilter === s) setSubjectFilter('All')
    }

    const invitePerson = (id) => {
        if (!emailInvite.trim()) return
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, collaborators: [...(t.collaborators || []), { email: emailInvite, state: 'pending' }] } : t
        ))
        setEmailInvite('')
        alert('Invitación enviada')
    }

    const filtered = tasks
        .filter(t => filter === 'all' ? true : filter === 'pending' ? !t.done : t.done)
        .filter(t => subjectFilter === 'All' ? true : t.subject === subjectFilter)

    const pending = tasks.filter(t => !t.done).length
    const doneCount = tasks.filter(t => t.done).length

    const sharingTask = tasks.find(t => t.id === sharingId)

    return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
            <div className="page-header" style={{ marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 className="page-title" style={{ fontWeight: 900 }}>Tareas</h1>
                    <p className="page-subtitle" style={{ color: 'var(--text-4)' }}>{pending} pendientes · {doneCount} completadas</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-action-btn" onClick={() => openWidget('tasks')} title="Mini ventana de tareas">
                        <Minimize2 size={18} />
                    </button>
                    <button className="icon-action-btn" onClick={() => setShowSubjectManager(true)} title="Gestionar materias">
                        <Settings size={18} />
                    </button>
                    {doneCount > 0 && (
                        <button className="icon-action-btn danger" onClick={clearDone} title="Limpiar completadas">
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            {!isPro && (
                <div style={{ padding: '0.875rem 1.25rem', background: 'var(--accent-dim)', borderRadius: '12px', border: '1px solid var(--accent-border)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={16} color="var(--accent)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>
                            Has usado <strong style={{ color: 'var(--accent)' }}>{tasks.length}/15</strong> tareas del Plan Gratis.
                        </span>
                    </div>
                    <button onClick={() => setShowUpgrade(true)} style={{ background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        Quitar Límite
                    </button>
                </div>
            )}

            {/* Quick Add */}
            <div className="panel-card" style={{ padding: '1.25rem', marginBottom: '2rem', borderRadius: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                {subjects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', marginBottom: '1rem' }}>No tienes materias creadas aún.</p>
                        <button className="btn-primary-sm" onClick={() => setShowSubjectManager(true)}>Crear mi primera materia</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                            className="panel-input"
                            style={{ flex: 1, minWidth: '200px', fontSize: '15px' }}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTask()}
                            placeholder="Nueva tarea... (Enter para añadir)"
                        />
                        <select
                            className="panel-select"
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            style={{ width: 'auto', minWidth: '140px' }}
                        >
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button className="btn-accent-sm" onClick={addTask} style={{ padding: '0 20px', borderRadius: '12px' }}>
                            <Plus size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Navigation & Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'pending', 'done'].map(f => (
                        <button
                            key={f}
                            className={`filter-chip ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                            style={{ fontSize: '12px', fontWeight: 700, padding: '8px 16px' }}
                        >
                            {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Hechas'}
                        </button>
                    ))}
                </div>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    maxWidth: '100%',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--accent-dim) transparent'
                }} className="subjects-scroll">
                    <button
                        className={`filter-chip-sm ${subjectFilter === 'All' ? 'active' : ''}`}
                        onClick={() => setSubjectFilter('All')}
                    >
                        Todo
                    </button>
                    {subjects.map(s => (
                        <button
                            key={s}
                            className={`filter-chip-sm ${subjectFilter === s ? 'active' : ''}`}
                            onClick={() => setSubjectFilter(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map(task => (
                    <div
                        key={task.id}
                        className={`task-item ${task.done ? 'done' : ''}`}
                        style={{
                            padding: '1.25rem',
                            borderRadius: '16px',
                            border: '1px solid var(--border-subtle)',
                            background: task.done ? 'var(--bg-base)' : 'var(--bg-surface)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: task.done ? 0.7 : 1,
                            flexWrap: 'wrap'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px' }}>
                            <button
                                className="task-check-btn"
                                onClick={() => toggleTask(task.id)}
                                style={{
                                    background: task.done ? 'var(--green)' : 'transparent',
                                    border: task.done ? 'none' : '2.5px solid var(--border-strong)',
                                    borderRadius: '8px',
                                    width: '24px', height: '24px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    flexShrink: 0
                                }}
                            >
                                {task.done && <Check size={16} color="white" strokeWidth={4} />}
                            </button>

                            <div style={{ flex: 1, minWidth: 0, paddingLeft: '1rem' }}>
                                <p style={{
                                    fontSize: '1rem', fontWeight: task.done ? 500 : 700,
                                    color: task.done ? 'var(--text-4)' : 'var(--text-1)',
                                    textDecoration: task.done ? 'line-through' : 'none',
                                    wordBreak: 'break-word'
                                }}>
                                    {task.text}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{task.subject}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', paddingTop: '8px' }}>
                            <button className="icon-action-btn-sm" onClick={() => setSharingId(task.id)} title="Compartir">
                                <UserPlus size={16} />
                            </button>
                            <button className="icon-action-btn-sm danger" onClick={() => deleteTask(task.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-base)', borderRadius: '24px', border: '2px dashed var(--border-subtle)' }}>
                        <p style={{ color: 'var(--text-4)', fontSize: '0.9rem', fontWeight: 600 }}>No hay tareas aquí. ¿Añadimos una?</p>
                    </div>
                )}
            </div>

            {/* Subject Manager Modal */}
            {showSubjectManager && (
                <div className="share-modal-overlay" onClick={() => subjects.length > 0 && setShowSubjectManager(false)}>
                    <div className="share-visualizer" style={{
                        width: '95%', maxWidth: '440px', background: 'var(--bg-elevated)', borderRadius: '24px',
                        overflow: 'hidden', border: '1px solid var(--border-strong)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '2rem 2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BookOpen size={20} color="var(--accent)" />
                                </div>
                                <h3 style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-1)' }}>Gestionar Materias</h3>
                            </div>
                            {subjects.length > 0 && (
                                <button className="clean-close-btn" onClick={() => setShowSubjectManager(false)}><X size={20} /></button>
                            )}
                        </div>

                        <div style={{ padding: '0 2rem 2.5rem' }}>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                Crea las materias de tu ciclo escolar para organizar tus tareas y notas con precisión.
                            </p>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                                <input
                                    className="panel-input"
                                    style={{ flex: 1, borderRadius: '12px' }}
                                    placeholder="Nombre de la materia..."
                                    value={newSubject}
                                    onChange={e => setNewSubject(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSubject()}
                                />
                                <button className="btn-accent-sm" onClick={addSubject} style={{ borderRadius: '12px', padding: '0 18px' }}>
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
                                {subjects.map(s => (
                                    <div key={s} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '12px 16px', background: 'var(--bg-input)', borderRadius: '14px',
                                        border: '1px solid var(--border-subtle)', transition: 'all 0.2s'
                                    }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{s}</span>
                                        <button className="icon-action-btn-sm danger" onClick={() => removeSubject(s)} style={{ opacity: 0.6 }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                {subjects.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-input)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontWeight: 600 }}>Empieza añadiendo tu primera materia arriba</p>
                                    </div>
                                )}
                            </div>

                            {subjects.length > 0 && (
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowSubjectManager(false)}
                                    style={{ width: '100%', marginTop: '1.5rem', borderRadius: '12px', height: '48px', fontWeight: 800 }}
                                >
                                    ¡Listo!
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Sharing Modal */}
            {sharingId && sharingTask && (
                <div className="share-modal-overlay" onClick={() => setSharingId(null)}>
                    <div className="share-visualizer" style={{
                        width: '440px', background: 'var(--bg-elevated)', borderRadius: '24px',
                        overflow: 'hidden', border: '1px solid var(--border-strong)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '2rem 2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-1)' }}>Compartir Tarea</h3>
                            <button className="clean-close-btn" onClick={() => setSharingId(null)}><X size={20} /></button>
                        </div>

                        <div style={{ padding: '0 2rem 2.5rem' }}>
                            <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{sharingTask.text}</p>
                                <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', marginTop: '6px' }}>{sharingTask.subject}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                                <input
                                    className="panel-input"
                                    placeholder="Ingresa un email..."
                                    style={{ flex: 1, borderRadius: '12px' }}
                                    value={emailInvite}
                                    onChange={e => setEmailInvite(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && invitePerson(sharingId)}
                                />
                                <button className="btn-primary-sm" onClick={() => invitePerson(sharingId)} style={{ borderRadius: '12px', padding: '0 18px' }}>
                                    Invitar
                                </button>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: '1rem', letterSpacing: '0.05em' }}>Invitados</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {sharingTask.collaborators?.map(c => (
                                        <div key={c.email} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px', background: 'var(--bg-surface)',
                                            borderRadius: '12px', border: '1px solid var(--border-subtle)'
                                        }}>
                                            <Mail size={16} style={{ color: 'var(--text-4)' }} />
                                            <span style={{ fontSize: '13px', flex: 1, fontWeight: 600, color: 'var(--text-2)' }}>{c.email}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--orange)', fontWeight: 800, background: 'var(--orange-dim)', padding: '4px 8px', borderRadius: '6px' }}>PENDIENTE</span>
                                        </div>
                                    ))}
                                    {(!sharingTask.collaborators || sharingTask.collaborators.length === 0) && (
                                        <p style={{ color: 'var(--text-4)', fontSize: '12px', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>No hay colaboradores aún</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .clean-close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-4);
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .clean-close-btn:hover {
                    background: var(--bg-hover);
                    color: var(--text-1);
                    transform: rotate(90deg);
                }
                .filter-chip-sm {
                    padding: 6px 12px;
                    border-radius: 8px;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    color: var(--text-3);
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .filter-chip-sm:hover {
                    background: var(--bg-hover);
                    color: var(--text-1);
                }
                .filter-chip-sm.active {
                    background: var(--accent-dim);
                    color: var(--accent);
                    border-color: var(--accent-border);
                }
                .icon-action-btn-sm {
                    padding: 8px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text-3);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .icon-action-btn-sm:hover {
                    background: var(--bg-hover);
                    color: var(--text-1);
                }
                .icon-action-btn-sm.danger:hover {
                    background: var(--red-dim);
                    color: var(--red);
                }
                .subjects-scroll::-webkit-scrollbar {
                    height: 4px;
                }
                .subjects-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .subjects-scroll::-webkit-scrollbar-thumb {
                    background: var(--accent-dim);
                    border-radius: 10px;
                }
                .subjects-scroll:hover::-webkit-scrollbar-thumb {
                    background: var(--accent);
                }
            `}</style>
        </div>
    )
}
