import { useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { LiturgicalContext } from '../contexts/LiturgicalContext'
import { getAllHours, getNearestHour } from '../utils/hourTimes'
import styles from './HourSelector.module.css'

export default function HourSelector() {
  const { date } = useParams()
  const navigate = useNavigate()
  const { liturgicalDay } = useContext(LiturgicalContext)

  const selectedDate = date || new Date().toISOString().split('T')[0]
  const hours = getAllHours()
  const nearestHour = getNearestHour()

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <main className={styles.container}>
      <h1>{formatDate(selectedDate)}</h1>
      {liturgicalDay?.name && <h2>{liturgicalDay.name}</h2>}
      <nav aria-label="Horas canónicas" className={styles.hoursNav}>
        <div className={styles.grid}>
          {hours.map((hour) => (
            <button
              key={hour.key}
              className={`${styles.hourButton} ${nearestHour === hour.key ? styles.active : ''}`}
              onClick={() => navigate(`/${selectedDate}/${hour.key}`)}
              aria-label={`Seleccionar ${hour.displayName}, ${hour.time}`}
            >
              <div className={styles.hourLabel}>{hour.displayName}</div>
              <div className={styles.hourTime}>{hour.time}</div>
            </button>
          ))}
        </div>
      </nav>

      <nav className={styles.footer} aria-label="Navegación principal">
        <button
          className={styles.navButton}
          onClick={() => navigate('/calendario')}
          aria-label="Ir al calendario litúrgico"
        >
          📅 Calendario
        </button>
        <button
          className={styles.navButton}
          onClick={() => navigate('/configuracion')}
          aria-label="Ir a configuración y accesibilidad"
        >
          ⚙️ Configuración
        </button>
      </nav>
    </main>
  )
}
