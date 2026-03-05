import { useState } from 'react'
import { Plus, Trash2, LayoutGrid, Zap, Move } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'

const QUADRANTS = [
    { id: 'urgent-important', label: 'Urgente / Importante', color: 'var(--red)', bg: 'var(--red-dim)' },
    { id: 'important-not-urgent', label: 'Importante / No Urgente', color: 'var(--accent)', bg: 'var(--accent-dim)' },
    { id: 'urgent-not-important', label: 'Urgente / No Importante', color: 'var(--orange)', bg: 'var(--orange-dim)' },
    { id: 'not-urgent-not-important', label: 'No Urgente / No Importante', color: 'var(--text-4)', bg: 'var(--bg-hover)' },
]

export default function Eisenhower() {
    const [tasks, setTasks] = useLocalStorage('sd_eisenhower_tasks', [])
    const { isPro } = useProContext()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [text, setText] = useState('')
    const [activeQ, setActiveQ] = useState('urgent-important')

    const addTask = () => {
        if (!isPro && tasks.length >= 10) {
            setShowUpgrade(true)
            return
        }
        if (!text.trim()) return
        setTasks(prev => [...prev, { id: Date.now(), text: text.trim(), q: activeQ, done: false }])
        setText('')
    }

    const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))
    const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))

    const moveTask = (id, newQ) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, q: newQ } : t))
    }

    return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}

            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Matriz Eisenhower</h1>
                    <p className="page-subtitle">Prioriza tus objetivos por urgencia e importancia</p>
                </div>
                {!isPro && (
                    <div style={{ padding: '8px 16px', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: '12px', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                        {tasks.length}/10 Tareas (Free)
                    </div>
                )}
            </div>

            {/* Input card matches app style */}
            <div className="panel-card" style={{ marginBottom: '2.5rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                    className="panel-input"
                    placeholder="¿En qué quieres trabajar?"
                    style={{ flex: 1, minWidth: '240px' }}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <select className="panel-select" style={{ width: 'auto' }} value={activeQ} onChange={e => setActiveQ(e.target.value)}>
                    {QUADRANTS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
                </select>
                <button className="btn-accent-sm" style={{ padding: '0 24px', borderRadius: '14px' }} onClick={addTask}>
                    <Plus size={20} />
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {QUADRANTS.map(q => (
                    <div key={q.id} className="panel-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px', borderTop: `4px solid ${q.color}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: q.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LayoutGrid size={16} color={q.color} />
                            </div>
                            <h2 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-1)' }}>{q.label}</h2>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {tasks.filter(t => t.q === q.id).map(t => (
                                <div key={t.id} style={{ padding: '10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} style={{ cursor: 'pointer' }} />
                                    <span style={{ flex: 1, fontSize: '13px', color: t.done ? 'var(--text-4)' : 'var(--text-1)', textDecoration: t.done ? 'line-through' : 'none', fontWeight: 600 }}>
                                        {t.text}
                                    </span>
                                    <div className="task-actions" style={{ display: 'flex', gap: '4px' }}>
                                        <button className="icon-action-btn-sm" onClick={() => deleteTask(t.id)} title="Eliminar"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.q === q.id).length === 0 && (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', fontSize: '12px', border: '1.5px dashed var(--border-subtle)', borderRadius: '12px' }}>
                                    Vacío
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .task-actions { opacity: 0; transition: 0.2s; }
                .panel-card:hover .task-actions { opacity: 1; }
            `}</style>
        </div>
    )
}
