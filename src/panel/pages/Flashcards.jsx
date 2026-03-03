import { useState } from 'react'
import { Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Check, X, Brain, Zap, PartyPopper, Volume2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'

function FlipCard({ card, onResult, onFlip }) {
    const [flipped, setFlipped] = useState(false)

    const handleFlip = () => {
        setFlipped(f => !f)
        if (onFlip) onFlip()
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '560px', margin: '0 auto' }}>
            <div
                className={`flip-card ${flipped ? 'flipped' : ''}`}
                onClick={handleFlip}
            >
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <p style={{ fontSize: '0.6875rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.5rem' }}>Pregunta</p>
                        <p style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-1)', textAlign: 'center', lineHeight: 1.4 }}>{card.front}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', marginTop: '2.5rem' }}>Toca para revelar</p>
                    </div>
                    <div className="flip-card-back">
                        <p style={{ fontSize: '0.6875rem', color: 'var(--green)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.5rem' }}>Respuesta</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', textAlign: 'center', lineHeight: 1.5 }}>{card.back}</p>
                    </div>
                </div>
            </div>

            {flipped && (
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <button className="fc-result-btn fail" onClick={() => { setFlipped(false); onResult('fail') }}>
                        <X size={18} /> No lo sabía
                    </button>
                    <button className="fc-result-btn pass" onClick={() => { setFlipped(false); onResult('pass') }}>
                        <Check size={18} /> Lo sabía
                    </button>
                </div>
            )}
        </div>
    )
}

export default function Flashcards() {
    const [decks, setDecks] = useLocalStorage('sd_flashcard_decks', [])
    const [soundEnabled] = useLocalStorage('sd_sound_enabled', true)
    const { isPro } = useProContext()
    const [showUpgrade, setShowUpgrade] = useState(false)

    const playSound = (url) => {
        if (!soundEnabled) return
        const a = new Audio(url)
        a.volume = 0.4
        a.play().catch(() => { })
    }

    const AUDIO = {
        flip: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
        done: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'
    }
    const [activeDeck, setActiveDeck] = useState(null)
    const [studyMode, setStudyMode] = useState(false)
    const [studyIndex, setStudyIndex] = useState(0)
    const [studyCards, setStudyCards] = useState([])
    const [passed, setPassed] = useState(0)
    const [failed, setFailed] = useState(0)

    // For adding new deck
    const [newDeckName, setNewDeckName] = useState('')
    // For adding card to deck
    const [cardFront, setCardFront] = useState('')
    const [cardBack, setCardBack] = useState('')

    const deck = decks.find(d => d.id === activeDeck)

    const createDeck = () => {
        if (!newDeckName.trim()) return
        const d = { id: Date.now(), name: newDeckName.trim(), cards: [] }
        setDecks(prev => [...prev, d])
        setNewDeckName('')
        setActiveDeck(d.id)
    }

    const totalCards = decks.reduce((acc, d) => acc + d.cards.length, 0)

    const addCard = () => {
        if (!isPro && totalCards >= 10) {
            setShowUpgrade(true)
            return
        }
        if (!cardFront.trim() || !cardBack.trim()) return
        setDecks(prev => prev.map(d =>
            d.id === activeDeck
                ? { ...d, cards: [...d.cards, { id: Date.now(), front: cardFront.trim(), back: cardBack.trim() }] }
                : d
        ))
        setCardFront('')
        setCardBack('')
    }

    const deleteCard = (cardId) => {
        setDecks(prev => prev.map(d =>
            d.id === activeDeck ? { ...d, cards: d.cards.filter(c => c.id !== cardId) } : d
        ))
    }

    const deleteDeck = (deckId) => {
        setDecks(prev => prev.filter(d => d.id !== deckId))
        if (activeDeck === deckId) setActiveDeck(null)
    }

    const startStudy = () => {
        if (!deck || deck.cards.length === 0) return
        setStudyCards([...deck.cards].sort(() => Math.random() - 0.5))
        setStudyIndex(0)
        setPassed(0)
        setFailed(0)
        setStudyMode(true)
    }

    const handleResult = (result) => {
        if (result === 'pass') setPassed(p => p + 1)
        else setFailed(f => f + 1)
        if (studyIndex + 1 >= studyCards.length) {
            playSound(AUDIO.done)
            setStudyMode('done')
        } else {
            setStudyIndex(i => i + 1)
        }
    }

    if (studyMode === 'done') {
        return (
            <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
                <PartyPopper size={72} color="var(--accent)" />
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-1)' }}>¡Sesión completada!</h2>
                <div style={{ display: 'flex', gap: '2.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--green)' }}>{passed}</p>
                        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', fontWeight: 600 }}>Correctas</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--red)' }}>{failed}</p>
                        <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', fontWeight: 600 }}>A repasar</p>
                    </div>
                </div>
                <button className="btn-primary-sm" onClick={() => setStudyMode(false)}>
                    <RotateCcw size={14} /> Volver al deck
                </button>
            </div>
        )
    }

    if (studyMode === true) {
        const card = studyCards[studyIndex]
        return (
            <div className="page-container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <button className="icon-action-btn" onClick={() => setStudyMode(false)}>
                        <ChevronLeft size={16} /> Salir
                    </button>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-3)' }}>
                        {studyIndex + 1} / {studyCards.length}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <FlipCard
                        key={card.id}
                        card={card}
                        onResult={handleResult}
                        onFlip={() => playSound(AUDIO.flip)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="page-container">
            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Flashcards</h1>
                    <p className="page-subtitle">Sistema de repetición espaciada</p>
                </div>
            </div>

            {!isPro && (
                <div style={{ padding: '0.875rem 1.25rem', background: 'var(--accent-dim)', borderRadius: '12px', border: '1px solid var(--accent-border)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={16} color="var(--accent)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>
                            Has usado <strong style={{ color: 'var(--accent)' }}>{totalCards}/10</strong> flashcards del Plan Gratis.
                        </span>
                    </div>
                    <button onClick={() => setShowUpgrade(true)} style={{ background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        Bóveda Ilimitada
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* Deck list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="panel-card" style={{ padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>
                            Nuevo mazo
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                value={newDeckName}
                                onChange={e => setNewDeckName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && createDeck()}
                                placeholder="Nombre del mazo"
                                className="panel-input"
                                style={{ flex: 1 }}
                            />
                            <button className="icon-action-btn accent" onClick={createDeck}><Plus size={16} /></button>
                        </div>
                    </div>

                    {decks.map(d => (
                        <div
                            key={d.id}
                            className={`deck-item ${activeDeck === d.id ? 'active' : ''}`}
                            onClick={() => setActiveDeck(d.id)}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{d.cards.length} tarjetas</p>
                            </div>
                            <button className="icon-action-btn danger" onClick={e => { e.stopPropagation(); deleteDeck(d.id) }}>
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))}

                    {decks.length === 0 && (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', textAlign: 'center', padding: '1rem' }}>
                            Crea tu primer mazo
                        </p>
                    )}
                </div>

                {/* Deck content */}
                {deck ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="panel-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontWeight: 900, color: 'var(--text-1)', fontSize: '1.25rem', letterSpacing: '-0.02em' }}>{deck.name}</h2>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>{deck.cards.length} tarjetas guardadas</p>
                                </div>
                                <button className="btn-primary-sm" onClick={startStudy} disabled={deck.cards.length === 0}>
                                    <Brain size={14} /> Estudiar
                                </button>
                            </div>

                            {/* Add card form */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.875rem', marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                                <input
                                    value={cardFront}
                                    onChange={e => setCardFront(e.target.value)}
                                    placeholder="Pregunta / frente"
                                    className="panel-input"
                                />
                                <input
                                    value={cardBack}
                                    onChange={e => setCardBack(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addCard()}
                                    placeholder="Respuesta / dorso"
                                    className="panel-input"
                                />
                                <button className="icon-action-btn accent" onClick={addCard}><Plus size={16} /></button>
                            </div>

                            {/* Cards list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {deck.cards.map(card => (
                                    <div key={card.id} className="fc-card-row">
                                        <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500 }}>{card.front}</span>
                                        <span style={{ color: 'var(--text-4)', fontSize: '0.875rem' }}>→</span>
                                        <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 600 }}>{card.back}</span>
                                        <button className="icon-action-btn danger" onClick={() => deleteCard(card.id)}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                                {deck.cards.length === 0 && (
                                    <p style={{ textAlign: 'center', color: 'var(--text-4)', fontSize: '0.875rem', padding: '2rem' }}>
                                        Agrega la primera tarjeta arriba
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-4)' }}>
                        <Brain size={48} style={{ marginBottom: '1.25rem', opacity: 0.25 }} />
                        <p style={{ fontSize: '1rem', fontWeight: 500 }}>Selecciona o crea un mazo para empezar</p>
                    </div>
                )}
            </div>
        </div>
    )
}
