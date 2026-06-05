import { useParams, useNavigate } from 'react-router-dom'
import styles from './HourView.module.css'

export default function HourView() {
  const { date, hour } = useParams()
  const navigate = useNavigate()

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>{hour?.toUpperCase()}</h1>
        <p>{date}</p>
      </header>

      <article className={styles.card}>
        <h2>Prayer Content</h2>
        <p>Prayer text will be loaded here</p>
      </article>

      <div className={styles.navigation}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <button onClick={() => navigate(`/#/${date}`)}>Home</button>
      </div>
    </main>
  )
}
