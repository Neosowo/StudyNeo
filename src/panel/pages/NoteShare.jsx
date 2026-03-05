import { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { sanitize } from '../../utils/sanitize'
import {
    Globe, Lock, FileText, Edit3, Lightbulb, Calendar, Book, Target,
    Flame, Monitor, FlaskConical, Palette, Rocket, Star, Sprout
} from 'lucide-react'

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
    // Si no es un icono de lucide, es un emoji (o el default)
    return <span style={{ fontSize: `${size}px`, lineHeight: 1, display: 'inline-block' }}>{name || '📄'}</span>
}

export default function NoteShare({ noteId }) {
    const [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchNote() {
            setLoading(true)
            try {
                const noteRef = doc(db, 'shared_notes', String(noteId))
                const snap = await getDoc(noteRef)
                if (snap.exists()) {

                    setNote({ id: snap.id, ...snap.data() })
                } else {
                    console.warn("[NoteShare] La nota no existe en Firestore:", noteId)
                    setNote(null)
                }
            } catch (err) {
                console.error("Error al cargar nota compartida:", err)
                setNote(null)
            } finally {
                setLoading(false)
            }
        }
        if (noteId) fetchNote()
        else setLoading(false)
    }, [noteId])

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020202', color: 'white', fontFamily: 'Inter, sans-serif' }}>
                <p>Cargando nota compartida...</p>
            </div>
        )
    }

    if (!note) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020202', color: 'white', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>404</h1>
                    <p style={{ color: '#888', maxWidth: '400px' }}>Esta nota no existe o ya no es pública. Por favor, contacta con el autor.</p>
                    <button
                        onClick={() => window.location.hash = ''}
                        style={{ marginTop: '2rem', padding: '12px 24px', borderRadius: '12px', background: '#222', border: '1px solid #333', color: 'white', cursor: 'pointer' }}
                    >
                        Volver a StudyNeo
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div data-theme={note.theme || 'dark'} style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-1)', fontFamily: 'Inter, sans-serif' }}>
            {/* Header / Navbar */}
            <header style={{
                padding: '1.25rem 2rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-base)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconRenderer name={note.icon} size={22} color="var(--accent)" />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontWeight: 900, fontSize: '0.9rem', color: 'var(--text-1)' }}>StudyNeo Shared</span>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visualización Pública</span>
                    </div>
                </div>
                <button
                    onClick={() => window.location.hash = '#auth'}
                    style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    Obtener StudyNeo
                </button>
            </header>

            {/* Content */}
            <main style={{ maxWidth: '840px', margin: '0 auto', padding: '6rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', opacity: 0.6 }}>
                    <Globe size={14} color="var(--accent)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)' }}>Nota publicada por {note.author || 'Estudiante'}</span>
                </div>

                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.05em', color: 'var(--text-1)', lineHeight: 1.1 }}>
                    {note.title || 'Página sin título'}
                </h1>

                <div
                    className="notion-content"
                    style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-2)' }}
                    dangerouslySetInnerHTML={{ __html: sanitize(note.body || '') }}
                />
            </main>

            <footer style={{ textAlign: 'center', padding: '6rem 2rem 4rem', color: 'var(--text-4)', fontSize: '12px' }}>
                StudyNeo • {new Date().getFullYear()} • Elevando el potencial estudiantil
            </footer>

            <style>{`
                ::selection { background: var(--accent-dim); color: var(--text-1); }
                .notion-content strong { color: var(--text-1); font-weight: 800; }
                .notion-content h1, .notion-content h2, .notion-content h3 { color: var(--text-1); margin-top: 2.5rem; letter-spacing: -0.02em; }
                
                pre {
                    background: var(--bg-surface) !important;
                    color: var(--text-1) !important;
                    padding: 2rem !important;
                    border-radius: 20px !important;
                    margin: 2.5rem 0 !important;
                    border: 1px solid var(--border-subtle) !important;
                    font-family: 'JetBrains Mono', monospace !important;
                    font-size: 0.9375rem !important;
                    line-height: 1.7 !important;
                    white-space: pre-wrap !important;
                    box-shadow: var(--shadow-md) !important;
                }
                
                blockquote {
                    border-left: 4px solid var(--accent);
                    padding-left: 1.5rem;
                    margin: 2rem 0;
                    color: var(--text-2);
                    font-style: italic;
                    background: var(--accent-dim);
                    padding: 1.5rem 2rem;
                    border-radius: 0 16px 16px 0;
                }

                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: var(--text-4); border-radius: 10px; border: 2px solid var(--bg-base); }
                ::-webkit-scrollbar-thumb:hover { background: var(--text-3); }
            `}</style>
        </div>
    )
}
