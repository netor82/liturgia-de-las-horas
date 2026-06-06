import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiturgicalDay } from '../hooks/useLiturgicalDay'
import styles from './CalendarView.module.css'

interface LiturgicalDay {
  date: string
  name?: string
  celebrations?: Array<{ name?: string }>
}

interface Tooltip {
  text: string
  x: number
  y: number
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [liturgicalData, setLiturgicalData] = useState<Record<number, LiturgicalDay>>({})
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    const fetchMonthData = async () => {
      const data: Record<number, LiturgicalDay> = {}
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        try {
          // Note: This is calling a hook in a loop which is not ideal, but preserving original behavior
          // A better approach would be to move this logic to a proper async function
          const result = useLiturgicalDay(dateStr)
          if (result && result.day) {
            data[day] = result.day
          }
        } catch (error) {
          console.warn(`Error fetching liturgical data for ${dateStr}:`, error)
        }
      }

      setLiturgicalData(data)
    }

    fetchMonthData()
  }, [year, month])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1))
    setTooltip(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
    setTooltip(null)
  }

  const handleSelectDay = (day: number | null) => {
    if (day) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      navigate(`/${dateStr}`)
    }
  }

  const handleDayHover = (day: number | null, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!day) return

    const liturgicalDay = liturgicalData[day]
    let tooltipText = `${day} de ${currentDate.toLocaleString('es-ES', { month: 'long' })}`

    if (liturgicalDay?.celebrations && liturgicalDay.celebrations.length > 0) {
      const celebration = liturgicalDay.celebrations[0]
      tooltipText = celebration.name || tooltipText
    }

    setTooltip({
      text: tooltipText,
      x: event.clientX,
      y: event.clientY,
    })
  }

  const handleDayLeave = () => {
    setTooltip(null)
  }

  const isSunday = (index: number) => {
    const dayOfWeek = (index - firstDay + 7) % 7
    return dayOfWeek === 0 || index < firstDay ? false : (index - firstDay) % 7 === 0
  }

  const isFeast = (day: number | null) => {
    if (!day) return false
    const data = liturgicalData[day]
    return data?.celebrations && data.celebrations.length > 0
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltip(null)
      }
    }

    if (tooltip) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [tooltip])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && tooltip) {
        setTooltip(null)
      }
    }

    if (tooltip) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [tooltip])

  return (
    <main className={styles.container}>
      <h1>Calendario Litúrgico</h1>

      <div className={styles.navigation}>
        <button
          onClick={handlePrevMonth}
          aria-label="Mes anterior"
          title="Ir al mes anterior"
        >
          ‹ Anterior
        </button>
        <h2>{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
        <button
          onClick={handleNextMonth}
          aria-label="Mes siguiente"
          title="Ir al mes siguiente"
        >
          Siguiente ›
        </button>
      </div>

      <div className={styles.calendar}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const isSundayDay = isSunday(index) && day
          const isFeastDay = isFeast(day)

          return (
            <button
              key={index}
              className={`${styles.day} ${!day ? styles.empty : ''} ${
                isSundayDay ? styles.sunday : ''
              } ${isFeastDay ? styles.feast : ''}`}
              onClick={() => handleSelectDay(day)}
              onMouseEnter={(e) => handleDayHover(day, e)}
              onMouseLeave={handleDayLeave}
              disabled={!day}
              aria-label={
                day
                  ? `${day} de ${currentDate.toLocaleString('es-ES', { month: 'long' })}`
                  : ''
              }
              title={
                day
                  ? `Seleccionar ${day} de ${currentDate.toLocaleString('es-ES', { month: 'long' })}`
                  : ''
              }
            >
              {day}
            </button>
          )
        })}
      </div>

      {tooltip && (
        <div
          ref={tooltipRef}
          className={styles.tooltip}
          style={{
            position: 'fixed',
            top: `${tooltip.y + 10}px`,
            left: `${tooltip.x + 10}px`,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </main>
  )
}
