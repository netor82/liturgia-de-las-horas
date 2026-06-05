import { useState, useEffect, useCallback, useRef } from 'react'
import * as Romcal from 'romcal'

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
        const calendar = await Romcal.generateCalendar({
          year,
          locale: 'en',
        })
        yearCache[year] = calendar
      }

      const calendar = yearCache[year]

      // Find the day matching the date
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const dayNum = date.getDate().toString().padStart(2, '0')
      const dateKey = `${year}-${month}-${dayNum}`

      const foundDay = calendar.find((d) => {
        const dDate = new Date(d.date)
        const dDateStr = dDate.toISOString().split('T')[0]
        return dDateStr === dateKey
      })

      if (foundDay) {
        setDay(foundDay)
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
