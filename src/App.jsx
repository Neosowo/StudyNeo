import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Timer from './components/Timer'
import TodoList from './components/TodoList'
import Notes from './components/Notes'
import { storage, KEYS } from './utils/storage'
import { db, ref, onValue, runTransaction, push, set, onDisconnect } from './utils/firebase'
import { getT } from './locales'
import {
  Sun, Moon, Settings, X, StickyNote, WifiOff, MessageSquare,
  Download, Heart, Github, ExternalLink, CheckCircle2, AlertTriangle, Info, Clock, Upload,
  Shield, ScrollText, MoreHorizontal, Sparkles, Volume2, VolumeX, BookOpen, Mail,
  ListTodo, Calendar as CalendarIcon, Timer as TimerIcon, Layers, Keyboard, Zap
} from 'lucide-react'
import { setMuted } from './utils/sounds'
import { useDevice } from './utils/useDevice'

/* ── Service Worker (ACTIVADO) ──────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        // console.log('SW registrado:', reg)
      })
      .catch(err => {
        // console.log('Error SW:', err)
      })
  })
}

/* ══════════════════════════════════════════════════════════ */
/* INTRO ANIMATION                                            */
/* ══════════════════════════════════════════════════════════ */
function IntroScreen({ onDone }) {
  const container = useRef()
  const logo = useRef()
  const text = useRef()
  const bar = useRef()
  const barFill = useRef()
  const wave = useRef()
  const wave2 = useRef()

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: onDone
    })

    // Initial hidden state
    gsap.set(logo.current, { scale: 0.5, opacity: 0, y: 30, filter: 'blur(15px)' })
    gsap.set(text.current, { opacity: 0, y: 15, filter: 'blur(10px)' })
    gsap.set(bar.current, { opacity: 0, scale: 0.8 })
    gsap.set([wave.current, wave2.current], { scale: 0, opacity: 0, borderRadius: "50%" })

    // 1. Entry Animation
    tl.to(logo.current, { 
      scale: 1, 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      duration: 1.2, 
      ease: "expo.out" 
    })
    tl.to(text.current, { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      duration: 0.8, 
      ease: "power3.out" 
    }, "-=0.8")

    // 2. Progress bar reveal and fill
    tl.to(bar.current, { 
      opacity: 1, 
      scale: 1, 
      duration: 0.6, 
      ease: "back.out(1.7)" 
    }, "-=0.4")
    
    tl.fromTo(barFill.current, 
      { width: "0%" }, 
      { width: "100%", duration: 1.2, ease: "power2.inOut" }
    )

    // 3. THE WAVE / DROP EXPANSION
    tl.addLabel("expand")
    
    // First wave (accent)
    tl.to(wave.current, { opacity: 1, scale: 1, duration: 0.4 }, "expand")
    tl.to(wave.current, { scale: 100, duration: 1.5, ease: "expo.inOut" }, "expand+=0.1")

    // Second wave (slightly delayed, darker/different tone)
    tl.to(wave2.current, { opacity: 0.6, scale: 1, duration: 0.4 }, "expand+=0.15")
    tl.to(wave2.current, { scale: 100, duration: 1.4, ease: "expo.inOut" }, "expand+=0.25")

    // Fade out logo and content
    tl.to([logo.current, text.current, bar.current], {
      opacity: 0,
      y: -30,
      scale: 1.1,
      filter: "blur(30px)",
      duration: 0.7,
      ease: "power2.in"
    }, "expand+=0.2")

    // Final reveal
    tl.to(container.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      backgroundColor: "rgba(6, 6, 8, 0)",
      duration: 1.5,
      ease: "expo.inOut"
    }, "expand+=0.1")

  }, { scope: container })

  return (
    <div className="intro-overlay-gsap" ref={container}>
      <div className="intro-wave-glass" ref={wave} />
      <div className="intro-wave-glass wave-secondary" ref={wave2} />
      
      <div className="intro-content-gsap">
        <img src="./icon.png" alt="StudyNeo" className="intro-logo-img-gsap" ref={logo} />
        <div className="intro-logo-text-gsap" ref={text}>StudyNeo</div>
        <div className="intro-progress-bar-gsap" ref={bar}>
          <div className="intro-progress-fill-gsap" ref={barFill} />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* DAY PROGRESS BAR                                           */
/* ══════════════════════════════════════════════════════════ */
function DayProgressBar() {
  const [pct, setPct] = useState(0)
  const reqRef = useRef()

  useEffect(() => {
    const calc = () => {
      const now  = new Date()
      const secs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + (now.getMilliseconds() / 1000)
      setPct((secs / 86400) * 100)
      reqRef.current = requestAnimationFrame(calc)
    }
    reqRef.current = requestAnimationFrame(calc)
    return () => cancelAnimationFrame(reqRef.current)
  }, [])

  return (
    <div className="day-progress-track" title={`${pct.toFixed(2)}% del día transcurrido`}>
      <div className="day-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* LIKE BUTTON (Firebase)                                     */
/* ══════════════════════════════════════════════════════════ */
function LikeButton() {
  const [likes,     setLikes]     = useState(() => {
    const cached = localStorage.getItem('studyneo_likes_cache')
    return cached !== null ? parseInt(cached) : null
  })
  const [liked,     setLiked]     = useState(() => localStorage.getItem('postpone_liked') === '1')
  const [animating, setAnimating] = useState(false)
  const [bump,      setBump]      = useState(false)
  const prevLikesRef = useRef(null)
  const bumpTimerRef = useRef(null)

  useEffect(() => {
    if (!db) return
    const likesRef = ref(db, 'postpone/likes')
    const unsub = onValue(
      likesRef,
      snap => {
        const val = snap.val() || 0
        setLikes(prev => {
          if (prevLikesRef.current !== null && val !== prevLikesRef.current) {
            clearTimeout(bumpTimerRef.current)
            setBump(true)
            bumpTimerRef.current = setTimeout(() => setBump(false), 500)
          }
          prevLikesRef.current = val
          return val
        })
        localStorage.setItem('studyneo_likes_cache', String(val))
      },
      () => {
        const cached = localStorage.getItem('studyneo_likes_cache')
        if (cached !== null) setLikes(parseInt(cached))
      }
    )
    return () => { unsub(); clearTimeout(bumpTimerRef.current) }
  }, [])

  const handle = () => {
    if (liked) return
    setLiked(true)
    setAnimating(true)
    localStorage.setItem('postpone_liked', '1')
    if (db) runTransaction(ref(db, 'postpone/likes'), cur => (cur || 0) + 1)
    else     setLikes(n => (n || 0) + 1)
    setTimeout(() => setAnimating(false), 700)
  }

  return (
    <button
      className={`like-btn ${liked ? 'liked' : ''} ${animating ? 'pop' : ''} ${bump && !animating ? 'bump' : ''}`}
      onClick={handle}
      title={liked ? 'Te gustó' : 'Dame like'}
    >
      <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
      <span className="like-count">{likes === null ? '—' : likes}</span>
    </button>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* ONLINE USERS MATCHING (Presence)                             */
/* ══════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════ */
/* TOAST (icons, no emojis)                                   */
/* ══════════════════════════════════════════════════════════ */
function Toast({ toasts, onRemove }) {
  const icons = {
    success: <CheckCircle2  size={16} />,
    error:   <AlertTriangle size={16} />,
    info:    <Info          size={16} />,
  }
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => onRemove(t.id)}>
          <div className="toast-icon">{icons[t.type] || icons.info}</div>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* SETTINGS PANEL                                             */
/* ══════════════════════════════════════════════════════════ */
function SettingsPanel({ settings, onSave, onClose, sessions, totalSecs, theme, onThemeChange }) {
  const [local, setLocal] = useState({ ...settings })
  const [activeTab, setActiveTab] = useState('timer')
  const ref2 = useRef(null)

  useEffect(() => {
    const h = e => { if (ref2.current && !ref2.current.contains(e.target)) onClose() }
    const t = setTimeout(() => document.addEventListener('mousedown', h), 10)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h) }
  }, [onClose])

  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }))

  const t = getT(local.lang || 'es')

  const fmtFocus = s => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const save = () => {
    onSave({
      pomodoro:          Math.max(1, Math.min(99,  parseInt(local.pomodoro) || 25)),
      short:             Math.max(1, Math.min(60,  parseInt(local.short)    || 5)),
      long:              Math.max(1, Math.min(60,  parseInt(local.long)     || 15)),
      longBreakInterval: Math.max(1, Math.min(10,  parseInt(local.longBreakInterval) || 4)),
      autoStart: local.autoStart ?? false,
      lang: local.lang || 'es',
      showTodos: local.showTodos ?? true,
      showCards: local.showCards ?? true,
      showCalc:  local.showCalc ?? true,
      showNotes: local.showNotes ?? true,
      showLofi:  local.showLofi ?? true,
      ultraFocus: local.ultraFocus ?? false,
      muteSounds: local.muteSounds ?? false,
    })
    onClose()
  }

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      stats: { sessions, totalFocused: fmtFocus(totalSecs), totalSeconds: totalSecs },
      todos:    storage.get(KEYS.TODOS, []),
      notes:    storage.get(KEYS.NOTES, ''),
      settings: local,
      v: 2
    }
    try {
      const json = JSON.stringify(payload)
      const encoded = btoa(encodeURIComponent(json))
      const checksum = json.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
      const finalStr = `${encoded}.${checksum}`
      const blob = new Blob([finalStr], { type: 'text/plain' })
      const url  = URL.createObjectURL(blob)
      const a    = Object.assign(document.createElement('a'), { href: url, download: `studyneo-backup-${payload.exportedAt.slice(0,10)}.neo` })
      a.click(); URL.revokeObjectURL(url)
    } catch (e) { alert('Error al exportar') }
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      addToast('Archivo demasiado grande (máx. 2 MB)', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const raw = ev.target.result.trim()
        let data;
        if (raw.startsWith('{')) {
          data = JSON.parse(raw)
        } else {
          const dotIdx = raw.lastIndexOf('.')
          if (dotIdx === -1) throw new Error('Formato de archivo inválido')
          const encoded  = raw.slice(0, dotIdx)
          const checksum = raw.slice(dotIdx + 1)
          const json = decodeURIComponent(atob(encoded))
          const currentChecksum = json.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
          if (parseInt(checksum) !== currentChecksum) throw new Error('Archivo corrupto o manipulado')
          data = JSON.parse(json)
        }
        if (typeof data !== 'object' || data === null) throw new Error('Datos inválidos')
        if (data.todos !== undefined) {
          if (!Array.isArray(data.todos)) throw new Error('Campo "todos" inválido')
          if (data.todos.length > 500) throw new Error('Demasiadas tareas en el archivo')
          const sanitizedTodos = data.todos.map(t => ({
            id:       typeof t.id === 'number' ? t.id : Date.now(),
            text:     typeof t.text === 'string' ? t.text.slice(0, 120) : '',
            done:     Boolean(t.done),
            priority: ['none','low','med','high'].includes(t.priority) ? t.priority : 'none',
            tag:      typeof t.tag === 'string' ? t.tag.slice(0, 30) : '',
            dueDate:  typeof t.dueDate === 'string' ? t.dueDate : null,
          }))
          storage.set(KEYS.TODOS, sanitizedTodos)
        }
        if (data.notes !== undefined) {
          if (typeof data.notes !== 'string' && !Array.isArray(data.notes)) throw new Error('Campo "notes" inválido')
          storage.set(KEYS.NOTES, data.notes)
        }
        if (data.settings !== undefined) {
          if (typeof data.settings !== 'object' || data.settings === null) throw new Error('Campo "settings" inválido')
          const safeSettings = {
            pomodoro:          Math.max(1, Math.min(99,  parseInt(data.settings.pomodoro)  || 25)),
            short:             Math.max(1, Math.min(60,  parseInt(data.settings.short)      || 5)),
            long:              Math.max(1, Math.min(60,  parseInt(data.settings.long)       || 15)),
            longBreakInterval: Math.max(1, Math.min(10,  parseInt(data.settings.longBreakInterval) || 4)),
            autoStart:  Boolean(data.settings.autoStart),
            lang:       ['es','en'].includes(data.settings.lang) ? data.settings.lang : 'es',
            showTodos:  data.settings.showTodos  !== false,
            showCards:  data.settings.showCards  !== false,
            showCalc:   data.settings.showCalc   !== false,
            showNotes:  data.settings.showNotes  !== false,
            showLofi:   data.settings.showLofi   !== false,
            ultraFocus: Boolean(data.settings.ultraFocus),
            muteSounds: Boolean(data.settings.muteSounds),
          }
          storage.set(KEYS.SETTINGS, safeSettings)
        }
        if (data.stats) {
          const sessions = Math.max(0, parseInt(data.stats.sessions) || 0)
          const totalSec = Math.max(0, parseInt(data.stats.totalSeconds) || 0)
          storage.set('postpone_timer_sessions', sessions)
          storage.set('postpone_timer_total',    totalSec)
        }
        window.location.reload()
      } catch (err) { addToast('Error al importar: ' + err.message, 'error') }
    }
    reader.readAsText(file)
  }

  const tabs = [
    { id: 'timer', label: 'Timer', icon: <TimerIcon size={14} /> },
    { id: 'modules', label: 'Módulos', icon: <Layers size={14} /> },
    { id: 'general', label: 'General', icon: <Settings size={14} /> },
    { id: 'data', label: 'Datos', icon: <Download size={14} /> },
  ]

  return (
    <div className="settings-overlay animate-fade" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="settings-panel settings-panel-v2 animate-slide" ref={ref2}>
        {/* Header */}
        <div className="settings-header-v2">
          <div className="settings-header-left">
            <div className="settings-header-icon"><Settings size={16} /></div>
            <div>
              <span className="settings-title-v2">Configuración</span>
              <span className="settings-subtitle-v2">StudyNeo</span>
            </div>
          </div>
          <button onClick={onClose} className="settings-close-v2"><X size={15} /></button>
        </div>

        {/* Stats bar */}
        <div className="settings-stats-bar">
          <div className="settings-stat-pill">
            <span className="settings-stat-pill-value">{sessions}</span>
            <span className="settings-stat-pill-label">{t.sessions}</span>
          </div>
          <div className="settings-stat-divider" />
          <div className="settings-stat-pill">
            <span className="settings-stat-pill-value">{fmtFocus(totalSecs)}</span>
            <span className="settings-stat-pill-label">{t.total_time}</span>
          </div>
          <div className="settings-stat-divider" />
          <div className="settings-stat-pill">
            <span className="settings-stat-pill-value">{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span className="settings-stat-pill-label">Tema</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="settings-body-v2">
          {/* TAB: Timer */}
          {activeTab === 'timer' && (
            <div className="settings-tab-content">
              <div className="settings-field-group">
                <p className="settings-group-label">Duración (minutos)</p>
                <div className="settings-timer-grid">
                  {[[t.pomodoro,'pomodoro',1,99,'var(--accent)'],[t.short_break,'short',1,60,'#34d399'],[t.long_break,'long',1,60,'#818cf8']].map(([label, key, mn, mx, color]) => (
                    <div key={key} className="settings-timer-card">
                      <span className="settings-timer-card-label" style={{ color }}>{label}</span>
                      <input
                        type="number" min={mn} max={mx}
                        className="settings-timer-input"
                        value={local[key]}
                        onChange={e => set(key, e.target.value)}
                      />
                      <span className="settings-timer-unit">min</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="settings-field-group">
                <div className="settings-field-row">
                  <div className="settings-field-info">
                    <span className="settings-field-label">Descanso largo cada</span>
                    <span className="settings-field-desc">Ciclos antes del descanso largo</span>
                  </div>
                  <input type="number" min={1} max={10} className="nav-settings-input" value={local.longBreakInterval} onChange={e => set('longBreakInterval', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Modules */}
          {activeTab === 'modules' && (
            <div className="settings-tab-content">
              <p className="settings-group-label">{t.modules}</p>
              {[
                [t.mod_tasks, 'showTodos', '✅'],
                [t.mod_cards, 'showCards', '🃏'],
                [t.mod_notes, 'showNotes', '📝'],
                [t.mod_calc,  'showCalc',  '🔢'],
              ].map(([label, key, emoji]) => (
                <div key={key} className="settings-toggle-row">
                  <div className="settings-toggle-left">
                    <span className="settings-toggle-emoji">{emoji}</span>
                    <span className="settings-field-label">{label}</span>
                  </div>
                  <label className="settings-toggle-switch">
                    <input type="checkbox" checked={local[key] ?? true} onChange={e => set(key, e.target.checked)} />
                    <span className="settings-toggle-track"><span className="settings-toggle-thumb" /></span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* TAB: General */}
          {activeTab === 'general' && (
            <div className="settings-tab-content">
              <div className="settings-field-group">
                <p className="settings-group-label">Apariencia</p>
                <div className="settings-theme-row">
                  {['dark','light'].map(th => (
                    <button
                      key={th}
                      className={`settings-theme-btn ${theme === th ? 'active' : ''}`}
                      onClick={() => onThemeChange(th)}
                    >
                      {th === 'dark' ? <><Moon size={15} /> Oscuro</> : <><Sun size={15} /> Claro</>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="settings-field-group">
                <p className="settings-group-label">Comportamiento</p>
                <div className="settings-toggle-row">
                  <div className="settings-toggle-left">
                    <span className="settings-toggle-emoji">🎯</span>
                    <div>
                      <span className="settings-field-label" style={{ fontWeight: 700 }}>{t.zen_mode}</span>
                      <span className="settings-field-desc" style={{ display: 'block' }}>Oculta distracciones</span>
                    </div>
                  </div>
                  <label className="settings-toggle-switch">
                    <input type="checkbox" checked={local.ultraFocus ?? false} onChange={e => set('ultraFocus', e.target.checked)} />
                    <span className="settings-toggle-track"><span className="settings-toggle-thumb" /></span>
                  </label>
                </div>
                <div className="settings-toggle-row">
                  <div className="settings-toggle-left">
                    <span className="settings-toggle-emoji">{local.muteSounds ? '🔇' : '🔊'}</span>
                    <span className="settings-field-label">{t.mute_sounds}</span>
                  </div>
                  <label className="settings-toggle-switch">
                    <input type="checkbox" checked={local.muteSounds ?? false} onChange={e => set('muteSounds', e.target.checked)} />
                    <span className="settings-toggle-track"><span className="settings-toggle-thumb" /></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Data */}
          {activeTab === 'data' && (
            <div className="settings-tab-content">
              <p className="settings-group-label">Copia de seguridad</p>
              <p className="settings-field-desc" style={{ marginBottom: 16, lineHeight: 1.5 }}>Exporta tus tareas, notas y configuración en un archivo <code>.neo</code>. Puedes importarlo en cualquier dispositivo.</p>
              <div className="settings-data-btns">
                <button className="settings-data-btn settings-data-btn-export" onClick={exportData}>
                  <Download size={15} />
                  <span>Exportar datos</span>
                </button>
                <label className="settings-data-btn settings-data-btn-import">
                  <Upload size={15} />
                  <span>Importar datos</span>
                  <input type="file" accept=".neo" style={{ display: 'none' }} onChange={importData} />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="settings-footer-v2">
          <button className="settings-save-btn" onClick={save}>
            <CheckCircle2 size={14} /> Guardar y cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* LOCAL CLOCK                                                */
/* ══════════════════════════════════════════════════════════ */
function LocalClock() {
  const [time, setTime] = useState(new Date())
  const [fullscreen, setFullscreen] = useState(false)
  const [animating, setAnimating] = useState(false)
  const overlayRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const openClock = () => {
    setFullscreen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(true))
    })
  }

  const closeClock = () => {
    setAnimating(false)
    setTimeout(() => setFullscreen(false), 500)
  }

  useEffect(() => {
    if (!fullscreen) return
    const h = e => { if (e.key === 'Escape') closeClock() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [fullscreen])

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const secStr  = time.toLocaleTimeString([], { second: '2-digit' })

  return (
    <>
      <button className="topbar-btn topbar-clock-btn" onClick={openClock} title="Ver reloj en pantalla completa">
        <Clock size={13} />
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{timeStr}</span>
      </button>

      {fullscreen && (
        <div
          ref={overlayRef}
          className={`clock-fullscreen ${animating ? 'clock-fullscreen--in' : 'clock-fullscreen--out'}`}
          onClick={closeClock}
        >
          <div className="clock-fs-content">
            <div className="clock-fs-time">
              {timeStr}
              <span className="clock-fs-seconds">{secStr}</span>
            </div>
            <div className="clock-fs-date">
              {time.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="clock-fs-hint">Toca para cerrar · ESC</div>
          </div>
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* APP                                                        */
/* ══════════════════════════════════════════════════════════ */
let toastId = 0
const DEFAULT_SETTINGS = { pomodoro: 25, short: 5, long: 15, longBreakInterval: 4, autoStart: false, lang: 'es', showTodos: true, showCards: true, showCalc: true, showNotes: true, showLofi: true, ultraFocus: false, muteSounds: false }

// Detección simple de hardware de bajo rendimiento
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  return memory <= 2 || cores <= 2;
};

export default function App() {
  const device          = useDevice()
  const [isLowEnd]      = useState(isLowEndDevice)
  const [showIntro,     setShowIntro]     = useState(() => {
    // Check if intro was already played in this session to skip on refresh (F5)
    return !sessionStorage.getItem('postpone_intro_played')
  })
  const [theme,         setTheme]         = useState(() => storage.get(KEYS.THEME, 'dark'))
  const [toasts,        setToasts]        = useState([])
  const [scrolled,      setScrolled]      = useState(false)
  const [settingsOpen,  setSettingsOpen]  = useState(false)
  const [page,          setPage]          = useState('main')
  const [notesOpen,     setNotesOpen]     = useState(false)
  const [timerSettings, setTimerSettings] = useState(() => storage.get(KEYS.SETTINGS, DEFAULT_SETTINGS))
  const [isOnline,      setIsOnline]      = useState(navigator.onLine)
  const [sessions,      setSessions]      = useState(() => storage.get('postpone_timer_sessions', 0))
  const [totalSecs,     setTotalSecs]     = useState(() => storage.get('postpone_timer_total', 0))
  const [todos,         setTodos]         = useState(() => storage.get(KEYS.TODOS, []))
  const [footerMenuOpen, setFooterMenuOpen] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const footerMenuRef = useRef(null)

  useEffect(() => {
    if (!footerMenuOpen) return
    const h = e => { if (footerMenuRef.current && !footerMenuRef.current.contains(e.target)) setFooterMenuOpen(false) }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [footerMenuOpen])
  
  const isZen = timerSettings.ultraFocus === true
  const t = getT(timerSettings.lang)

  /* Theme */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    storage.set(KEYS.THEME, theme)
  }, [theme])

  /* Initial sound mute sync */
  useEffect(() => {
    setMuted(timerSettings.muteSounds)
  }, [timerSettings.muteSounds])

  /* Scroll */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* Idle detection for Zen Mode */
  useEffect(() => {
    if (!isZen) return
    let timeout
    const resetIdle = () => {
      setIsIdle(false)
      clearTimeout(timeout)
      timeout = setTimeout(() => setIsIdle(true), 3000)
    }
    window.addEventListener('mousemove', resetIdle)
    window.addEventListener('keydown', resetIdle)
    timeout = setTimeout(() => setIsIdle(true), 3000)
    return () => {
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      clearTimeout(timeout)
    }
  }, [isZen])

  /* Online */
  useEffect(() => {
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    
    // Robustness: ensure data is flushed to storage on close
    const forceSave = () => {
      storage.set(KEYS.SETTINGS, timerSettings)
      storage.set(KEYS.TODOS, todos)
    }
    window.addEventListener('beforeunload', forceSave)

    return () => { 
      window.removeEventListener('online', on); 
      window.removeEventListener('offline', off);
      window.removeEventListener('beforeunload', forceSave)
    }
  }, [timerSettings, todos])

  /* Sync todos for Timer */
  useEffect(() => { setTodos(storage.get(KEYS.TODOS, [])) }, [])

  /* Sync stats from timer storage */
  useEffect(() => {
    const iv = setInterval(() => {
      setSessions(storage.get('postpone_timer_sessions', 0))
      setTotalSecs(storage.get('postpone_timer_total', 0))
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const addToast = (msg, type = 'info') => {
    const id = ++toastId
    setToasts(t => [...t, { id, message: msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }
  const removeToast = id => setToasts(t => t.filter(x => x.id !== id))

  const handleSessionComplete = n => {
    setSessions(n); storage.set('postpone_timer_sessions', n)
  }

  const handleSaveSettings = s => {
    setTimerSettings(s); storage.set(KEYS.SETTINGS, s); addToast('Guardado', 'success')
  }

  const handleConvertToFlashcard = todo => {
    const cards = storage.get(KEYS.FLASHCARDS, [])
    storage.set(KEYS.FLASHCARDS, [...cards, { id: Date.now(), q: todo.text, a: '(Agrega la respuesta)' }])
    addToast('Convertido a tarjeta de estudio', 'success')
  }

  return (
    <div className={`app-container ${isZen ? 'mode-zen' : ''} ${isIdle ? 'is-idle' : ''} ${isLowEnd ? 'is-low-end' : ''} ${device.classes}`}>
      {/* Intro animation */}
      {showIntro && <IntroScreen onDone={() => {
        setShowIntro(false)
        sessionStorage.setItem('postpone_intro_played', 'true')
      }} />}

      {/* Background orbs — Simplified or removed on low-end */}
      {!isLowEnd && (
        <>
          <div className="noise-overlay" />
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
          <div className="ambient-orb ambient-orb-3" />
        </>
      )}
      {isLowEnd && <div className="static-ambient-bg" />}

      {isZen && (
        <button className="zen-exit-btn" onClick={() => handleSaveSettings({ ...timerSettings, ultraFocus: false })} title="Salir del Modo Zen">
          <X size={16} /> Salir del Modo Zen
        </button>
      )}

      <div className="app-layout">
        {/* Day progress bar — very top */}
        {!isZen && <DayProgressBar />}

        {/* Topbar */}
        {!isZen && (
          <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="topbar-logo enter-logo">
              <img src="./icon.png" alt="StudyNeo" className="topbar-logo-img" />
              StudyNeo
            </div>

            <div className="topbar-actions enter-nav">
              {!isOnline && (
                <div className="topbar-btn" style={{ color:'var(--orange)', background:'var(--orange-dim)', border:'1px solid rgba(242,196,139,0.2)', pointerEvents:'none' }}>
                  <WifiOff size={12} /> Sin conexión
                </div>
              )}

              <LocalClock />



              <button className={`topbar-btn ${settingsOpen ? 'active' : ''}`} onClick={() => setSettingsOpen(o => !o)} title="Configuración">
                <Settings size={13} /> <span className="topbar-btn-label">Ajustes</span>
              </button>


            </div>
          </header>
        )}

        {/* Main grid */}
        <main className={`main-content ${isZen ? 'zen-centered' : ''} ${(!isZen && timerSettings.showTodos === false && timerSettings.showCards === false && timerSettings.showCalc === false && timerSettings.showNotes === false) ? 'centered-mode' : ''}`}>
          <Timer
            externalSettings={timerSettings}
            onSessionComplete={handleSessionComplete}
            onToast={addToast}
            linkedTodos={todos}
            lang={timerSettings.lang}
            isZen={isZen}
          />
          {!isZen && (timerSettings.showTodos !== false || timerSettings.showCards !== false || timerSettings.showCalc !== false || timerSettings.showNotes !== false) && (
            <TodoList onToast={addToast} onConvertToFlashcard={handleConvertToFlashcard} modules={timerSettings} lang={timerSettings.lang} onTodosChange={setTodos} />
          )}
        </main>

        {/* Footer */}
        {!isZen && (
          <footer className="app-footer">
            <div className="footer-links">
              <LikeButton />

              <a href={`${import.meta.env.BASE_URL}donar.html`} className="footer-link donate-link">
                <Sparkles size={14} /> Donar
              </a>

              <div className="footer-menu-container" ref={footerMenuRef}>
                <button 
                  className={`footer-link ${footerMenuOpen ? 'active' : ''}`} 
                  onClick={() => setFooterMenuOpen(!footerMenuOpen)}
                >
                  <MoreHorizontal size={14} />
                </button>
                
                {footerMenuOpen && (
                  <div className="footer-popover animate-scale">
                    <a href={`${import.meta.env.BASE_URL}contacto.html`} className="footer-popover-item">
                      <Mail size={12} /> Contacto
                    </a>
                    <a href={`${import.meta.env.BASE_URL}privacidad.html`} className="footer-popover-item">
                      <Shield size={12} /> Privacidad
                    </a>
                    <a href={`${import.meta.env.BASE_URL}terminos.html`} className="footer-popover-item">
                      <ScrollText size={12} /> Términos
                    </a>
                  </div>
                )}
              </div>
            </div>
            <p className="footer-credits">StudyNeo © {new Date().getFullYear()} - Diseñado para tu productividad</p>
          </footer>
        )}
      </div>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsPanel
          settings={timerSettings}
          onSave={handleSaveSettings}
          onClose={() => setSettingsOpen(false)}
          sessions={sessions}
          totalSecs={totalSecs}
          theme={theme}
          onThemeChange={setTheme}
        />
      )}

      {/* Notes panel is now integrated in TodoList, but we keep the overlay around just in case someone toggles it incorrectly */}
      {notesOpen && (
        <div className="notes-overlay">
          <Notes onClose={() => setNotesOpen(false)} />
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
