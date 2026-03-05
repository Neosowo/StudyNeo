import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, CloudRain, Coffee, Wind, TreePine, Radio, Waves, Zap } from 'lucide-react'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'

const SOUNDS = [
    { id: 'rain', name: 'Lluvia Intensa', icon: CloudRain, color: '#60a5fa', url: 'https://assets.mixkit.co/active_storage/sfx/2592/2592-preview.mp3' }, // Rain loop substitute
    { id: 'cafe', name: 'Ambiente Café', icon: Coffee, color: '#f59e0b', url: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3' }, // Cafe/Chatter sub
    { id: 'forest', name: 'Bosque Profundo', icon: TreePine, color: '#10b981', url: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3' }, // Forest/Birds sub
    { id: 'waves', name: 'Olas del Mar', icon: Waves, color: '#3b82f6', url: 'https://assets.mixkit.co/active_storage/sfx/2565/2565-preview.mp3' }, // Waves sub
    { id: 'lofi', name: 'Deep Focus (Pro)', icon: Radio, color: '#a855f7', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', premium: true },
]

export default function FocusSounds() {
    const { isPro } = useProContext()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [playing, setPlaying] = useState(null)
    const [volume, setVolume] = useState(0.5)
    const audioRef = useRef(null)

    const toggleSound = (sound) => {
        if (sound.premium && !isPro) {
            setShowUpgrade(true)
            return
        }

        if (playing === sound.id) {
            audioRef.current.pause()
            setPlaying(null)
        } else {
            if (audioRef.current) audioRef.current.pause()
            audioRef.current = new Audio(sound.url)
            audioRef.current.loop = true
            audioRef.current.volume = volume
            audioRef.current.play().catch(e => console.error("Audio error:", e))
            setPlaying(sound.id)
        }
    }

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume
    }, [volume])

    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause()
        }
    }, [])

    return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}

            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="page-title">Sonidos de Enfoque</h1>
                    <p className="page-subtitle">Personaliza tu atmósfera de estudio ideal</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '10px 18px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                    <Volume2 size={16} color="var(--text-3)" />
                    <input
                        type="range"
                        min="0" max="1" step="0.01"
                        value={volume}
                        onChange={e => setVolume(parseFloat(e.target.value))}
                        style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {SOUNDS.map(s => {
                    const Icon = s.icon
                    const isActive = playing === s.id
                    return (
                        <div key={s.id} onClick={() => toggleSound(s)} className={`panel-card sound-card ${isActive ? 'active' : ''}`} style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: isActive ? `2px solid ${s.color}` : '1.5px solid var(--border-subtle)',
                            background: isActive ? `color-mix(in srgb, ${s.color} 8%, var(--bg-surface))` : 'var(--bg-surface)',
                            display: 'flex', alignItems: 'center', gap: '20px', padding: '1.5rem'
                        }}>
                            <div style={{ padding: '15px', borderRadius: '18px', background: isActive ? s.color : 'var(--bg-hover)', color: isActive ? 'white' : s.color, transition: 'all 0.3s' }}>
                                <Icon size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>{s.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {s.premium && <Zap size={10} color="var(--accent)" fill="var(--accent)" />}
                                    <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {isActive ? 'Reproduciendo' : s.premium ? 'Premium' : 'Gratis'}
                                    </span>
                                </div>
                            </div>
                            {isActive ? <Pause size={20} color={s.color} /> : <Play size={20} color="var(--text-4)" />}
                        </div>
                    )
                })}
            </div>

            <div className="panel-card" style={{ marginTop: '3rem', background: 'linear-gradient(135deg, var(--bg-surface), var(--accent-dim))', border: '1px dashed var(--accent-border)', textAlign: 'center', padding: '3rem' }}>
                <Radio size={48} color="var(--accent)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>Mejora tu Mezcla</h2>
                <p style={{ color: 'var(--text-3)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>Muy pronto podrás mezclar múltiples sonidos simultáneamente y ajustar sus intensidades independientes.</p>
            </div>

            <style>{`
                .sound-card:hover { transform: translateY(-4px); border-color: var(--accent-border); box-shadow: var(--shadow-md); }
                .sound-card.active { box-shadow: 0 10px 30px color-mix(in srgb, var(--accent) 15%, transparent); }
            `}</style>
        </div>
    )
}
