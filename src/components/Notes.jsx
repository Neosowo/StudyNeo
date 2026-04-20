import { useState, useEffect, useRef, useCallback } from 'react'
import { storage, KEYS } from '../utils/storage'
import {
  StickyNote, X, Plus, Trash2, Bold, Italic, List,
  ChevronLeft, Clock, Search, Copy, Download, Tag, Eye, Edit3, Sigma
} from 'lucide-react'

/* ── KaTeX lazy loader ──────────────────────────────────── */
let katexLoaded = false
function loadKatex() {
  if (katexLoaded || document.getElementById('katex-css')) return
  const link = Object.assign(document.createElement('link'), {
    rel: 'stylesheet', id: 'katex-css',
    href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
  })
  document.head.appendChild(link)
  const script = Object.assign(document.createElement('script'), {
    src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
    onload: () => { katexLoaded = true }
  })
  document.head.appendChild(script)
}

/* ── Markdown + LaTeX renderer ──────────────────────────── */
function renderMarkdown(text) {
  // Escape HTML first
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // LaTeX blocks: $$...$$
  html = html.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
    try { return window.katex ? window.katex.renderToString(math, { displayMode: true }) : `<code>$$${math}$$</code>` }
    catch { return `<code>$$${math}$$</code>` }
  })

  // LaTeX inline: $...$
  html = html.replace(/\$([^$\n]+)\$/g, (_, math) => {
    try { return window.katex ? window.katex.renderToString(math, { displayMode: false }) : `<code>$${math}$</code>` }
    catch { return `<code>$${math}$</code>` }
  })

  // Bold+italic: ***text***
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic: _text_
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  // Strikethrough: ~~text~~
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="note-inline-code">$1</code>')
  // H1-H3
  html = html.replace(/^### (.+)$/gm, '<h3 class="note-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm,  '<h2 class="note-h2">$1</h2>')
  html = html.replace(/^# (.+)$/gm,   '<h1 class="note-h1">$1</h1>')
  // Unordered list items
  html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul class="note-ul">$1</ul>')
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="note-hr" />')
  // Paragraph breaks (double newline)
  html = html.replace(/\n\n/g, '</p><p class="note-p">')
  // Single newlines
  html = html.replace(/\n/g, '<br>')
  return `<p class="note-p">${html}</p>`
}

const COLORS = [
  { id: 'default', label: 'Default', bg: 'var(--bg-surface)', border: 'var(--border-default)' },
  { id: 'purple',  label: 'Morado',  bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
  { id: 'blue',    label: 'Azul',    bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)' },
  { id: 'green',   label: 'Verde',   bg: 'rgba(74,222,128,0.08)',  border: 'rgba(74,222,128,0.25)' },
  { id: 'orange',  label: 'Naranja', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.25)' },
  { id: 'red',     label: 'Rojo',    bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)' },
]
const COLOR_DOTS = { default:'#8878b8', purple:'#a78bfa', blue:'#60a5fa', green:'#4ade80', orange:'#fb923c', red:'#f87171' }

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'ahora mismo'
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}
function wordCount(t) { return t.trim() ? t.trim().split(/\s+/).length : 0 }

/* ══════════════════════════════════════════════════════════ */
/* NOTE EDITOR                                                 */
/* ══════════════════════════════════════════════════════════ */
function NoteEditor({ note, onSave, onBack }) {
  const [text,    setText]    = useState(note.content)
  const [title,   setTitle]   = useState(note.title)
  const [color,   setColor]   = useState(note.color || 'default')
  const [tag,     setTag]     = useState(note.tag || '')
  const [preview, setPreview] = useState(false)
  const textareaRef           = useRef(null)

  useEffect(() => { loadKatex() }, [])

  // Auto-save
  useEffect(() => {
    const t = setTimeout(() => onSave({ ...note, title, content: text, color, tag, updatedAt: new Date().toISOString() }), 500)
    return () => clearTimeout(t)
  }, [text, title, color, tag])

  const insertFormat = (prefix, suffix = prefix) => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    const sel = text.slice(s, e)
    const newText = text.slice(0, s) + prefix + sel + suffix + text.slice(e)
    setText(newText)
    setTimeout(() => { ta.selectionStart = s + prefix.length; ta.selectionEnd = e + prefix.length; ta.focus() }, 0)
  }

  const insertList = () => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart: s } = ta
    const lineStart = text.lastIndexOf('\n', s - 1) + 1
    const insert = text[lineStart] === '-' ? '' : '- '
    setText(text.slice(0, lineStart) + insert + text.slice(lineStart))
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + insert.length; ta.focus() }, 0)
  }

  const insertLatex = () => insertFormat('$', '$')

  const copyText = () => navigator.clipboard.writeText(text).catch(() => {})

  const downloadNote = () => {
    const blob = new Blob([`# ${title}\n\n${text}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `${title || 'nota'}.txt` })
    a.click(); URL.revokeObjectURL(url)
  }

  const col = COLORS.find(c => c.id === color) || COLORS[0]

  return (
    <div className="notes-editor-view" style={{ '--note-bg': col.bg, '--note-border': col.border }}>
      {/* Toolbar */}
      <div className="notes-editor-toolbar">
        <button className="notes-toolbar-btn notes-back-btn" onClick={onBack} title="Volver">
          <ChevronLeft size={15} />
        </button>

        <input
          className="notes-title-input"
          placeholder="Título de la nota…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={60}
        />

        <div className="notes-toolbar-actions">
          {!preview && <>
            <button className="notes-toolbar-btn" onClick={() => insertFormat('**')} title="Negrita"><Bold size={13} /></button>
            <button className="notes-toolbar-btn" onClick={() => insertFormat('_')} title="Cursiva"><Italic size={13} /></button>
            <button className="notes-toolbar-btn" onClick={insertList} title="Lista"><List size={13} /></button>
            <button className="notes-toolbar-btn" onClick={insertLatex} title="LaTeX inline"><Sigma size={13} /></button>
            <div className="notes-divider" />
          </>}
          <button className={`notes-toolbar-btn ${preview ? 'active-tool' : ''}`} onClick={() => setPreview(p => !p)} title={preview ? 'Editar' : 'Vista previa'}>
            {preview ? <Edit3 size={13} /> : <Eye size={13} />}
          </button>
          <div className="notes-divider" />
          <button className="notes-toolbar-btn" onClick={copyText} title="Copiar"><Copy size={13} /></button>
          <button className="notes-toolbar-btn" onClick={downloadNote} title="Descargar"><Download size={13} /></button>
        </div>
      </div>

      {/* Color & tag bar */}
      <div className="notes-meta-bar">
        <div className="notes-color-pickers">
          {COLORS.map(c => (
            <button
              key={c.id}
              className={`notes-color-dot ${color === c.id ? 'active' : ''}`}
              style={{ '--dot-color': COLOR_DOTS[c.id] }}
              onClick={() => setColor(c.id)}
              title={c.label}
            />
          ))}
        </div>
        <div className="notes-tag-wrap">
          <Tag size={11} />
          <input className="notes-tag-input" placeholder="Etiqueta…" value={tag} onChange={e => setTag(e.target.value)} maxLength={20} />
        </div>
      </div>

      {/* Edit or Preview */}
      {preview ? (
        <div
          className="notes-preview"
          dangerouslySetInnerHTML={{ __html: text ? renderMarkdown(text) : '<p style="color:var(--text-4);font-style:italic">Sin contenido…</p>' }}
          style={{ background: col.bg }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          className="notes-textarea notes-textarea-editor"
          placeholder={`**negrita**  _cursiva_  - lista  $LaTeX$  $$bloque LaTeX$$`}
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
          style={{ background: col.bg, borderColor: col.border }}
        />
      )}

      {/* Footer stats */}
      <div className="notes-footer">
        <span className="notes-counter">{text.length} caracteres · {wordCount(text)} palabras</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="notes-counter" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={10} /> {timeAgo(note.updatedAt)}
          </span>
          {text && <button className="notes-clear" onClick={() => setText('')}>Limpiar</button>}
        </div>
      </div>
    </div>
  )
}

/* ── Note Card ────────────────────────────────────────────── */
function NoteCard({ note, onOpen, onDelete }) {
  const col = COLORS.find(c => c.id === note.color) || COLORS[0]
  const preview = note.content.replace(/\*\*/g,'').replace(/_/g,'').replace(/\$/g,'').trim().slice(0, 120)
  return (
    <div className="note-card" style={{ background: col.bg, borderColor: col.border }} onClick={() => onOpen(note)}>
      <div className="note-card-header">
        <span className="note-card-title">{note.title || 'Sin título'}</span>
        <button className="note-card-delete" onClick={e => { e.stopPropagation(); onDelete(note.id) }} title="Eliminar">
          <Trash2 size={12} />
        </button>
      </div>
      {note.tag && <span className="note-card-tag"><Tag size={9} /> {note.tag}</span>}
      <p className="note-card-preview">{preview || 'Nota vacía'}</p>
      <span className="note-card-time"><Clock size={9} /> {timeAgo(note.updatedAt)}</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* MAIN NOTES COMPONENT                                        */
/* ══════════════════════════════════════════════════════════ */
const NOTES_KEY = 'studyneo_notes_v2'
const DEFAULT_NOTE = () => ({
  id: Date.now(), title: '', content: '', color: 'default', tag: '',
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
})

export default function Notes({ onClose, integrated }) {
  const [notes,      setNotes]      = useState(() => {
    const stored = storage.get(NOTES_KEY, null)
    if (!stored) {
      const legacy = storage.get(KEYS.NOTES, '')
      if (legacy) return [{ ...DEFAULT_NOTE(), title: 'Mis notas', content: legacy }]
      return []
    }
    return stored
  })
  const [activeNote, setActiveNote] = useState(null)
  const [search,     setSearch]     = useState('')

  useEffect(() => { storage.set(NOTES_KEY, notes) }, [notes])

  const createNote = () => {
    const n = DEFAULT_NOTE()
    setNotes(prev => [n, ...prev])
    setActiveNote(n)
  }

  const saveNote = useCallback((updated) => {
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
    setActiveNote(updated)
  }, [])

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeNote?.id === id) setActiveNote(null)
  }

  const filtered = search.trim()
    ? notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()) ||
        n.tag.toLowerCase().includes(search.toLowerCase()))
    : notes

  if (activeNote) {
    return (
      <div className={integrated ? 'notes-integrated' : 'notes-panel animate-scale'}>
        {!integrated && (
          <div className="notes-header">
            <div className="notes-title-row"><StickyNote size={15} color="var(--accent)" /><span className="notes-title">Notas</span></div>
            <button className="notes-close" onClick={onClose}><X size={15} /></button>
          </div>
        )}
        <NoteEditor note={activeNote} onSave={saveNote} onBack={() => setActiveNote(null)} />
      </div>
    )
  }

  return (
    <div className={integrated ? 'notes-integrated' : 'notes-panel animate-scale'}>
      {!integrated && (
        <div className="notes-header">
          <div className="notes-title-row"><StickyNote size={15} color="var(--accent)" /><span className="notes-title">Notas</span></div>
          <button className="notes-close" onClick={onClose}><X size={15} /></button>
        </div>
      )}

      <div className="notes-list-header">
        <div className="notes-search-wrap">
          <Search size={12} className="notes-search-icon" />
          <input className="notes-search-input" placeholder="Buscar nota…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="notes-new-btn" onClick={createNote}><Plus size={14} /> Nueva</button>
      </div>

      <div className="notes-grid">
        {filtered.length === 0 ? (
          <div className="notes-empty">
            <StickyNote size={32} style={{ color: 'var(--text-4)', marginBottom: 8 }} />
            <p style={{ color: 'var(--text-4)', fontSize: 13 }}>{search ? 'Sin resultados' : 'No hay notas aún'}</p>
            {!search && <button className="notes-new-btn" onClick={createNote} style={{ marginTop: 12 }}><Plus size={14} /> Crear primera nota</button>}
          </div>
        ) : (
          filtered.map(note => (
            <NoteCard key={note.id} note={note} onOpen={setActiveNote} onDelete={deleteNote} />
          ))
        )}
      </div>
    </div>
  )
}
