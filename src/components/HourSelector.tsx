import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { LiturgicalContext } from '../contexts/LiturgicalContext'
import { getAllHours, getNearestHour } from '../utils/hourTimes'
import { useLiturgicalDay } from '../hooks/useLiturgicalDay'
import FontSizeController from './FontSizeController'
import styles from './HourSelector.module.css'
import LiturgicalHeader from './LiturgicalHeader'

export default function HourSelector() {
  const { date } = useParams<{ date?: string }>()
  const navigate = useNavigate()
  const liturgicalCtx = useContext(LiturgicalContext)

  if (!liturgicalCtx) {
    throw new Error('LiturgicalContext must be provided')
  }

  const { liturgicalDay, setLiturgicalDay, setDate, loading, setLoading } = liturgicalCtx
  const selectedDate = date || new Date().toISOString().split('T')[0]

  useEffect(() => {
    useLiturgicalDay(selectedDate).then((day)=> {
      if (day) {
        setLiturgicalDay(day)
        setLoading(false)
      }
      console.log('selected date: ', selectedDate, day)
      setDate(selectedDate)
    });
  }, [selectedDate, setDate])
  const hours = getAllHours()
  const nearestHour = getNearestHour()

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  
    if (loading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
    }

  return (
    <main className={styles.container}>
      <LiturgicalHeader />
      <div className="home-rule">✦</div>
      <nav aria-label="Horas canónicas" className={styles.hoursNav}>
        <div className={styles.grid}>
          {hours.map((hour) => (
            <button
              key={hour.key}
              className={`${styles.hourButton} ${nearestHour === hour.key ? 'active ' + styles.active : ''}`}
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
        <FontSizeController />
        <div className={styles.footerButtons}>
          <button
            className={styles.navButton}
            onClick={() => navigate('/calendario')}
            aria-label="Ir al calendario litúrgico"
          >
            ⊞ Calendario
          </button>
          <button
            className={styles.navButton}
            onClick={() => navigate('/configuracion')}
            aria-label="Ir a configuración y accesibilidad"
          >
            ⚙ Configuración
          </button>
        </div>
      </nav>
    </main>
  )
}
