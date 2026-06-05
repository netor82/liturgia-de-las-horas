import { useState } from 'react'
import styles from './CalendarView.module.css'

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

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
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const handleSelectDay = (day) => {
    if (day) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      window.location.hash = `#/${dateStr}`
    }
  }

  return (
    <main className={styles.container}>
      <h1>Calendario Litúrgico</h1>

      <div className={styles.navigation}>
        <button onClick={handlePrevMonth}>‹ Anterior</button>
        <h2>{currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth}>Siguiente ›</button>
      </div>

      <div className={styles.calendar}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <button
            key={index}
            className={`${styles.day} ${!day ? styles.empty : ''}`}
            onClick={() => handleSelectDay(day)}
            disabled={!day}
          >
            {day}
          </button>
        ))}
      </div>
    </main>
  )
}
