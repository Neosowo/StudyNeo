import { useState } from 'react'
import { PenLine, FileText, Trash2, Calendar, Star, BookOpen, Clock, Zap } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'

export default function BrainJournal() {
    const [entries, setEntries] = useLocalStorage('sd_journal_entries', [])
    const { isPro } = useProContext()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [activeEntry, setActiveEntry] = useState(null)

    const addEntry = () => {
        if (!isPro && entries.length >= 5) {
            setShowUpgrade(true)
            return
        }
        if (!title.trim() || !body.trim()) return
        const newE = { id: Date.now(), title: title.trim(), body: body.trim(), date: new Date().toISOString(), mood: 'neutral' }
        setEntries(prev => [newE, ...prev])
        setTitle('')
        setBody('')
    }

    const deleteEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id))

    const formatDate = (iso) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

    const activeItem = activeEntry ? entries.find(e => e.id === activeEntry) : null

    return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}

            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Bitácora Personal</h1>
                    <p className="page-subtitle">Reflexiones diarias y seguimiento de aprendizaje</p>
                </div>
                <div style={{ padding: '0.625rem 1.25rem', background: 'var(--bg-surface)', borderRadius: '14px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={16} color="var(--accent)" />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-1)' }}>{entries.length} Entradas</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {/* Editor Section */}
                <div className="panel-card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PenLine size={16} color="var(--accent)" />
                        </div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-1)' }}>Nueva Reflexión</h2>
                    </div>

                    <input
                        className="panel-input"
                        placeholder="Título del día..."
                        style={{ width: '100%', marginBottom: '1rem', fontWeight: 800, fontSize: '1rem' }}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />

                    <textarea
                        className="panel-input"
                        placeholder="¿Qué aprendiste hoy? ¿Cómo te sentiste?"
                        style={{ width: '100%', height: '180px', marginBottom: '1.5rem', resize: 'none', lineHeight: '1.6', fontSize: '14px' }}
                        value={body}
                        onChange={e => setBody(e.target.value)}
                    />

                    <button className="btn-primary" style={{ width: '100%', height: '48px', fontWeight: 900 }} onClick={addEntry}>
                        Guardar Entrada
                    </button>

                    {!isPro && (
                        <div style={{ marginTop: '1.5rem', padding: '12px', background: 'var(--accent-dim)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent-border)' }}>
                            <Zap size={14} color="var(--accent)" />
                            <p style={{ fontSize: '11px', color: 'var(--text-1)', fontWeight: 600 }}>Límite gratis: <strong style={{ color: 'var(--accent)' }}>{entries.length}/5</strong> reflexiones.</p>
                        </div>
                    )}
                </div>

                {/* List Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {entries.map(e => (
                        <div key={e.id} className="panel-card journal-entry" style={{ padding: '1.5rem', transition: '0.2s', border: activeEntry === e.id ? '2px solid var(--accent)' : '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>{e.title}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-4)', fontSize: '11px', fontWeight: 700 }}>
                                        <Clock size={12} />
                                        <span>{formatDate(e.date)}</span>
                                    </div>
                                </div>
                                <button className="icon-action-btn-sm danger" onClick={(evt) => { evt.stopPropagation(); deleteEntry(e.id); }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{e.body}</p>
                        </div>
                    ))}
                    {entries.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-base)', borderRadius: '24px', border: '2px dashed var(--border-subtle)', color: 'var(--text-4)' }}>
                            <FileText size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                            <p style={{ fontWeight: 600 }}>Tu bitácora está limpia hoy.</p>
                            <p style={{ fontSize: '12px', marginTop: '4px' }}>Empieza escribiendo algo nuevo a la izquierda.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .journal-entry:hover { transform: scale(1.02); box-shadow: var(--shadow-md); border-color: var(--accent-border); }
            `}</style>
        </div>
    )
}
