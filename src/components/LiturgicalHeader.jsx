import { useContext } from 'react'
import { LiturgicalContext } from '../contexts/LiturgicalContext'
import { getSeasonNameDisplay } from '../utils/liturgicalColors'
import styles from './LiturgicalHeader.module.css'

export default function LiturgicalHeader() {
  const { liturgicalDay, selectedDate } = useContext(LiturgicalContext)

  if (!liturgicalDay) {
    return null
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getPsalterDisplay = () => {
    const week = liturgicalDay.psaltery?.week || 1
    const season = liturgicalDay.liturgicalSeason || 'ORDINARY_TIME'
    const seasonName = getSeasonNameDisplay(season)
    return `Semana ${week} del ${seasonName}`
  }

  const getCycleDisplay = () => {
    if (!liturgicalDay.cycles) return null
    // cycles is an object like { sundaysYear: 'A', weekdaysCycle: '1', ... }
    const cycle = liturgicalDay.cycles.sundaysYear || liturgicalDay.cycles.weekdaysCycle
    if (!cycle) return null
    return `Año ${cycle}`
  }

  // Determine if we need white text (dark background seasons) or dark text (light backgrounds)
  const darkSeasons = ['ADVENT', 'LENT', 'EASTERTIDE']
  const isDarkSeason = darkSeasons.includes(liturgicalDay.liturgicalSeason)

  return (
    <header
      className={`${styles.container} ${isDarkSeason ? styles.darkText : styles.lightText}`}
    >
      <div className={styles.date}>{formatDate(selectedDate)}</div>
      <div className={styles.saintName}>{liturgicalDay.name}</div>
      <div className={styles.psaltery}>{getPsalterDisplay()}</div>
      {getCycleDisplay() && <div className={styles.cycle}>{getCycleDisplay()}</div>}
    </header>
  )
}
