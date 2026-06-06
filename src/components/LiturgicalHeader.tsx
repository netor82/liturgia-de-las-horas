import { useContext } from 'react'
import { LiturgicalContext } from '../contexts/LiturgicalContext'
import styles from './LiturgicalHeader.module.css'

interface Cycles {
  sundaysYear?: string
  weekdaysCycle?: string
}

export default function LiturgicalHeader() {
  const liturgicalCtx = useContext(LiturgicalContext)

  if (!liturgicalCtx) {
    throw new Error('LiturgicalContext must be provided')
  }

  const { liturgicalDay } = liturgicalCtx

  if (!liturgicalDay) {
    return null
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getPsalterDisplay = () => {
    const psalter = liturgicalDay?.cycles?.psalterWeek[5] ?? 1
    const week = liturgicalDay?.calendar?.weekOfSeason ?? 1
    const seasonName = liturgicalDay.seasonNames[0]
    return `${seasonName}. Semana ${week}. Salterio ${psalter}`
  }

  const getCycleDisplay = () => {
    const cycles = liturgicalDay as unknown as { cycles?: Cycles }
    if (!cycles?.cycles) return null
    const cycle = cycles.cycles.sundaysYear || cycles.cycles.weekdaysCycle
    if (!cycle) return null
    return `Año ${cycle}`
  }

  const darkSeasons = ['ADVENT', 'LENT', 'EASTERTIDE']
  const isDarkSeason = darkSeasons.includes(liturgicalDay.liturgicalSeason || '')

  return (
    <header
      className={`${styles.container} ${isDarkSeason ? styles.darkText : styles.lightText}`}
    >
      <div className={styles.date}>{formatDate(liturgicalDay.date)}</div>
      <div className={styles.saintName}>{liturgicalDay.name}</div>
      <div className={styles.psaltery}>{getPsalterDisplay()}</div>
      {getCycleDisplay() && <div className={styles.cycle}>{getCycleDisplay()}</div>}
    </header>
  )
}
