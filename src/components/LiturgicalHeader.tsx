import { useContext } from 'react'
import { LiturgicalContext } from '../contexts/LiturgicalContext'
import { Rank } from 'romcal'
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
    if (!liturgicalDay) return null

    const psalter = liturgicalDay.cycles?.psalterWeek[5] ?? 1
    const week = liturgicalDay.calendar?.weekOfSeason ?? 1
    const seasonName = liturgicalDay.seasonNames[0]
    const cycle = (liturgicalDay.rank == 'WEEKDAY') ? 
      'Año ' + liturgicalDay.cycles?.weekdayCycle[5] :
      'Ciclo ' + liturgicalDay.cycles?.sundayCycle[5];
    return `${seasonName}. Semana ${week}. Salterio ${psalter}. ${cycle}.`
  }


  return (
    <header className={`${styles.container} `}>
      <h1>{formatDate(liturgicalDay.date)}</h1>
      <h2>{liturgicalDay.name}</h2>
      <h3><span className="dayColor">●</span> {getPsalterDisplay()}</h3>
    </header>
  )
}
