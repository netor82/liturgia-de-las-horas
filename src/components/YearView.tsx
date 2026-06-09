import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Romcal, LiturgicalCalendar, LiturgicalDay } from 'romcal'
import { CostaRica_Es } from '@romcal/calendar.costa-rica'
import { getColorClassName } from '../utils/colorResolver'
import styles from './YearView.module.css'

const yearCache: Record<number, LiturgicalCalendar> = {}

interface YearDayData {
  dateStr: string
  day: number
  month: number
  liturgicalDay: LiturgicalDay
  season: string
}

export default function YearView() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [seasonNames, setSeasonNames] = useState<string[]>([])
  const [elementsToRender, setElementsToRender] = useState<React.JSX.Element[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadYearData = async () => {
      setLoading(true)

      if (!yearCache[year]) {
        const romcal = new Romcal({ localizedCalendar: CostaRica_Es })
        const calendar = await romcal.generateCalendar(year)
        yearCache[year] = calendar
      }

      const calendar = yearCache[year]
      const data: YearDayData[] = []

      const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
      const daysInYear = isLeapYear(year) ? 366 : 365

      for (let i = 0; i < daysInYear; i++) {
        const date = new Date(year, 0, 1 + i)
        const dateStr = date.toISOString().split('T')[0]

        const liturgicalDays = calendar[dateStr]
        if (liturgicalDays && liturgicalDays.length > 0) {
          const season = liturgicalDays[0].seasonNames?.[0] || 'Ordinario'
          data.push({
            dateStr,
            day: date.getDate(),
            month: date.getMonth() + 1,
            liturgicalDay: liturgicalDays[0],
            season,
          })
        }
      }

      const includeTitleElement = (seasonName:string, result: React.JSX.Element[]) => {
        result.push(
          <div className={`${styles.h4Container} h4Container`}>
            <h4 id={`season-${seasonName.toLowerCase().replace(/\s+/g, '-')}`}>
              {seasonName}
            </h4>
            <span></span>
          </div>
        )
      }

      let currentSeason = '';
      const currentSeasonNames: string[] = [];
      var elements: React.JSX.Element[] = []

      data.forEach(dayData => {
        if (currentSeason != dayData.season)
        {
          if (currentSeason != '') {
            elements.push(creteGoToTop())
          }

          currentSeason = dayData.season
          if (!currentSeasonNames.includes(currentSeason)){
            currentSeasonNames.push(currentSeason)
            includeTitleElement(currentSeason, elements)
          }
          else {
            const currentSeason2 = `${currentSeason} ${currentSeason == 'Navidad' ? year+1 : 'II'}`
            if (!currentSeasonNames.includes(currentSeason2)) {
              currentSeasonNames.push(currentSeason2)
              includeTitleElement(currentSeason2, elements)
            }
          }
        }

        const dateStr = dayData.dateStr
        const displayDate = `${String(dayData.day).padStart(2, '0')} ${new Date(dateStr).toLocaleString('es-ES', { month: 'short' })}`
        const dayName = dayData.liturgicalDay.name || 'Día ordinario'
        const color = getColorClassName(dayData.liturgicalDay)

        elements.push (
          <div
            key={dateStr}
            className={styles.dayItem}
            aria-label={`${dayName}, ${displayDate}`}
          >
            <span className={styles.dateText}>
              <span className={color} aria-hidden="true">●</span> {displayDate}
            </span>
            <span className={styles.nameText}>{dayName}</span>
          </div>
        )
      })
      setSeasonNames(currentSeasonNames)
      setElementsToRender(elements)
      setLoading(false)
    }

    loadYearData()
  }, [year])

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value))
  }

  const creteGoToTop = () => {
    return (<button
        onClick={() => {
          const element = document.getElementById('top')
          element?.scrollIntoView({ behavior: 'smooth' })
        }}
        aria-label={`Ir arriba`}
      >↑ Ir arriba
      </button>)
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 9 }, (_, i) => currentYear - 4 + i)

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
      </div>
    )
  }

  return (
    <main className={styles.container}>
      <div className='titleContainer'>
        <button onClick={() => navigate(`/`)} className='backButton'>
          ‹
        </button>
        <h1 id='top' className='title'>Año Litúrgico</h1>
        <select
          className={styles.yearSelect}
          value={year}
          onChange={handleYearChange}
          aria-label="Seleccionar año litúrgico"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="home-rule">✦</div>

      {seasonNames.length > 0 && (
        <nav className={styles.seasonNav} aria-label="Saltar a temporadas">
        {seasonNames.map((season) => (
          <button
            onClick={() => {
              const element = document.getElementById(
                `season-${season.toLowerCase().replace(/\s+/g, '-')}`
              )
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            aria-label={`Ir a ${season}`}
          >
            {season}
          </button>
        ))}
        </nav>
      )}

      <div className={styles.seasonsList}>
        {elementsToRender}
        {creteGoToTop()}
      </div>
    </main>
  )
}
