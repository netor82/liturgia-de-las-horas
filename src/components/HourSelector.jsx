import { useParams } from 'react-router-dom'
import styles from './HourSelector.module.css'

export default function HourSelector() {
  const { date } = useParams()
  const selectedDate = date || new Date().toISOString().split('T')[0]

  const hours = [
    { key: 'oficio-de-lectura', label: 'Oficio de Lectura', time: '6:00 AM' },
    { key: 'laudes', label: 'Laudes', time: '6:00 AM' },
    { key: 'tercia', label: 'Tercia', time: '9:00 AM' },
    { key: 'sexta', label: 'Sexta', time: '12:00 PM' },
    { key: 'nona', label: 'Nona', time: '3:00 PM' },
    { key: 'visperas', label: 'Vísperas', time: '6:00 PM' },
    { key: 'completas', label: 'Completas', time: '9:00 PM' },
  ]

  return (
    <main className={styles.container}>
      <h1>{selectedDate}</h1>
      <div className={styles.grid}>
        {hours.map((hour) => (
          <button
            key={hour.key}
            className={styles.hourButton}
            onClick={() => {
              window.location.hash = `#/${selectedDate}/${hour.key}`
            }}
          >
            <div className={styles.hourLabel}>{hour.label}</div>
            <div className={styles.hourTime}>{hour.time}</div>
          </button>
        ))}
      </div>
    </main>
  )
}
