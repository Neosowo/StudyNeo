import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const WDAYS  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']

export default function DatePicker({ value, onChange, onClose }) {
  const now   = new Date()
  const init  = (typeof value === 'string' && value) ? new Date(value) : now
  const [vy, setVy] = useState(init.getFullYear())
  const [vm, setVm] = useState(init.getMonth())
  const [time, setTime] = useState((typeof value === 'string' && value.includes('T')) ? value.slice(11,16) : '08:00')
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose?.() }
    const t = setTimeout(() => document.addEventListener('mousedown', h), 30)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h) }
  }, [onClose])

  const daysInMonth  = (y, m) => new Date(y, m+1, 0).getDate()
  const firstWeekDay = (y, m) => { const d = new Date(y,m,1).getDay(); return d===0?6:d-1 }

  const prevM = () => vm===0 ? (setVm(11), setVy(y=>y-1)) : setVm(m=>m-1)
  const nextM = () => vm===11 ? (setVm(0),  setVy(y=>y+1)) : setVm(m=>m+1)

  const fmt = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  const selectedDate = (typeof value === 'string' && value) ? value.slice(0,10) : null

  const pick = (d) => {
    const dateStr = fmt(vy, vm, d)
    onChange(`${dateStr}T${time}`)
  }

  const updateTime = (t) => {
    setTime(t)
    if (selectedDate) onChange(`${selectedDate}T${t}`)
  }

  const isToday = (d)    => vy===now.getFullYear() && vm===now.getMonth() && d===now.getDate()
  const isSelected = (d) => selectedDate === fmt(vy,vm,d)
  const isPast = (d)     => new Date(vy,vm,d) < new Date(now.getFullYear(),now.getMonth(),now.getDate())

  const dias = daysInMonth(vy, vm)
  const gaps = firstWeekDay(vy, vm)

  return (
    <div className="date-picker-panel animate-scale" ref={ref}>
      {/* Month nav */}
      <div className="dp-header">
        <button className="dp-nav-btn" onClick={prevM}><ChevronLeft size={14}/></button>
        <span className="dp-month-label">{MONTHS[vm]} {vy}</span>
        <button className="dp-nav-btn" onClick={nextM}><ChevronRight size={14}/></button>
      </div>

      {/* Weekday headers */}
      <div className="dp-grid">
        {WDAYS.map(d => <div key={d} className="dp-day-header">{d}</div>)}
        {Array.from({length: gaps}, (_,i) => <div key={`g${i}`}/>)}
        {Array.from({length: dias}, (_,i) => {
          const d = i+1
          return (
            <button
              key={d}
              className={`dp-day ${isSelected(d)?'selected':''} ${isToday(d)?'today':''} ${isPast(d)&&!isSelected(d)?'past':''}`}
              onClick={() => pick(d)}
            >{d}</button>
          )
        })}
      </div>

      {/* Time row */}
      <div className="dp-time-row">
        <Clock size={13} color="var(--text-4)"/>
        <span className="dp-time-label">Hora</span>
        <input type="time" className="dp-time-input" value={time} onChange={e=>updateTime(e.target.value)}/>
      </div>

      {/* Action row */}
      <div className="dp-footer">
        {value && (
          <button className="dp-clear-btn" onClick={()=>onChange(null)}>
            <X size={12}/> Quitar fecha
          </button>
        )}
        <button className="dp-done-btn" onClick={onClose}>Listo</button>
      </div>
    </div>
  )
}
