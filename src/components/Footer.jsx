import { useState } from 'react'
import { BookOpen, Coffee, Heart, FileText, Shield, Zap } from 'lucide-react'
import ProUpgradeModal from '../ProUpgradeModal'

const LAST_UPDATE = '03 Mar 2026'

export default function Footer() {
    const [showPro, setShowPro] = useState(false)

    const navigate = (hash) => {
        window.location.hash = hash
        window.dispatchEvent(new Event('hashchange'))
    }

    return (
        <>
            {showPro && <ProUpgradeModal onClose={() => setShowPro(false)} />}
            <footer style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-subtle)', padding: '4rem 1.5rem 2rem', marginTop: 'auto' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
                        {/* Area Principal */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ maxWidth: '320px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px var(--accent-dim)' }}>
                                        <BookOpen size={16} color="white" strokeWidth={2.5} />
                                    </div>
                                    <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-1)', letterSpacing: '-0.03em' }}>StudyNeo</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                                    Tu oficina de estudio portátil. Sin distracciones, con todas las herramientas que necesitas para alcanzar tus metas académicas.
                                </p>
                                <button onClick={() => setShowPro(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)', padding: '0.625rem 1.25rem', borderRadius: '10px', fontSize: '0.8125rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <Zap size={14} /> Desbloquear Pro
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>Navegación</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                        <button onClick={() => navigate('')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', padding: 0, textAlign: 'left', transition: 'color 0.2s' }}>Inicio</button>
                                        <button onClick={() => navigate('#auth')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', padding: 0, textAlign: 'left', transition: 'color 0.2s' }}>Entrar</button>
                                        <button onClick={() => navigate('#soporte')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', padding: 0, textAlign: 'left', transition: 'color 0.2s' }}>Soporte</button>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>Legal</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                        <button onClick={() => navigate('#terminos')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', padding: 0, textAlign: 'left', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FileText size={14} /> Términos
                                        </button>
                                        <button onClick={() => navigate('#privacidad')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', padding: 0, textAlign: 'left', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Shield size={14} /> Privacidad
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-4)', fontSize: '0.75rem' }}>
                            <span>Hecho con <Heart size={12} color="var(--red)" style={{ display: 'inline', verticalAlign: '-2px' }} /> por <strong><a href="https://github.com/Neosowo" target="_blank" rel="noopener noreferrer">Erick</a></strong></span>
                            <span style={{ width: '4px', height: '4px', background: 'var(--border-subtle)', borderRadius: '50%' }}></span>
                            <span>© {new Date().getFullYear()} StudyNeo</span>
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-4)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                            Última actualización: {LAST_UPDATE}
                        </div>
                    </div>

                </div>
            </footer>
        </>
    )
}
