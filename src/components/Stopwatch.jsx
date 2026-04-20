import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, RotateCcw, XCircle, Square, ArrowRight, Clock, Zap, AlertTriangle, BarChart3 } from 'lucide-react'
import { playStart, playPause, playComplete, playClick } from '../utils/sounds'

const STORAGE_KEY = 'studyneo_study_v2'

const STATES = { IDLE: 'idle', WORKING: 'working', DISTRACTED: 'distracted' }

const DISTRACT_MESSAGES = [
  'Cada segundo aquí es un segundo que no avanzas.',
  '¿Cuánto tiempo más?',
]

const fmt = (totalSeconds) => {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600).toString().padStart(2, '0')
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
}

const fmtTime = (ts) => {
  const d = new Date(ts)
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const getTodayKey = () => new Date().toISOString().slice(0, 10)

const calcEfficiency = (work, lost) => {
  const total = work + lost
  if (total < 1) return null
  return Math.round((work / total) * 100)
}

export default function Stopwatch({ isZen }) {
  const [state, setState]            = useState(STATES.IDLE)
  const [blockStart, setBlockStart]  = useState(null)
  const [workSecs, setWorkSecs]      = useState(0)
  const [lostSecs, setLostSecs]      = useState(0)
  const [interruptions, setInterruptions] = useState(0)
  const [blockElapsed, setBlockElapsed]   = useState(0)
  const [history, setHistory]        = useState([])
  const [distractMsg, setDistractMsg]= useState(DISTRACT_MESSAGES[0])

  const distractIdx = useRef(0)
  const distractInterval = useRef(null)
  const tickRef = useRef(null)

  /* ── Load from localStorage ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      if (data.date !== getTodayKey()) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      setWorkSecs(data.workSeconds ?? 0)
      setLostSecs(data.lostSeconds ?? 0)
      setInterruptions(data.interruptions ?? 0)
      setHistory(data.history ?? [])
      if (data.currentState && data.currentState !== STATES.IDLE && data.blockStart) {
        setState(data.currentState)
        setBlockStart(data.blockStart)
      }
    } catch { /* ignore */ }
  }, [])

  /* ── Save to localStorage ── */
  const save = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: getTodayKey(),
        workSeconds: workSecs,
        lostSeconds: lostSecs,
        interruptions,
        currentState: state,
        blockStart,
        history,
      }))
    } catch { /* ignore */ }
  }, [workSecs, lostSecs, interruptions, state, blockStart, history])

  useEffect(() => { save() }, [save])

  /* ── Master tick ── */
  useEffect(() => {
    if (state === STATES.IDLE) {
      setBlockElapsed(0)
      return
    }
    const tick = () => {
      if (blockStart) {
        setBlockElapsed(Math.floor((Date.now() - blockStart) / 1000))
      }
    }
    tick()
    tickRef.current = setInterval(tick, 1000)
    return () => clearInterval(tickRef.current)
  }, [state, blockStart])

  /* ── Distraction message rotation ── */
  useEffect(() => {
    if (state !== STATES.DISTRACTED) {
      if (distractInterval.current) clearInterval(distractInterval.current)
      return
    }
    distractIdx.current = Math.floor(Math.random() * DISTRACT_MESSAGES.length)
    setDistractMsg(DISTRACT_MESSAGES[distractIdx.current])
    distractInterval.current = setInterval(() => {
      distractIdx.current = (distractIdx.current + 1) % DISTRACT_MESSAGES.length
      setDistractMsg(DISTRACT_MESSAGES[distractIdx.current])
    }, 5000)
    return () => clearInterval(distractInterval.current)
  }, [state])

  /* ── Commit current block ── */
  const commitBlock = useCallback(() => {
    if (!blockStart) return
    const elapsed = Math.floor((Date.now() - blockStart) / 1000)
    if (elapsed < 1) return
    const type = state === STATES.WORKING ? 'work' : 'distract'
    if (state === STATES.WORKING) {
      setWorkSecs(prev => prev + elapsed)
    } else if (state === STATES.DISTRACTED) {
      setLostSecs(prev => prev + elapsed)
    }
    setHistory(prev => [{
      type,
      duration: elapsed,
      startTime: blockStart,
      id: Date.now()
    }, ...prev])
  }, [blockStart, state])

  /* ── Actions ── */
  const handleStart = () => {
    setState(STATES.WORKING)
    setBlockStart(Date.now())
    setBlockElapsed(0)
    playStart()
  }

  const handleLostFocus = () => {
    commitBlock()
    setInterruptions(prev => prev + 1)
    setState(STATES.DISTRACTED)
    setBlockStart(Date.now())
    setBlockElapsed(0)
    playPause()
  }

  const handleResume = () => {
    commitBlock()
    setState(STATES.WORKING)
    setBlockStart(Date.now())
    setBlockElapsed(0)
    playStart()
  }

  const handleEnd = () => {
    commitBlock()
    setState(STATES.IDLE)
    setBlockStart(null)
    setBlockElapsed(0)
    playComplete()
  }

  const handleReset = () => {
    if (!confirm('¿Reiniciar todas las estadísticas del día?')) return
    setState(STATES.IDLE)
    setBlockStart(null)
    setBlockElapsed(0)
    setWorkSecs(0)
    setLostSecs(0)
    setInterruptions(0)
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  /* ── Computed ── */
  const totalWork = workSecs + (state === STATES.WORKING ? blockElapsed : 0)
  const totalLost = lostSecs + (state === STATES.DISTRACTED ? blockElapsed : 0)
  const efficiency = calcEfficiency(totalWork, totalLost)

  return (
    <div className="sw-container">

      {/* ── IDLE State ── */}
      {state === STATES.IDLE && (
        <div className="sw-state-panel sw-idle animate-fade">
          <div className="study-clock-wrap">
            <div className="study-clock">{fmt(totalWork)}</div>
            <div className="study-clock-label">Sesión de estudio</div>
          </div>

          {/* Stats */}
          {!isZen && (totalWork > 0 || totalLost > 0) && (
            <div className="sw-stats-grid">
              <div className="sw-stat">
                <Clock size={14} />
                <span className="sw-stat-label">Trabajo</span>
                <span className="sw-stat-value">{fmt(totalWork)}</span>
              </div>
              <div className="sw-stat">
                <AlertTriangle size={14} />
                <span className="sw-stat-label">Perdido</span>
                <span className="sw-stat-value sw-lost">{fmt(totalLost)}</span>
              </div>
              <div className="sw-stat">
                <Zap size={14} />
                <span className="sw-stat-label">Eficiencia</span>
                <span className="sw-stat-value">{efficiency !== null ? `${efficiency}%` : '—'}</span>
              </div>
              <div className="sw-stat">
                <XCircle size={14} />
                <span className="sw-stat-label">Interrupciones</span>
                <span className="sw-stat-value sw-lost">{interruptions}</span>
              </div>
            </div>
          )}

          {!isZen && efficiency !== null && (
            <div className="sw-efficiency-bar-wrap">
              <div className="sw-efficiency-bar" style={{ width: `${efficiency}%` }} />
            </div>
          )}

          <div className="sw-actions">
            <button className="sw-btn sw-btn-start" onClick={handleStart}>
              <Play size={20} /> Iniciar sesión
            </button>
            {(totalWork > 0 || totalLost > 0) && (
              <button className="sw-btn sw-btn-reset" onClick={handleReset}>
                <RotateCcw size={14} /> Reiniciar
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── WORKING State ── */}
      {state === STATES.WORKING && (
        <div className="sw-state-panel sw-working animate-fade">
          <div className="sw-state-badge sw-badge-working">
            <div className="sw-badge-dot working" /> Trabajando
          </div>
          <div className="study-clock-wrap">
            <div className="study-clock">{fmt(blockElapsed)}</div>
            <div className="study-clock-label">Bloque actual de foco</div>
          </div>

          {!isZen && (
            <div className="sw-mini-stats">
              <span>Total: {fmt(totalWork)}</span>
              <span>Interrupciones: {interruptions}</span>
            </div>
          )}

          <div className="sw-actions">
            <button className="sw-btn sw-btn-focus" onClick={handleLostFocus}>
              <XCircle size={18} /> Perdí el foco
            </button>
            <button className="sw-btn sw-btn-end" onClick={handleEnd}>
              <Square size={16} /> Terminar sesión
            </button>
          </div>
        </div>
      )}

      {/* ── DISTRACTED State ── */}
      {state === STATES.DISTRACTED && (
        <div className="sw-state-panel sw-distracted animate-fade">
          <div className="sw-state-badge sw-badge-distracted">
            <div className="sw-badge-dot distracted" /> Sin foco
          </div>
          <div className="study-clock-wrap">
            <div className="study-clock sw-clock-red">{fmt(blockElapsed)}</div>
            <div className="study-clock-label sw-label-red">{distractMsg}</div>
          </div>

          <div className="sw-actions">
            <button className="sw-btn sw-btn-resume" onClick={handleResume}>
              <ArrowRight size={18} /> Volver al trabajo
            </button>
            <button className="sw-btn sw-btn-end" onClick={handleEnd}>
              <Square size={16} /> Terminar sesión
            </button>
          </div>
        </div>
      )}

      {/* ── History ── */}
      {!isZen && history.length > 0 && (
        <div className="sw-history">
          <div className="sw-history-title"><BarChart3 size={14} /> Historial</div>
          <div className="sw-history-list">
            {history.map(h => (
              <div key={h.id} className={`sw-history-item ${h.type}`}>
                <div className={`sw-history-dot ${h.type}`} />
                <span className="sw-history-type">
                  {h.type === 'work' ? 'Foco' : 'Distracción'}
                </span>
                <span className="sw-history-time">{fmtTime(h.startTime)}</span>
                <span className={`sw-history-duration ${h.type}`}>{fmt(h.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
