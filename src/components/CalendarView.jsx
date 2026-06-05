import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiturgicalDay } from '../hooks/useLiturgicalDay'
import styles from './CalendarView.module.css'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [liturgicalData, setLiturgicalData] = useState({})
  const [tooltip, setTooltip] = useState(null)
  const tooltipRef = useRef(null)
  const navigate = useNavigate()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Fetch liturgical data for the entire month
  useEffect(() => {
    const fetchMonthData = async () => {
      const data = {}
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        try {
          const liturgicalDay = await useLiturgicalDay(dateStr)
          if (liturgicalDay) {
            data[day] = liturgicalDay
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

  const days = []
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

  const handleSelectDay = (day) => {
    if (day) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      navigate(`/${dateStr}`)
    }
  }

  const handleDayHover = (day, event) => {
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

  const isSunday = (index) => {
    // index is position in the grid, so Sunday is every 7th starting from 0
    const dayOfWeek = (index - firstDay + 7) % 7
    return dayOfWeek === 0 || index < firstDay ? false : (index - firstDay) % 7 === 0
  }

  const isFeast = (day) => {
    const data = liturgicalData[day]
    return data?.celebrations && data.celebrations.length > 0
  }

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setTooltip(null)
      }
    }

    if (tooltip) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [tooltip])

  // Close tooltip on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
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
              className={`${styles.day} ${!day ? styles.empty : ''} ${isSundayDay ? styles.sunday : ''} ${isFeastDay ? styles.feast : ''}`}
              onClick={() => handleSelectDay(day)}
              onMouseEnter={(e) => handleDayHover(day, e)}
              onMouseLeave={handleDayLeave}
              disabled={!day}
              aria-label={day ? `${day} de ${currentDate.toLocaleString('es-ES', { month: 'long' })}` : ''}
              title={day ? `Seleccionar ${day} de ${currentDate.toLocaleString('es-ES', { month: 'long' })}` : ''}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Tooltip for feast/day names */}
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
