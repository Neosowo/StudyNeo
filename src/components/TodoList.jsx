import { useState, useRef, useEffect } from 'react'
import { CalendarDays, MoreHorizontal, CheckCheck, Brain, Plus, AlertCircle, Clock, CheckCircle2, ListTodo, Calculator, FileText, Lightbulb, X, ChevronRight, ChevronLeft, Trash2, PlusCircle, MinusCircle, TrendingUp, BookOpen, StickyNote } from 'lucide-react'
import Notes from './Notes'
import DatePicker from './DatePicker'
import { storage, KEYS } from '../utils/storage'
import { getT } from '../locales'
import { playClick, playTaskDone, playComplete } from '../utils/sounds'

/* ─── Constants ─────────────────────────────────────────── */
const PRIORITIES  = [{ id:'none',label:'Prioridad'},{id:'low',label:'Baja'},{id:'med',label:'Media'},{id:'high',label:'Alta'}]
const FILTERS     = [{ id:'all',label:'Todas'},{id:'active',label:'Activas'},{id:'today',label:'Hoy'},{id:'completed',label:'Completadas'}]
const TAGS        = ['Tarea','Examen','Lectura','Proyecto','Repaso','Otro']
let   idCounter   = Date.now()

/* ─── Helpers ───────────────────────────────────────────── */
function formatDueDate(iso) {
  if (!iso) return null
  const d=new Date(iso),now=new Date()
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate())
  const dd=new Date(d.getFullYear(),d.getMonth(),d.getDate())
  const diff=Math.round((dd-today)/86400000)
  const time=d.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})
  if(diff<0)  return {label:'Vencida',time,overdue:true}
  if(diff===0) return {label:'Hoy',time,today:true}
  if(diff===1) return {label:'Mañana',time}
  return {label:d.toLocaleDateString('es',{day:'numeric',month:'short'}),time}
}
function isToday(iso){
  if(!iso)return false
  const d=new Date(iso),n=new Date()
  return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()&&d.getDate()===n.getDate()
}

const SEED_TODOS=[]
const SEED_CARDS=[]

/* ══════════════════════════════════════════════════════════ */
/* FLASHCARDS TAB                                             */
/* ══════════════════════════════════════════════════════════ */
function FlashcardsTab({ onToast }) {
  const [cards,    setCards]    = useState(() => storage.get(KEYS.FLASHCARDS, SEED_CARDS))
  const [index,    setIndex]    = useState(0)
  const [flipped,  setFlipped]  = useState(false)
  const [qInput,   setQInput]   = useState('')
  const [aInput,   setAInput]   = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => { storage.set(KEYS.FLASHCARDS, cards) }, [cards])

  const go = dir => { setFlipped(false); setTimeout(() => setIndex(i => (i+dir+cards.length)%cards.length), 150) }

  const addCard = () => {
    if (!qInput.trim() || !aInput.trim()) return
    setCards(c => [...c, { id: Date.now(), q: qInput.trim(), a: aInput.trim() }])
    setQInput(''); setAInput(''); setIsAdding(false)
    onToast?.('Tarjeta creada', 'success')
  }

  const deleteCard = () => {
    if (!cards.length) return
    const cur = Math.min(index, cards.length - 1)
    setCards(c => c.filter((_, i) => i !== cur))
    setIndex(i => Math.max(0, i - 1))
    setFlipped(false)
    onToast?.('Tarjeta eliminada', 'info')
  }

  const cur = cards.length > 0 ? Math.min(index, cards.length - 1) : 0

  return (
    <div className="flashcard-tab-body">
      <div className="fc-add-bar">
        <button className={`fc-add-toggle ${isAdding ? 'active' : ''}`} onClick={() => setIsAdding(o => !o)}>
          {isAdding ? <><X size={13}/> Cancelar</> : <><Plus size={13}/> Nueva tarjeta</>}
        </button>
      </div>

      {isAdding && (
        <div className="fc-form animate-slide-down">
          <input className="fc-input" placeholder="Pregunta (frente)…" value={qInput} onChange={e => setQInput(e.target.value)} />
          <input className="fc-input" placeholder="Respuesta (reverso)…" value={aInput} onChange={e => setAInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCard()} />
          <button className="nav-settings-apply" onClick={addCard}>Guardar tarjeta</button>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="tab-empty">
          <Brain size={32} className="tab-empty-icon" />
          <p className="tab-empty-title">Sin tarjetas aún</p>
          <p className="tab-empty-sub">Crea una tarjeta para empezar a repasar</p>
        </div>
      ) : (
        <div className="fc-viewer">
          <div className="fc-counter">{cur + 1} / {cards.length}</div>
          <div className={`fc-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
            <div className="fc-inner">
              <div className="fc-front">
                <p className="fc-text">{cards[cur].q}</p>
                <span className="fc-hint">Toca para voltear</span>
              </div>
              <div className="fc-back">
                <p className="fc-text">{cards[cur].a}</p>
              </div>
            </div>
          </div>
          <div className="fc-controls">
            <button className="ctrl-btn ctrl-btn-secondary" onClick={() => go(-1)}><ChevronLeft size={18}/></button>
            <button className="ctrl-btn ctrl-btn-secondary" onClick={deleteCard} style={{color:'var(--red)'}}><Trash2 size={15}/></button>
            <button className="ctrl-btn ctrl-btn-secondary" onClick={() => go(1)}><ChevronRight size={18}/></button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* ESPOL GRADE CALCULATOR TAB                                  */
/* ══════════════════════════════════════════════════════════ */
function clamp(v, mn, mx) { return Math.min(mx, Math.max(mn, v)) }

function GradeCalculatorTab() {
  const [porcPrac,   setPorcPrac]   = useState(30)   // % del componente práctico
  const [notaPrac,   setNotaPrac]   = useState('')   // nota práctica (0-100)
  const [parcial1,   setParcial1]   = useState('')   // primer parcial (0-100)
  const [parcial2,   setParcial2]   = useState('')   // segundo parcial (0-100)
  const [mejora,     setMejora]     = useState('')   // mejoramiento (opcional)
  const [result,     setResult]     = useState(null)

  // -- Calculation (mirrors the ESPOL site logic exactly) --
  useEffect(() => {
    const nPrac = parseFloat(notaPrac)
    const p1    = parseFloat(parcial1)
    const p2    = parseFloat(parcial2)
    const mej   = parseFloat(mejora)
    const pPorc = clamp(parseFloat(porcPrac) || 0, 0, 100)

    // Si faltan notas principales, no hay resultado final completo aún
    if (isNaN(nPrac) || isNaN(p1) || isNaN(p2)) {
      setResult(null)
      return
    }

    // Mejoramiento replaces the lower partial if it is higher
    let fp1 = p1, fp2 = p2
    if (!isNaN(mej)) {
      if (p1 <= p2 && mej > p1) fp1 = mej
      else if (p2 < p1  && mej > p2) fp2 = mej
    }

    const avgTeo  = (fp1 + fp2) / 2
    const pTeo    = 100 - pPorc

    // finalSum is on 0-100 scale
    const finalSum = (nPrac * pPorc / 100) + (avgTeo * pTeo / 100)
    // Display grade is on 0-10 scale
    const grade10  = finalSum / 10
    const passes   = finalSum >= 60

    // Required mejoramiento to reach exactly 60 (if failing and no mej entered)
    let reqMej = null
    if (!passes && isNaN(mej)) {
      const needed = (60 - (nPrac * pPorc / 100)) * 2 * 100 / pTeo - Math.max(p1, p2)
      reqMej = clamp(needed, 0, 100)
    }

    setResult({ grade10, finalSum, passes, avgTeo, fp1, fp2, reqMej, pPorc, pTeo, nPrac })
  }, [notaPrac, parcial1, parcial2, mejora, porcPrac])

  const reset = () => {
    setPorcPrac(30); setNotaPrac(''); setParcial1(''); setParcial2(''); setMejora('')
  }

  const inputNum = (val, set) => {
    const n = parseFloat(val)
    if (val === '' || (!isNaN(n) && n >= 0 && n <= 100)) set(val)
  }

  return (
    <div className="espol-calc">
      {/* Result card */}
      {result && (
        <div className={`espol-result ${result.passes ? 'pass' : 'fail'}`}>
          <div className="espol-result-inner">
            <span className="espol-result-grade">{result.grade10.toFixed(2)}</span>
            <span className="espol-result-label">/ 10</span>
          </div>
          <div className={`espol-result-status ${result.passes ? 'pass' : 'fail'}`}>
            {result.passes
              ? <><CheckCheck size={15}/> Aprobado</>
              : <><AlertCircle size={15}/> Reprobado</>
            }
          </div>
          <div className="espol-result-detail">
            <span>Prom. teórico: <strong>{(result.avgTeo / 10).toFixed(2)}</strong></span>
            <span>Parcial-A: <strong>{(result.fp1 / 10).toFixed(2)}</strong></span>
            <span>Parcial-B: <strong>{(result.fp2 / 10).toFixed(2)}</strong></span>
          </div>
          {result.reqMej !== null && (
            <div className="espol-mejora-hint">
              <AlertCircle size={13}/>
              Necesitas <strong>{(result.reqMej / 10).toFixed(2)}</strong> en mejoramiento para aprobar
              {result.reqMej > 100 && <span className="espol-impossible"> — Imposible aprobar</span>}
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div className="espol-form">
        {/* Practical row */}
        <div className="espol-section-label">Componente Práctico</div>
        <div className="espol-prac-row">
          <div className="espol-field">
            <label className="espol-field-label">% Práctico</label>
            <div className="espol-field-wrap">
              <input
                className="espol-input"
                type="number" min={0} max={100}
                value={porcPrac}
                onChange={e => setPorcPrac(clamp(parseFloat(e.target.value)||0,0,100))}
              />
              <span className="espol-unit">%</span>
            </div>
          </div>
          <div className="espol-field" style={{flex:2}}>
            <label className="espol-field-label">Nota Práctica</label>
            <div className="espol-field-wrap">
              <input
                className="espol-input"
                type="number" placeholder="0 – 100"
                value={notaPrac}
                onChange={e => inputNum(e.target.value, setNotaPrac)}
              />
              <span className="espol-unit">{notaPrac !== '' ? `${(parseFloat(notaPrac)/10).toFixed(1)}` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Theoretical */}
        <div className="espol-section-label" style={{marginTop:12}}>
          Componente Teórico ({100 - porcPrac}%)
        </div>

        <div className="espol-field">
          <label className="espol-field-label">Primer Parcial</label>
          <div className="espol-field-wrap">
            <input
              className="espol-input"
              type="number" placeholder="0 – 100"
              value={parcial1}
              onChange={e => inputNum(e.target.value, setParcial1)}
            />
            <span className="espol-unit">{parcial1 !== '' ? (parseFloat(parcial1)/10).toFixed(1) : '—'}</span>
          </div>
        </div>

        <div className="espol-field">
          <label className="espol-field-label">Segundo Parcial</label>
          <div className="espol-field-wrap">
            <input
              className="espol-input"
              type="number" placeholder="0 – 100"
              value={parcial2}
              onChange={e => inputNum(e.target.value, setParcial2)}
            />
            <span className="espol-unit">{parcial2 !== '' ? (parseFloat(parcial2)/10).toFixed(1) : '—'}</span>
          </div>
        </div>

        <div className="espol-field">
          <label className="espol-field-label">
            Mejoramiento <span className="espol-optional">(opcional)</span>
          </label>
          <div className="espol-field-wrap">
            <input
              className="espol-input"
              type="number" placeholder="0 – 100"
              value={mejora}
              onChange={e => inputNum(e.target.value, setMejora)}
            />
            <span className="espol-unit">{mejora !== '' ? (parseFloat(mejora)/10).toFixed(1) : '—'}</span>
          </div>
        </div>

        <div className="espol-note">
          Las notas se ingresan en escala <strong>0-100</strong>. El resultado se muestra en <strong>0-10</strong>.
          El mejoramiento reemplaza el menor parcial si es superior.
        </div>

        <div className="espol-actions">
          <button className="espol-btn-reset" onClick={reset} style={{ width: '100%' }}><X size={14}/> Limpiar Notas</button>
        </div>
      </div>
    </div>
  )
}


/* ══════════════════════════════════════════════════════════ */
/* MAIN COMPONENT                                             */
/* ══════════════════════════════════════════════════════════ */
export default function TodoList({ onToast, onConvertToFlashcard, modules = {}, lang = 'es', onTodosChange }) {
  const [activeTab,  setActiveTab]  = useState('todos')
  const [tabMenuOpen, setTabMenuOpen] = useState(false)
  const tabMenuRef = useRef(null)
  const [todos,      setTodos]      = useState(() => storage.get(KEYS.TODOS, SEED_TODOS))
  const [input,      setInput]      = useState('')
  const [priority,   setPriority]   = useState('none')
  const [tag,        setTag]        = useState('Tarea')
  const [filter,     setFilter]     = useState('all')
  const [dueDate,    setDueDate]    = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { 
    storage.set(KEYS.TODOS, todos)
    onTodosChange?.(todos) 
  }, [todos, onTodosChange])

  useEffect(() => {
    if (!tabMenuOpen) return
    const h = (e) => { if (tabMenuRef.current && !tabMenuRef.current.contains(e.target)) setTabMenuOpen(false) }
    const t = setTimeout(() => document.addEventListener('mousedown', h), 10)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h) }
  }, [tabMenuOpen])

  const addTodo = () => {
    const text = input.trim()
    if (!text) { inputRef.current?.focus(); return }
    setTodos(t => [{ id: idCounter++, text, done: false, priority, tag, dueDate }, ...t])
    setInput(''); setPriority('none'); setDueDate(null); setPickerOpen(false)
    inputRef.current?.focus()
  }

  const toggle  = id => {
    setTodos(t => t.map(x => {
      if(x.id===id) {
        if (!x.done) playTaskDone();
        return {...x,done:!x.done}
      }
      return x
    }))
  }
  const remove  = id => { setTodos(t => t.filter(x => x.id!==id)) }
  const setDate = (id,d) => { setTodos(t => t.map(x => x.id===id ? {...x,dueDate:d} : x)) }

  const clearCompleted = () => {
    const n = todos.filter(t=>t.done).length
    if(!n) return
    playComplete()
    setTodos(t=>t.filter(x=>!x.done))
    onToast?.(`${n} tarea${n>1?'s':''} eliminada${n>1?'s':''}`, 'info')
  }

  const filtered = todos.filter(t => {
    if(filter==='active')    return !t.done
    if(filter==='completed') return t.done
    if(filter==='today')     return !t.done&&(isToday(t.dueDate)||!t.dueDate)
    return true
  })

  const completedCount = todos.filter(t=>t.done).length
  const activeCount    = todos.filter(t=>!t.done).length
  const overdueCount   = todos.filter(t=>!t.done&&t.dueDate&&new Date(t.dueDate)<new Date()).length
  const progress       = todos.length>0?(completedCount/todos.length)*100:0

  const t = getT(lang)

  const availableTabs = [
    (modules.showTodos !== false) ? { id: 'todos', label: t.mod_tasks, Icon: ListTodo } : null,
    (modules.showCards !== false) ? { id: 'cards', label: t.mod_cards, Icon: Brain } : null,
    (modules.showNotes !== false) ? { id: 'notes', label: t.mod_notes, Icon: FileText } : null,
    (modules.showCalc  !== false) ? { id: 'calc',  label: t.mod_calc, Icon: Calculator } : null,
  ].filter(Boolean)

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id)
    }
  }, [modules, activeTab])

  const ActiveIcon = availableTabs.find(t => t.id === activeTab)?.Icon || BookOpen
  const activeLabel = availableTabs.find(t => t.id === activeTab)?.label || 'Menú'

  return (
    <div className="todo-section">
      <div className="todo-card">

        {/* Unified Tab Dropdown Menu */}
        <div className="unified-tab-menu" ref={tabMenuRef}>
          <button className="tab-menu-trigger" onClick={() => setTabMenuOpen(o => !o)}>
            <div className="tab-menu-trigger-left">
              <ActiveIcon size={16} />
              <span className="tab-menu-trigger-label">{activeLabel}</span>
              {activeTab === 'todos' && activeCount > 0 && <span className="panel-tab-badge">{activeCount}</span>}
            </div>
            <MoreHorizontal size={16} className={`tab-menu-chevron ${tabMenuOpen ? 'open' : ''}`}/>
          </button>
          
          {tabMenuOpen && (
            <div className="tab-menu-dropdown animate-scale">
              {availableTabs.map(({ id, label, Icon }) => (
                <button 
                  key={id} 
                  className={`tab-menu-item ${activeTab === id ? 'active' : ''}`} 
                  onClick={() => { setActiveTab(id); setTabMenuOpen(false) }}
                >
                  <Icon size={14}/>
                  {label}
                  {id === 'todos' && activeCount > 0 && <span className="panel-tab-badge" style={{marginLeft:'auto'}}>{activeCount}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── TODOS ─────────────────────────────────── */}
        {activeTab==='todos' && (
          <>
            {/* Progress */}
            {todos.length>0 && (
              <div className="todo-progress-container">
                <div className="todo-progress-bar" style={{width:`${progress}%`}}/>
              </div>
            )}

            {overdueCount>0 && (
              <div style={{padding:'6px 1.5rem 0'}}>
                <span className="todo-overdue-tag">
                  <AlertCircle size={11}/> {overdueCount} vencida{overdueCount>1?'s':''}
                </span>
              </div>
            )}

            {/* Filters */}
            <div className="todo-filters">
              {FILTERS.map(f=>(
                <button key={f.id} className={`filter-btn ${filter===f.id?'active':''}`} onClick={()=>setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Add input */}
            <div className="todo-add-wrap">
              <div className="todo-add-row">
                <input
                  ref={inputRef} className="todo-add-input"
                  placeholder="Nueva tarea… (Enter)"
                  value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&addTodo()} maxLength={120}
                />
                <button className={`todo-calendar-btn ${pickerOpen?'active':''}`} onClick={()=>setPickerOpen(o=>!o)} title="Programar fecha">
                  <CalendarDays size={15}/>
                  {dueDate && <span className="todo-cal-dot"/>}
                </button>
                <button className="todo-add-btn" onClick={addTodo} title="Añadir"><Plus size={18}/></button>
              </div>
              <div className="todo-meta-row">
                <select className="todo-meta-select" value={priority} onChange={e=>setPriority(e.target.value)}>
                  {PRIORITIES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <select className="todo-meta-select" value={tag} onChange={e=>setTag(e.target.value)}>
                  {TAGS.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                {dueDate && (
                  <span className="todo-due-preview">
                    <CalendarDays size={10} style={{marginRight:4}}/>
                    {new Date(dueDate).toLocaleDateString('es',{day:'numeric',month:'short'})}
                    <button onClick={()=>setDueDate(null)} style={{marginLeft:4,color:'var(--text-4)'}}><X size={10}/></button>
                  </span>
                )}
              </div>
              {pickerOpen && (
                <div style={{position:'relative'}}>
                  <DatePicker value={dueDate} onChange={v=>setDueDate(v)} onClose={()=>setPickerOpen(false)}/>
                </div>
              )}
            </div>

            {/* List */}
            <div className="todo-list">
              {filtered.length===0 ? (
                <div className="tab-empty">
                  {filter==='completed'
                    ? <CheckCheck size={32} className="tab-empty-icon"/>
                    : <Plus size={32} className="tab-empty-icon"/>
                  }
                  <p className="tab-empty-title">
                    {filter==='all'       ? 'Sin tareas' :
                     filter==='active'    ? 'Todo completado' :
                     filter==='today'     ? 'Nada para hoy' :
                     'Sin completadas aún'}
                  </p>
                  <p className="tab-empty-sub">
                    {filter==='all' ? 'Añade tu primera tarea arriba' :
                     filter==='active' ? '¡Bien hecho!' :
                     filter==='today' ? 'Programa tareas con fecha de hoy' :
                     'Completa algunas tareas primero'}
                  </p>
                </div>
              ) : filtered.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={()=>toggle(todo.id)}
                  onDelete={()=>remove(todo.id)}
                  onDateChange={d=>setDate(todo.id,d)}
                  onConvertToFlashcard={onConvertToFlashcard}
                />
              ))}
            </div>

            {todos.length>0 && (
              <div className="todo-footer">
                <span className="todo-stats-text">{completedCount} de {todos.length} completadas</span>
                {completedCount>0 && (
                  <button className="todo-clear-btn" onClick={clearCompleted}>
                    <CheckCheck size={13} style={{marginRight:4}}/> Limpiar
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {activeTab==='cards'  && <FlashcardsTab onToast={onToast}/>}
        {activeTab==='calc' && <GradeCalculatorTab/>}
        {activeTab==='notes'  && (
          <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <Notes integrated={true} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════ */
/* TODO ITEM                                                  */
/* ══════════════════════════════════════════════════════════ */
function TodoItem({ todo, onToggle, onDelete, onDateChange, onConvertToFlashcard }) {
  const [datePicker,setDatePicker]=useState(false)
  const [menuOpen,  setMenuOpen]  =useState(false)
  const menuRef=useRef(null)
  const due=formatDueDate(todo.dueDate)

  useEffect(()=>{
    if(!menuOpen)return
    const h=e=>{if(menuRef.current&&!menuRef.current.contains(e.target))setMenuOpen(false)}
    const t=setTimeout(()=>document.addEventListener('mousedown',h),10)
    return()=>{clearTimeout(t);document.removeEventListener('mousedown',h)}
  },[menuOpen])

  return (
    <div className={`todo-item ${todo.done?'completed':''} ${due?.overdue&&!todo.done?'overdue':''}`}>
      <button className={`todo-checkbox ${todo.done?'checked':''}`} onClick={onToggle} aria-label="toggle"/>
      <div className="todo-item-text-wrap">
        <span className="todo-item-text">{todo.text}</span>
        <div className="todo-item-meta">
          {todo.priority!=='none'&&(
            <span className={`priority-badge ${todo.priority}`}>
              {todo.priority==='high'?'Alta':todo.priority==='med'?'Media':'Baja'}
            </span>
          )}
          {todo.tag&&<span className="tag-badge">{todo.tag}</span>}
          {due&&(
            <span className={`due-badge ${due.overdue?'overdue':due.today?'today':''}`}>
              <Clock size={10} style={{marginRight:4}}/>{due.label} {due.time}
            </span>
          )}
        </div>
      </div>

      {menuOpen&&(
        <div className="todo-context-menu animate-scale" ref={menuRef}>
          <button className="todo-ctx-item" onClick={()=>{setDatePicker(o=>!o);setMenuOpen(false)}}>
            <CalendarDays size={13}/> Programar fecha
          </button>

          <button className="todo-ctx-item" onClick={()=>{onToggle();setMenuOpen(false)}}>
            <CheckCheck size={13}/> {todo.done?'Marcar pendiente':'Marcar completada'}
          </button>
          <div className="todo-ctx-divider"/>
          <button className="todo-ctx-item danger" onClick={()=>{onDelete();setMenuOpen(false)}}>
            <X size={13}/> Eliminar
          </button>
        </div>
      )}

      <div className="todo-item-actions">
        <button className="todo-ctx-trigger" onClick={e=>{e.stopPropagation();setMenuOpen(o=>!o)}} title="Opciones">
          <MoreHorizontal size={15}/>
        </button>
        <button className="todo-del-btn" onClick={onDelete} title="Eliminar"><X size={13}/></button>
      </div>

      {datePicker&&(
        <div className="todo-item-picker">
          <DatePicker value={todo.dueDate} onChange={d=>onDateChange(d)} onClose={()=>setDatePicker(false)}/>
        </div>
      )}
    </div>
  )
}
