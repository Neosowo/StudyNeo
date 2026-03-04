import { useState, useRef, useEffect } from 'react'
import {
    Plus, Trash2, Search, FileText, X, Save, Share2, Globe, Lock, Copy, Check, History, Link as LinkIcon,
    Bold as BoldIcon, Italic as ItalicIcon, Code as CodeIcon, Trash, Zap,
    Edit3, Lightbulb, Calendar, Book, Target, Flame, Monitor, FlaskConical, Palette, Rocket, Star, Sprout
} from 'lucide-react'
import { db } from '../../firebase'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import { useTheme } from '../../ThemeContext'
import ProUpgradeModal from '../../ProUpgradeModal'

export default function Notes({ user, updateUser }) {
    const [notes, setNotes] = useLocalStorage('sd_notes', [])
    const { isPro } = useProContext()
    const { theme } = useTheme()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [activeId, setActiveId] = useState(null)
    const [search, setSearch] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const [editIcon, setEditIcon] = useState('FileText')
    const [dirty, setDirty] = useState(false)
    const [showIconMenu, setShowIconMenu] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [copied, setCopied] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, hasSelection: false })

    const editorRef = useRef(null)
    const activeNote = notes.find(n => n.id === activeId)

    const filtered = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        (n.body || '').toLowerCase().includes(search.toLowerCase())
    )

    const iconMap = [
        { name: 'FileText', icon: FileText },
        { name: 'Edit3', icon: Edit3 },
        { name: 'Lightbulb', icon: Lightbulb },
        { name: 'Calendar', icon: Calendar },
        { name: 'Book', icon: Book },
        { name: 'Target', icon: Target },
        { name: 'Flame', icon: Flame },
        { name: 'Monitor', icon: Monitor },
        { name: 'FlaskConical', icon: FlaskConical },
        { name: 'Palette', icon: Palette },
        { name: 'Rocket', icon: Rocket },
        { name: 'Star', icon: Star },
        { name: 'Sprout', icon: Sprout },
    ]

    const EMOJIS = ['📝', '📄', '📂', '💡', '📌', '📎', '📅', '📖', '🎯', '🔥', '💻', '🧪', '🎨', '🚀', '⭐', '🌱', '✅', '🔒', '🛠️', '⚙️', '💬', '⚡', '🌈', '🎓', '🏆', '🍕', '🌍', '❤️', '💼']

    const IconRenderer = ({ name, size = 18, color = 'currentColor' }) => {
        const item = iconMap.find(i => i.name === name)
        if (item) {
            const Icon = item.icon
            return <Icon size={size} color={color} />
        }
        // Si no es un icono de lucide, es un emoji
        return <span style={{ fontSize: `${size}px`, lineHeight: 1, display: 'inline-block' }}>{name || '📄'}</span>
    }

    const createNote = () => {
        if (!isPro && notes.length >= 10) {
            setShowUpgrade(true)
            return
        }
        const note = {
            id: Date.now(),
            title: '',
            body: '',
            icon: 'FileText',
            shared: false,
            collaborators: [],
            changes: [],
            createdAt: new Date().toISOString()
        }
        setNotes(prev => [note, ...prev])
        openNote(note)
    }

    const openNote = (note) => {
        if (dirty) saveNote()
        setActiveId(note.id)
        setEditTitle(note.title)
        setEditIcon(note.icon || 'FileText')
        setDirty(false)
        setContextMenu({ show: false, x: 0, y: 0, hasSelection: false })

        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.innerHTML = note.body || ''
            }
        }, 0)
    }

    const saveNote = () => {
        if (!activeId || !editorRef.current) return
        const htmlContent = editorRef.current.innerHTML
        setNotes(prev => prev.map(n =>
            n.id === activeId ? {
                ...n,
                title: editTitle,
                body: htmlContent,
                icon: editIcon,
                updatedAt: new Date().toISOString(),
                changes: [{ user: 'Tú', time: new Date().toISOString(), type: 'Edición' }, ...(n.changes || []).slice(0, 9)]
            } : n
        ))
        setDirty(false)
    }

    const deleteNote = (id) => {
      
        if (!id) return
        if (!confirm('¿Seguro que quieres borrar esta página y todo su contenido?')) return

        setNotes(prev => {
            const next = prev.filter(n => n.id !== id)
            
            return next
        })

        if (activeId === id) {
            setActiveId(null)
            setDirty(false)
            if (editorRef.current) editorRef.current.innerHTML = ''
        }
    }

    const toggleShare = async () => {
        if (!activeNote) return
        const newShared = !activeNote.shared

        if (newShared && !isPro) {
            const sharedCount = notes.filter(n => n.shared).length
            if (sharedCount >= 1) {
                setShowUpgrade(true)
                return
            }
        }

        // Update local state
        setNotes(prev => prev.map(n => n.id === activeId ? { ...n, shared: newShared } : n))

        // Update Firestore for public access
        const noteRef = doc(db, 'shared_notes', String(activeId))
        if (newShared) {
            try {
                await setDoc(noteRef, {
                    title: editTitle,
                    body: editorRef.current?.innerHTML || activeNote.body,
                    icon: editIcon,
                    updatedAt: new Date().toISOString(),
                    author: user?.name || 'Estudiante',
                    theme: theme
                })
                alert('Nota publicada con éxito. Ahora puedes copiar el link.')
            } catch (err) {
                console.error("Error al publicar nota:", err)
                if (err.message.includes('permission-denied')) {
                    alert('Error: No tienes permisos para publicar notas en internet. Contacta con el administrador.')
                } else {
                    alert('Error al publicar nota: ' + err.message)
                }
            }
        } else {
            try {
                await deleteDoc(noteRef)
            } catch (err) {
                console.error("Error al despublicar:", err)
            }
        }
    }

    const copyLink = () => {
        const url = window.location.origin + window.location.pathname + '#share/note/' + activeId
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(url).catch(() => { })
        } else {
            const el = document.createElement('textarea')
            el.value = url
            document.body.appendChild(el)
            el.select()
            try { document.execCommand('copy') } catch (err) { }
            document.body.removeChild(el)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleTitleChange = (v) => { setEditTitle(v); setDirty(true) }
    const handleIconSelect = (e) => { setEditIcon(e); setDirty(true); setShowIconMenu(false) }

    const applyFormat = (command, value = null) => {
        document.execCommand(command, false, value)
        editorRef.current.focus()
        setContextMenu({ ...contextMenu, show: false })
        setDirty(true)
    }

    const handleContextMenu = (e) => {
        e.preventDefault()
        const selection = window.getSelection().toString().trim()
        setContextMenu({
            show: true,
            x: e.clientX,
            y: e.clientY,
            hasSelection: selection.length > 0
        })
    }

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(s => ({ ...s, show: false }))
        window.addEventListener('mousedown', (e) => {
            if (!e.target.closest('.context-menu-popover')) handleClickOutside()
        })
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="notes-layout" style={{ background: 'var(--bg-base)' }}>
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
            <div className="notes-list" style={{ borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <div className="notes-list-header" style={{ padding: '1.25rem 1rem 0.5rem' }}>
                    <h1 style={{ fontWeight: 800, fontSize: '0.8125rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Workspace
                    </h1>
                    <button className="icon-action-btn" onClick={createNote} title="Nueva página">
                        <Plus size={16} />
                    </button>
                </div>

                {!isPro && (
                    <div style={{ margin: '0 0.75rem 0.75rem', padding: '0.75rem', background: 'var(--accent-dim)', borderRadius: '8px', border: '1px solid var(--accent-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                            <Zap size={14} color="var(--accent)" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-1)' }}>
                                <strong style={{ color: 'var(--accent)' }}>{notes.length}/10</strong> notas Gratis
                            </span>
                        </div>
                        <button onClick={() => setShowUpgrade(true)} style={{ width: '100%', background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 700, padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.6875rem' }}>
                            Quitar Límite
                        </button>
                    </div>
                )}

                <div className="search-box" style={{ margin: '0.5rem 0.75rem 1rem' }}>
                    <Search size={13} style={{ color: 'var(--text-4)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="search-input" style={{ fontSize: '0.8125rem' }} />
                </div>

                <div className="notes-items custom-scrollbar">
                    {filtered.map(note => (
                        <div
                            key={note.id}
                            className={`note-item ${activeId === note.id ? 'active' : ''}`}
                            onClick={() => openNote(note)}
                            style={{
                                padding: '0.4rem 0.75rem', margin: '0.125rem 0.5rem', borderRadius: '6px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: activeId === note.id ? 'var(--bg-hover)' : 'transparent',
                            }}
                        >
                            <IconRenderer name={note.icon || 'FileText'} size={14} color={activeId === note.id ? 'var(--accent)' : 'var(--text-4)'} />
                            <span style={{
                                flex: 1, fontSize: '0.8125rem',
                                color: activeId === note.id ? 'var(--text-1)' : 'var(--text-2)',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                fontWeight: activeId === note.id ? 600 : 400
                            }}>
                                {note.title || 'Sin título'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="notes-editor" style={{ background: 'var(--bg-base)', position: 'relative' }}>
                {activeNote ? (
                    <div
                        style={{ height: '100%', overflowY: 'auto' }}
                        className="custom-scrollbar"
                        onContextMenu={handleContextMenu}
                    >
                        <div style={{
                            position: 'sticky', top: 0, zIndex: 100,
                            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                            padding: '0.625rem 1.5rem', gap: '0.75rem',
                            background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)'
                        }}>
                            <button className="btn-ghost-sm" onClick={() => setHistoryOpen(!historyOpen)} style={{ opacity: 0.7 }}>
                                <History size={15} />
                            </button>
                            <button className="btn-ghost-sm" onClick={() => setShowShare(true)} style={{ gap: '6px', fontSize: '12px', fontWeight: 700 }}>
                                <Share2 size={14} /> Compartir
                            </button>
                            {dirty && (
                                <button className="btn-accent-sm" onClick={saveNote} style={{ borderRadius: '8px', padding: '6px 16px', fontSize: '12px' }}>
                                    Guardar cambios
                                </button>
                            )}
                            <button className="icon-action-btn danger" onClick={() => deleteNote(activeId)}>
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="editor-inner-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 4rem 15rem' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <button
                                    onClick={() => setShowIconMenu(!showIconMenu)}
                                    style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: '24px', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                                >
                                    <IconRenderer name={editIcon} size={64} color="var(--accent)" />
                                </button>
                                {showIconMenu && (
                                    <div className="emoji-picker-popover" style={{
                                        top: '120px', left: '4rem', background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-default)', borderRadius: '16px',
                                        padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 200
                                    }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                                            {iconMap.map(item => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => handleIconSelect(item.name)}
                                                    style={{ background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <item.icon size={20} color="var(--text-2)" />
                                                </button>
                                            ))}
                                            {EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleIconSelect(emoji)}
                                                    style={{ background: 'var(--bg-hover)', border: 'none', cursor: 'pointer', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                className="note-title-input"
                                value={editTitle}
                                onChange={e => handleTitleChange(e.target.value)}
                                placeholder="Escribe un título..."
                                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '3.75rem', fontWeight: 900, color: 'var(--text-1)', outline: 'none', letterSpacing: '-0.04em', marginBottom: '1rem' }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', fontSize: '12px', color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {activeNote.shared ? <Globe size={14} style={{ color: 'var(--green)' }} /> : <Lock size={14} />}
                                    {activeNote.shared ? 'Público' : 'Espacio Personal'}
                                </div>
                                <span style={{ opacity: 0.2 }}>•</span>
                                <span>Edición: {activeNote.updatedAt ? new Date(activeNote.updatedAt).toLocaleTimeString() : 'Ahora'}</span>
                            </div>

                            <div
                                ref={editorRef}
                                contentEditable
                                onInput={() => setDirty(true)}
                                onBlur={saveNote}
                                data-placeholder="Empieza a escribir..."
                                className="rich-text-editor custom-scrollbar"
                                style={{
                                    width: '100%', minHeight: '600px', border: 'none',
                                    background: 'transparent', fontSize: '1.1875rem',
                                    lineHeight: 1.8, color: 'var(--text-2)', outline: 'none',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                            />
                        </div>

                        {contextMenu.show && (
                            <div className="context-menu-popover" style={{
                                position: 'fixed', top: contextMenu.y, left: contextMenu.x,
                                background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
                                borderRadius: '12px', padding: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                                zIndex: 1000, width: '190px', display: 'flex', flexDirection: 'column', gap: '2px'
                            }}>
                                {contextMenu.hasSelection ? (
                                    <>
                                        <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-4)', padding: '6px 12px', textTransform: 'uppercase' }}>Estilo</p>
                                        <button className="context-item" onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}>
                                            <BoldIcon size={14} /> <span>Negrita</span>
                                        </button>
                                        <button className="context-item" onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}>
                                            <ItalicIcon size={14} /> <span>Cursiva</span>
                                        </button>
                                        <button className="context-item" onMouseDown={(e) => { e.preventDefault(); applyFormat('formatBlock', '<pre>'); }}>
                                            <CodeIcon size={14} /> <span>Bloque de Código</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="context-item" onClick={() => {
                                            if (editorRef.current) {
                                                const text = editorRef.current.innerText
                                                if (navigator.clipboard && window.isSecureContext) {
                                                    navigator.clipboard.writeText(text).catch(() => { })
                                                } else {
                                                    const el = document.createElement('textarea')
                                                    el.value = text
                                                    document.body.appendChild(el)
                                                    el.select()
                                                    try { document.execCommand('copy') } catch (err) { }
                                                    document.body.removeChild(el)
                                                }
                                            }
                                            setContextMenu({ ...contextMenu, show: false })
                                        }}>
                                            <Copy size={14} /> <span>Copiar texto</span>
                                        </button>
                                        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
                                        <button className="context-item danger" style={{ color: 'var(--red)' }} onClick={() => deleteNote(activeId)}>
                                            <Trash size={14} /> <span>Eliminar página</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {historyOpen && (
                            <div className="history-panel" style={{
                                position: 'fixed', right: 0, top: '41px', bottom: 0, width: '320px',
                                background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
                                zIndex: 100, padding: '2rem', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.1em' }}>Historial</h3>
                                    <button className="clean-close-btn" onClick={() => setHistoryOpen(false)}><X size={20} /></button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {activeNote.changes?.map((ch, i) => (
                                        <div key={i} style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)' }}>
                                            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{ch.user}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '4px' }}>{new Date(ch.time).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="notes-empty">
                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                            <FileText size={32} style={{ color: 'var(--accent)' }} />
                        </div>
                        <h2 style={{ color: 'var(--text-1)', fontSize: '1.5rem', fontWeight: 900 }}>Tus Notas</h2>
                        <button className="btn-primary-sm" onClick={createNote} style={{ marginTop: '2.5rem', height: '48px', padding: '0 32px', borderRadius: '14px', fontSize: '14px', fontWeight: 700 }}>
                            <Plus size={20} /> Crear página
                        </button>
                    </div>
                )}

                {showShare && (
                    <div className="share-modal-overlay" onClick={() => setShowShare(false)}>
                        <div className="share-visualizer" style={{
                            width: '440px', background: 'var(--bg-elevated)', borderRadius: '24px',
                            overflow: 'hidden', border: '1px solid var(--border-strong)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '2rem 2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Share2 size={16} color="white" />
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-1)' }}>Compartir</h2>
                                </div>
                                <button className="clean-close-btn" onClick={() => setShowShare(false)}><X size={24} /></button>
                            </div>

                            <div style={{ padding: '0 2rem 2.5rem' }}>
                                <div style={{ background: 'var(--bg-input)', borderRadius: '20px', border: '1px solid var(--border-subtle)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: activeNote.shared ? 'var(--green-dim)' : 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Globe size={24} style={{ color: activeNote.shared ? 'var(--green)' : 'var(--text-4)' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-1)' }}>Visibilidad Pública</p>
                                            <p style={{ fontSize: '12px', color: 'var(--text-4)' }}>{activeNote.shared ? 'Enlace activo' : 'Privado'}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={toggleShare}
                                        style={{
                                            width: '100%', height: '44px', borderRadius: '12px',
                                            background: activeId && activeNote.shared ? 'var(--red-dim)' : 'var(--accent)',
                                            color: activeId && activeNote.shared ? 'var(--red)' : 'white',
                                            border: 'none', fontSize: '13px', fontWeight: 800, cursor: 'pointer'
                                        }}
                                    >
                                        {activeNote.shared ? 'Detener publicación' : 'Publicar nota'}
                                    </button>
                                </div>

                                {activeNote.shared && (
                                    <div className="share-url-box">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <LinkIcon size={12} style={{ color: 'var(--text-4)' }} />
                                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase' }}>Link de visualización</span>
                                        </div>
                                        <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input readOnly value={window.location.origin + window.location.pathname + '#share/note/' + activeId} style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '13px', fontWeight: 600, outline: 'none' }} />
                                            <button onClick={copyLink} className="icon-action-btn" style={{ padding: '8px', background: 'var(--bg-input)' }}>
                                                {copied ? <Check size={18} color="var(--green)" /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .rich-text-editor pre {
                    background: #1a1a1f !important;
                    color: #d1d1d6 !important;
                    padding: 1.5rem !important;
                    border-radius: 12px !important;
                    margin: 1.5rem 0 !important;
                    border: 1px solid #333 !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 0.95rem !important;
                    line-height: 1.6 !important;
                    white-space: pre-wrap !important;
                }
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
                .context-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 16px;
                    width: 100%;
                    border: none;
                    background: transparent;
                    color: var(--text-2);
                    cursor: pointer;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    text-align: left;
                    transition: background 0.2s;
                }
                .context-item:hover {
                    background: var(--bg-hover);
                    color: var(--text-1);
                }
                .rich-text-editor:empty:before {
                    content: attr(data-placeholder);
                    color: var(--text-4);
                    pointer-events: none;
                }
            `}</style>
        </div>
    )
}
