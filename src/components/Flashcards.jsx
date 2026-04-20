import { useState, useEffect } from 'react'
import { Brain, Plus, ChevronRight, ChevronLeft, X, Trash2 } from 'lucide-react'
import { storage, KEYS } from '../utils/storage'

let idCounter = Date.now()

const SEED = [
  { id: idCounter++, q: '¿Cuál es el propósito del Pomodoro?', a: 'Mejorar la concentración y evitar el cansancio mental mediante pausas regulares.' },
  { id: idCounter++, q: '¿Qué significa procrastinar?', a: 'La acción de retrasar o posponer actividades o situaciones que deben atenderse.' }
]

export default function Flashcards({ onToast }) {
  const [cards, setCards] = useState(() => storage.get(KEYS.FLASHCARDS || 'postpone_flashcards', SEED))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [qInput, setQInput] = useState('')
  const [aInput, setAInput] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => { storage.set(KEYS.FLASHCARDS || 'postpone_flashcards', cards) }, [cards])

  const next = () => { 
    setFlipped(false)
    setTimeout(() => setIndex(i => (i + 1) % cards.length), 150) 
  }
  const prev = () => { 
    setFlipped(false)
    setTimeout(() => setIndex(i => (i - 1 + cards.length) % cards.length), 150) 
  }

  const addCard = () => {
    if(!qInput.trim() || !aInput.trim()) return
    setCards(c => [...c, { id: Date.now(), q: qInput, a: aInput }])
    setQInput(''); setAInput(''); setIsAdding(false)
    onToast?.('Tarjeta creada', 'success')
  }

  const deleteCard = (id) => {
    setCards(c => c.filter(x => x.id !== id))
    if(index >= cards.length - 1) setIndex(Math.max(0, cards.length - 2))
    onToast?.('Tarjeta eliminada', 'info')
  }

  // Ensure index is within bounds if cards array changes
  const currentIndex = Math.min(index, Math.max(0, cards.length - 1))

  return (
    <div className="flashcard-section">
      <div className="todo-card">
        <div className="todo-header" style={{ marginBottom: 12 }}>
           <div className="todo-header-left">
             <span className="todo-title" style={{ display: 'flex', alignItems: 'center' }}>
               <Brain size={18} style={{ marginRight: 8, color: 'var(--blue)' }}/> Tarjetas de Estudio
             </span>
           </div>
           <button className="todo-add-btn" onClick={() => setIsAdding(!isAdding)} title="Añadir tarjeta">
             {isAdding ? <X size={18}/> : <Plus size={18}/>}
           </button>
        </div>

        {isAdding && (
          <div className="flashcard-add-form animate-slide-down">
            <input className="todo-add-input" placeholder="Pregunta (Frente)..." value={qInput} onChange={e=>setQInput(e.target.value)} />
            <input className="todo-add-input" placeholder="Respuesta (Reverso)..." value={aInput} onChange={e=>setAInput(e.target.value)} style={{marginTop:8}}/>
            <button className="nav-settings-apply" style={{marginTop:12, width: '100%'}} onClick={addCard}>Guardar Tarjeta</button>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="todo-empty">
             <div className="todo-empty-icon"><Brain size={24} color="var(--text-4)"/></div>
             <p className="todo-empty-text">No hay tarjetas. ¡Crea una!</p>
          </div>
        ) : (
          <div className="flashcard-viewer">
             <div className="flashcard-progress">{currentIndex + 1} / {cards.length}</div>
             
             <div className={`flashcard-item ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
                <div className="flashcard-inner">
                   <div className="flashcard-front">
                      <p>{cards[currentIndex].q}</p>
                      <span className="flashcard-hint">Toca para voltear</span>
                   </div>
                   <div className="flashcard-back">
                      <p>{cards[currentIndex].a}</p>
                   </div>
                </div>
             </div>
             
             <div className="flashcard-controls">
                <button className="ctrl-btn-secondary" onClick={prev}><ChevronLeft size={20}/></button>
                <button className="ctrl-btn-secondary" onClick={() => deleteCard(cards[currentIndex].id)} style={{color:'var(--red)'}} title="Eliminar"><Trash2 size={16}/></button>
                <button className="ctrl-btn-secondary" onClick={next}><ChevronRight size={20}/></button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
