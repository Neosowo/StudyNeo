import { useState, useCallback } from 'react'
import { Plus, Trash2, Edit3, X, Check, Calculator, ChevronDown, ChevronUp, RotateCcw, AlertTriangle, BookOpen, Settings, BarChart3, GraduationCap, Zap } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePro } from '../hooks/usePro'
import ProUpgradeModal from '../../ProUpgradeModal'

/* ─── Audio System ───────────────────────────────────────── */
const SFX = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    delete: 'https://assets.mixkit.co/active_storage/sfx/256/256-preview.mp3',
    pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
}

const play = (url) => {
    try {
        const audio = new Audio(url)
        audio.volume = 0.4
        audio.play().catch(() => { })
    } catch (e) { }
}

/* ─── University grade formula ────────────────────────────── */
function calculateGPA({ pPractic, partial1, partial2, practic, replacementExam }) {
    let pp1 = parseFloat(partial1) || 0
    let pp2 = parseFloat(partial2) || 0
    const pp = parseFloat(pPractic) || 0
    const pr = parseFloat(practic) || 0
    const re = parseFloat(replacementExam) || 0

    if (re !== 0) {
        if (pp1 <= pp2) { pp1 = Math.max(pp1, re) }
        else { pp2 = Math.max(pp2, re) }
    }

    let score
    if (pp === 0) {
        score = (pp1 + pp2) / 2
    } else {
        const ppRatio = pp / 100
        const paRatio = 1 - ppRatio
        score = ((pp1 + pp2) / 2) * paRatio + pr * ppRatio
    }
    return (score / 10).toFixed(2)
}

function gradeColor(gpa) {
    const n = parseFloat(gpa)
    if (isNaN(n)) return 'var(--text-4)'
    return n >= 6 ? 'var(--green)' : 'var(--red)'
}

function gradeLabel(gpa) {
    const n = parseFloat(gpa)
    if (isNaN(n)) return '—'
    return n >= 6 ? 'Aprobado' : 'Reprobado'
}

const EMPTY_COURSE = {
    courseName: '',
    gpa: '',
    mode: 'full',
    partial1: '',
    partial2: '',
    pPractic: '',
    practic: '',
    replacementExam: '',
}

function NumInput({ id, label, value, onChange, max = 100, step = 0.1, placeholder = '0', hint }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label htmlFor={id} style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}{hint && <span style={{ color: 'var(--accent)', fontWeight: 600, marginLeft: '4px' }}>{hint}</span>}
            </label>
            <input
                id={id}
                type="number"
                className="panel-input"
                min={0} max={max} step={step}
                placeholder={placeholder}
                value={value}
                onChange={e => {
                    let v = e.target.value
                    if (v !== '' && parseFloat(v) > max) v = String(max)
                    if (v !== '' && parseFloat(v) < 0) v = '0'
                    onChange(v)
                }}
            />
        </div>
    )
}

/* ─── Standard Modal Style ─── */
const MODAL_STYLE = {
    width: '440px',
    background: 'var(--bg-elevated)',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '1px solid var(--border-strong)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column'
}

function SubjectManager({ subjects, setSubjects, onClose }) {
    const [newSubject, setNewSubject] = useState('')
    const addSubject = () => {
        const s = newSubject.trim()
        if (!s || subjects.includes(s)) return
        setSubjects([...subjects, s])
        setNewSubject('')
        play(SFX.success)
    }
    const removeSubject = (s) => {
        setSubjects(subjects.filter(x => x !== s))
        play(SFX.delete)
    }

    return (
        <div className="share-modal-overlay" onClick={() => { play(SFX.click); subjects.length > 0 && onClose() }}>
            <div style={MODAL_STYLE} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '2rem 2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={20} color="var(--accent)" />
                        </div>
                        <h3 style={{ fontWeight: 900, fontSize: '1.25rem' }}>Gestionar Materias</h3>
                    </div>
                    {subjects.length > 0 && <button className="clean-close-btn" onClick={() => { play(SFX.click); onClose() }}><X size={20} /></button>}
                </div>
                <div style={{ padding: '0 2rem 2.5rem' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                        <input className="panel-input" style={{ flex: 1, borderRadius: '12px' }} placeholder="Nombre de la materia..." value={newSubject} onChange={e => setNewSubject(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSubject()} />
                        <button className="btn-accent-sm" onClick={addSubject} style={{ borderRadius: '12px', padding: '0 18px' }}><Plus size={20} /></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
                        {subjects.map(s => (
                            <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-input)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700 }}>{s}</span>
                                <button className="icon-action-btn-sm danger" onClick={() => removeSubject(s)} style={{ opacity: 0.6 }}><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                    {subjects.length > 0 && <button className="btn-primary" onClick={() => { play(SFX.click); onClose() }} style={{ width: '100%', marginTop: '1.5rem', borderRadius: '12px', height: '48px', fontWeight: 800 }}>¡Listo!</button>}
                </div>
            </div>
        </div>
    )
}

function CourseForm({ initial = EMPTY_COURSE, onSave, onCancel, title, subjects, onManageSubjects }) {
    const [form, setForm] = useState({ ...EMPTY_COURSE, ...initial })
    const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
    const previewGPA = calculateGPA(form)
    const isValid = form.courseName.trim().length > 0

    return (
        <div className="share-modal-overlay" onClick={() => { play(SFX.click); onCancel() }}>
            <form onSubmit={e => { e.preventDefault(); play(SFX.success); onSave({ ...form, gpa: previewGPA }) }} onClick={e => e.stopPropagation()} style={MODAL_STYLE}>
                <div style={{ padding: '2rem 2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 900, fontSize: '1.25rem' }}>{title}</h3>
                    <button type="button" onClick={() => { play(SFX.click); onCancel() }} className="clean-close-btn"><X size={20} /></button>
                </div>

                <div style={{ padding: '0 2rem 2.5rem' }}>
                    {subjects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-input)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
                            <AlertTriangle size={32} color="var(--orange)" style={{ marginBottom: '1rem' }} />
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', marginBottom: '1.5rem' }}>No tienes materias creadas.</p>
                            <button type="button" onClick={() => { play(SFX.pop); onManageSubjects() }} className="btn-primary" style={{ width: '100%', borderRadius: '12px' }}>Configurar Ahora</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>Materia *</label>
                                    <button type="button" onClick={() => { play(SFX.pop); onManageSubjects() }} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.6875rem', fontWeight: 800, cursor: 'pointer' }}>+ CONFIGURAR</button>
                                </div>
                                <select className="panel-select" value={form.courseName} onChange={e => set('courseName', e.target.value)} required style={{ width: '100%', borderRadius: '12px' }}>
                                    <option value="" disabled>Selecciona una opción...</option>
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <NumInput label="Parcial 1" value={form.partial1} onChange={v => set('partial1', v)} />
                                <NumInput label="Parcial 2" value={form.partial2} onChange={v => set('partial2', v)} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                                <NumInput label="% Peso Lab" value={form.pPractic} onChange={v => set('pPractic', v)} hint="%" />
                                <NumInput label="Nota Lab" value={form.practic} onChange={v => set('practic', v)} />
                            </div>

                            <NumInput label="Recuperación" value={form.replacementExam} onChange={v => set('replacementExam', v)} hint="(Opcional)" />

                            <div style={{ padding: '1.25rem', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>Promedio Estimado</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 1000, color: gradeColor(previewGPA), lineHeight: 1 }}>{previewGPA}</p>
                                </div>
                                <Calculator size={24} style={{ opacity: 0.1 }} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => { play(SFX.click); onCancel() }} className="btn-ghost" style={{ flex: 1, height: '48px', borderRadius: '12px' }}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={!isValid} style={{ flex: 2, height: '48px', borderRadius: '12px', fontWeight: 800 }}>Guardar</button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}

function CourseCard({ course, index, onDelete, onEdit }) {
    const [expanded, setExpanded] = useState(false)
    const gpa = parseFloat(course.gpa)

    const toggle = () => {
        play(SFX.pop)
        setExpanded(!expanded)
    }

    return (
        <div className="panel-card" style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{course.courseName}</h4>
                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: gradeColor(gpa), textTransform: 'uppercase', marginTop: '2px' }}>{gradeLabel(gpa)}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: gradeColor(gpa), lineHeight: 1 }}>{course.gpa}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 'auto' }}>
                <button className={`filter-chip ${expanded ? 'active' : ''}`} onClick={toggle} style={{ fontSize: '0.625rem', padding: '2px 10px', height: '26px' }}>
                    {expanded ? 'Menos' : 'Detalles'}
                </button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                    <button className="icon-action-btn-sm" onClick={() => { play(SFX.pop); onEdit(index) }} title="Editar"><Edit3 size={15} /></button>
                    <button className="icon-action-btn-sm danger" onClick={() => { if (confirm('¿Borrar registro?')) { play(SFX.delete); onDelete(index) } }} title="Eliminar"><Trash2 size={15} /></button>
                </div>
            </div>

            {expanded && (
                <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div>
                        <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>Parciales</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-1)' }}>{course.partial1 || 0} / {course.partial2 || 0}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>Laboratorio</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-1)' }}>{course.practic || 0} ({course.pPractic || 0}%)</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function GradeCalc() {
    const { isPro } = usePro()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [courses, setCourses] = useLocalStorage('sd_grade_courses', [])
    const [subjects, setSubjects] = useLocalStorage('sd_subjects', [])
    const [dialog, setDialog] = useState(null)
    const [showSubjectManager, setShowSubjectManager] = useState(false)

    const globalGPA = useCallback(() => {
        if (!courses.length) return '0.00'
        const valid = courses.filter(c => !isNaN(parseFloat(c.gpa)))
        if (!valid.length) return '0.00'
        const sum = valid.reduce((acc, c) => acc + parseFloat(c.gpa), 0)
        return (sum / valid.length).toFixed(2)
    }, [courses])()

    const openAdd = () => {
        play(SFX.pop)
        setDialog({ mode: 'add' })
    }

    const openSettings = () => {
        play(SFX.click)
        setShowSubjectManager(true)
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Calculadora</h1>
                    <p className="page-subtitle">Rendimiento académico · {courses.length} registros</p>
                </div>
      
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="icon-action-btn" onClick={openSettings} title="Gestionar materias"><Settings size={18} /></button>
                    <button onClick={openAdd} className="btn-primary-sm">
                        <Plus size={16} /> Nueva nota
                    </button>
                </div>
            </div>

            {/* Compact Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Promedio Global', val: globalGPA, col: gradeColor(globalGPA), icon: <BarChart3 size={16} color="var(--accent)" />, bg: 'var(--accent-dim)' },
                    { label: 'Aprobadas', val: courses.filter(c => parseFloat(c.gpa) >= 6).length, col: 'var(--green)', icon: <Check size={16} color="var(--green)" />, bg: 'var(--green-dim)' },
                    { label: 'Reprobadas', val: courses.filter(c => parseFloat(c.gpa) < 6).length, col: 'var(--red)', icon: <X size={16} color="var(--red)" />, bg: 'var(--red-dim)' }
                ].map((s, i) => (
                    <div key={i} className="panel-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>{s.label}</p>
                            <p style={{ fontSize: '1.125rem', fontWeight: 900, color: s.col }}>{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* List Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
                {courses.length === 0 && (
                    <div className="panel-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-4)' }}>
                        <Calculator size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p style={{ fontSize: '1rem', fontWeight: 500 }}>No hay notas guardadas.</p>
                    </div>
                )}
                {courses.map((c, i) => (
                    <CourseCard key={i} course={c} index={i} onEdit={(idx) => { play(SFX.pop); setDialog({ mode: 'edit', index: idx }) }} onDelete={(idx) => setCourses(courses.filter((_, k) => k !== idx))} />
                ))}
            </div>

            {dialog && (
                <CourseForm title={dialog.mode === 'add' ? 'Registrar Nota' : 'Editar Nota'} initial={dialog.mode === 'edit' ? courses[dialog.index] : EMPTY_COURSE} subjects={subjects} onCancel={() => setDialog(null)} onSave={(data) => {
                    if (dialog.mode === 'add') setCourses([data, ...courses]); else setCourses(courses.map((c, i) => i === dialog.index ? data : c)); setDialog(null);
                }} onManageSubjects={() => { setDialog(null); setShowSubjectManager(true); }} />
            )}

            {showSubjectManager && <SubjectManager subjects={subjects} setSubjects={setSubjects} onClose={() => setShowSubjectManager(false)} />}
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}

            <style>{`
                .clean-close-btn { background: transparent; border: none; color: var(--text-4); cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; transition: all 0.2s; }
                .clean-close-btn:hover { background: var(--bg-hover); color: var(--text-1); transform: rotate(90deg); }
                .icon-action-btn-sm { padding: 6px; background: transparent; border: none; cursor: pointer; color: var(--text-4); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; opacity: 0.7; }
                .icon-action-btn-sm:hover { background: var(--bg-hover); color: var(--text-1); opacity: 1; }
                .icon-action-btn-sm.danger:hover { color: var(--red); background: var(--red-dim); }
                .filter-chip { background: var(--bg-hover); color: var(--text-3); border: 1px solid var(--border-subtle); border-radius: 6px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
                .filter-chip.active { background: var(--accent-dim); color: var(--accent); border-color: var(--accent-border); }
            `}</style>
        </div>
    )
}
