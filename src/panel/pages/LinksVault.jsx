import { useState } from 'react'
import { Plus, Trash2, ExternalLink, Search, Link2, Tag, Copy, Check, Zap, BookOpen } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePro } from '../hooks/usePro'
import ProUpgradeModal from '../../ProUpgradeModal'

const TAGS = ['General', 'Artículo', 'Video', 'Documento', 'Referencia', 'Herramienta', 'Libro', 'Otro']

export default function LinksVault() {
    const [links, setLinks] = useLocalStorage('sd_links', [])
    const [subjects] = useLocalStorage('sd_subjects', [])  // synced with GradeCalc
    const { isPro } = usePro()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [tag, setTag] = useState('General')
    const [subject, setSubject] = useState('')
    const [search, setSearch] = useState('')
    const [tagFilter, setTagFilter] = useState('All')
    const [copied, setCopied] = useState(null)

    const addLink = () => {
        if (!isPro && links.length >= 10) {
            setShowUpgrade(true)
            return
        }
        if (!url.trim()) return
        let cleanUrl = url.trim()
        if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl

        const domain = (() => {
            try { return new URL(cleanUrl).hostname.replace('www.', '') } catch { return '' }
        })()

        setLinks(prev => [{
            id: Date.now(),
            url: cleanUrl,
            title: title.trim() || domain || cleanUrl,
            tag,
            subject: subject.trim(),
            domain,
            createdAt: new Date().toISOString(),
        }, ...prev])
        setUrl('')
        setTitle('')
        setSubject('')
    }

    const deleteLink = (id) => {
        setLinks(prev => prev.filter(l => l.id !== id))
    }

    const copyLink = (id, urlToCopy) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(urlToCopy).catch(() => { })
        } else {
            const el = document.createElement('textarea')
            el.value = urlToCopy
            document.body.appendChild(el)
            el.select()
            try { document.execCommand('copy') } catch (err) { }
            document.body.removeChild(el)
        }
        setCopied(id)
        setTimeout(() => setCopied(null), 1500)
    }

    const usedTags = ['All', ...new Set(links.map(l => l.tag))]

    const filtered = links
        .filter(l => tagFilter === 'All' ? true : l.tag === tagFilter)
        .filter(l =>
            l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.url.toLowerCase().includes(search.toLowerCase()) ||
            l.subject.toLowerCase().includes(search.toLowerCase())
        )

    return (
        <div className="page-container animate-fade-in">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Bóveda de Links</h1>
                    <p className="page-subtitle">{links.length} recursos guardados</p>
                </div>
            </div>

            {!isPro && (
                <div style={{ padding: '0.875rem 1.25rem', background: 'var(--accent-dim)', borderRadius: '12px', border: '1px solid var(--accent-border)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={16} color="var(--accent)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>
                            Has usado <strong style={{ color: 'var(--accent)' }}>{links.length}/10</strong> recursos del Plan Gratis.
                        </span>
                    </div>
                    <button onClick={() => setShowUpgrade(true)} style={{ background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        Hacer Ilimitado
                    </button>
                </div>
            )}

            {/* Add link */}
            <div className="panel-card">
                <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                    Agregar recurso
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <input
                        className="panel-input"
                        style={{ flex: '2 1 200px' }}
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addLink()}
                        placeholder="https://… URL del recurso"
                    />
                    <input
                        className="panel-input"
                        style={{ flex: '2 1 160px' }}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Título (opcional)"
                    />
                    {subjects.length > 0 ? (
                        <select
                            className="panel-select"
                            style={{ flex: '1 1 150px' }}
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                        >
                            <option value="">— Sin materia —</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    ) : (
                        <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', background: 'var(--bg-hover)', borderRadius: '10px', border: '1px dashed var(--border-default)', fontSize: '12px', color: 'var(--text-4)', fontWeight: 600 }}>
                            <BookOpen size={14} />
                            <span>Crea materias en Calculadora</span>
                        </div>
                    )}
                    <select className="panel-select" value={tag} onChange={e => setTag(e.target.value)}>
                        {TAGS.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <button className="btn-primary-sm" onClick={addLink}>
                        <Plus size={15} /> Guardar
                    </button>
                </div>
            </div>

            {/* Search + Tag filter */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-box" style={{ flex: 1, minWidth: '200px' }}>
                    <Search size={14} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                    <input
                        className="search-input"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar recursos…"
                        style={{ color: 'var(--text-1)' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {usedTags.map(t => (
                        <button
                            key={t}
                            className={`filter-chip ${tagFilter === t ? 'active' : ''}`}
                            onClick={() => setTagFilter(t)}
                            style={{ fontSize: '0.6875rem' }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Links grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.875rem' }}>
                {filtered.length === 0 && (
                    <div className="panel-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-4)' }}>
                        <Link2 size={40} style={{ marginBottom: '1rem', opacity: 0.25 }} />
                        <p style={{ fontSize: '1rem', fontWeight: 500 }}>{links.length === 0 ? 'Guarda tu primer recurso arriba.' : 'Sin resultados para esta búsqueda.'}</p>
                    </div>
                )}
                {filtered.map(link => (
                    <div key={link.id} className="panel-card link-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '1rem', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {link.title}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {link.domain || link.url}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                                <button
                                    className="icon-action-btn"
                                    onClick={() => copyLink(link.id, link.url)}
                                    title="Copiar URL"
                                >
                                    {copied === link.id ? <Check size={14} color="var(--green)" /> : <Copy size={14} />}
                                </button>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="icon-action-btn accent" title="Abrir enlace">
                                    <ExternalLink size={14} />
                                </a>
                                <button className="icon-action-btn danger" onClick={() => deleteLink(link.id)} title="Eliminar">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{
                                fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                                background: 'var(--accent-dim)', color: 'var(--accent)',
                                border: '1px solid var(--accent-border)',
                            }}>
                                {link.tag}
                            </span>
                            {link.subject && (
                                <span style={{
                                    fontSize: '0.6875rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                                    background: 'var(--bg-hover)', color: 'var(--text-3)',
                                    border: '1px solid var(--border-subtle)',
                                }}>
                                    {link.subject}
                                </span>
                            )}
                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-4)', fontWeight: 500, marginLeft: 'auto' }}>
                                {new Date(link.createdAt).toLocaleDateString('es-ES')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
