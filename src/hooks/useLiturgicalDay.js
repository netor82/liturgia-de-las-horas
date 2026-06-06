import { useState, useEffect, useCallback, useRef } from 'react'
import { Romcal } from 'romcal';

// Cache for liturgical data by year to avoid redundant computation
const yearCache = {}

export function useLiturgicalDay(dateStr) {
  const [day, setDay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  const getLiturgicalDay = useCallback(async () => {
    if (!dateStr) {
      setDay(null)
      setLoading(false)
      return
    }

    // Cancel previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      const date = new Date(dateStr)
      const year = date.getFullYear()

      // Check cache first
      if (!yearCache[year]) {
        // Generate calendar for the year
        const romCal = new Romcal()

        const calendar = await romCal.generateCalendar(year)
        yearCache[year] = calendar
      }

      const calendar = yearCache[year]
      const foundDay = calendar[dateStr][0]


      if (foundDay) {
        console.log(foundDay)
        const extractedDay = {
          date: dateStr,
          name: 'Weekday',
          liturgicalSeason: foundDay.seasons[0],
          psaltery: { week: +foundDay.cycles.psalterWeek[5] }
        }
        setDay(extractedDay)
        console.log(extractedDay)
        setError(null)
      } else {
        // Fallback: create a generic day
        setDay({
          date: dateStr,
          name: 'Weekday',
          liturgicalSeason: 'ORDINARY_TIME',
          psaltery: { week: 1 },
        })
        setError(null)
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading liturgical day:', err)
        setError(err.message)
        // Set fallback day
        setDay({
          date: dateStr,
          name: 'Weekday',
          liturgicalSeason: 'ORDINARY_TIME',
          psaltery: { week: 1 },
        })
      }
    } finally {
      setLoading(false)
    }
  }, [dateStr])

  useEffect(() => {
    getLiturgicalDay()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [getLiturgicalDay])

  return { day, loading, error }
}
