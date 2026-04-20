import { useState, useEffect } from 'react'
import { db, ref, onValue, push, serverTimestamp } from '../utils/firebase'
import { MessageSquare, Send, AlertTriangle, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { getT } from '../locales'

const BAD_WORDS = ['puta', 'mierda', 'coño', 'joder', 'cabron', 'pendejo', 'verga', 'puto', 'zorra', 'imbecil', 'idiota', 'estupido']

export default function FeedbackForum({ onBack, lang = 'es' }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [msgLimit, setMsgLimit] = useState(0)
  const [agreed, setAgreed] = useState(false)

  const t = getT(lang)
  const MAX_PER_DAY = 1

  useEffect(() => {
    // 1. Load limits from local storage
    const todayStr = new Date().toISOString().slice(0,10)
    const stored = JSON.parse(localStorage.getItem('studyneo_forum_limit') || '{}')
    if (stored.date !== todayStr) {
      setMsgLimit(0)
      localStorage.setItem('studyneo_forum_limit', JSON.stringify({ date: todayStr, count: 0 }))
    } else {
      setMsgLimit(stored.count || 0)
    }

    // 2. Load messages
    if (!db) {
      const localMsgs = JSON.parse(localStorage.getItem('studyneo_mock_forum') || '[]')
      setMessages(localMsgs)
      return
    }

    const forumRef = ref(db, 'studyneo/forum_posts')
    const unsub = onValue(forumRef, snap => {
      const data = snap.val()
      if (data) {
        const arr = Object.values(data).sort((a,b) => b.timestamp - a.timestamp)
        setMessages(arr.slice(0, 50)) // limit to 50
      } else {
        setMessages([])
      }
    })
    return () => unsub()
  }, [])

  const containsBadWords = (str) => {
    const normalized = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return BAD_WORDS.some(word => normalized.includes(word))
  }

  const handlePost = () => {
    if (!text.trim()) return
    
    // Aggressive Restrictions
    if (/(http|https|www\.|ftp|:\/\/)|\.(com|net|org|co|us|io|dev|app|me)/i.test(text)) {
      setError('Está prohibido publicar enlaces, sitios web o correos por seguridad.')
      return
    }
    if (containsBadWords(text)) {
      setError('Por favor, mantén un lenguaje respetuoso. No se permiten malas palabras.')
      return
    }
    if (text.length > 500) {
      setError('El mensaje es muy largo (máximo 500 caracteres).')
      return
    }
    if (msgLimit >= MAX_PER_DAY) {
      setError('Límite diario alcanzado. Has publicado ' + MAX_PER_DAY + ' de ' + MAX_PER_DAY + ' mensajes hoy. ¡Vuelve mañana!')
      return
    }
    if (!agreed) {
      setError('Debes aceptar las reglas del foro antes de publicar.')
      return
    }

    const newMsg = {
      text: text.trim(),
      timestamp: Date.now(),
      serverTime: db ? serverTimestamp() : Date.now(),
      id: Math.random().toString(36).substring(2, 9)
    }

    if (db) {
      push(ref(db, 'studyneo/forum_posts'), newMsg)
    } else {
      const msgs = [newMsg, ...messages].slice(0,50)
      setMessages(msgs)
      localStorage.setItem('studyneo_mock_forum', JSON.stringify(msgs))
    }

    // Update Limits
    const newCount = msgLimit + 1
    localStorage.setItem('studyneo_forum_limit', JSON.stringify({ date: new Date().toISOString().slice(0,10), count: newCount }))
    setMsgLimit(newCount)
    setText('')
    setError('')
  }

  return (
    <div className="forum-page animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', padding: '0 20px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-1)' }}>Foro Comunitario</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-3)' }}>Buzón oficial de sugerencias de StudyNeo</p>
        </div>
      </div>

      <div className="todo-card" style={{ padding: '20px', margin: '0 20px 30px', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '16px' }}>
        
        {/* Rules Box */}
        <div style={{ background: 'var(--bg-hover)', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-3)' }}>
          <strong style={{ color: 'var(--text-1)', display: 'block', marginBottom: '6px' }}>Reglas de este espacio:</strong>
          <ul style={{ paddingLeft: '20px', margin: '0' }}>
            <li>No se permiten insultos o groserías.</li>
            <li>Prohibido pegar links web o promociones (por seguridad y evitar spam).</li>
            <li>Límite estricto de <strong>{MAX_PER_DAY}</strong> mensajes por usuario al día.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              className="espol-textarea"
              placeholder="Escribe tu sugerencia, idea o queja aquí..."
              value={text}
              onChange={e => { setText(e.target.value); setError('') }}
              style={{ width: '100%', minHeight: '110px', fontSize: '14px', resize: 'vertical', padding: '12px', borderRadius: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
              disabled={msgLimit >= MAX_PER_DAY}
            />
            <span style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '11px', color: text.length > 500 ? 'var(--red)' : 'var(--text-4)' }}>
              {text.length}/500
            </span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-2)', cursor: 'pointer', paddingLeft: '4px' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
            Entiendo las reglas y acepto los términos.
          </label>

          {error && (
            <div className="animate-shake" style={{ background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--red)', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', display: 'flex', gap: '8px', alignItems:'center' }}>
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: msgLimit >= MAX_PER_DAY ? 'var(--red)' : 'var(--text-3)', fontWeight: '600' }}>
              Límite diario: {msgLimit} / {MAX_PER_DAY}
            </span>
            <button
              onClick={handlePost}
              disabled={msgLimit >= MAX_PER_DAY || !text.trim()}
              className="espol-btn-add"
              style={{ maxWidth: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '10px 16px', background: msgLimit >= MAX_PER_DAY ? 'var(--bg-input)' : 'var(--accent)', color: msgLimit >= MAX_PER_DAY ? 'var(--text-4)' : '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: msgLimit >= MAX_PER_DAY ? 'not-allowed' : 'pointer' }}
            >
              <Send size={15} /> Publicar
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-4)', fontSize: '14px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px dashed var(--border-default)' }}>
            <MessageSquare size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            No hay sugerencias aún.<br/>¡Sé el primero en aportar una idea!
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="animate-slide-down" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', padding: '18px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-4)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: 'var(--text-2)' }}>
                  <div style={{ width: 24, height: 24, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px' }}>U</div>
                  Usuario Anónimo
                </span>
                <span style={{ background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '6px' }}>
                  {new Date(msg.timestamp).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '14.5px', color: 'var(--text-1)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
