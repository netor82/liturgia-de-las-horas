import { useState, useEffect, useCallback, useRef } from 'react'
import { Romcal, LiturgicalCalendar, LiturgicalDay } from 'romcal'
import { CostaRica_Es } from '@romcal/calendar.costa-rica'

interface UseLiturgicalDayReturn {
  day: LiturgicalDay | null
  loading: boolean
  error: string | null
}

const yearCache: Record<number, LiturgicalCalendar> = {}

export function useLiturgicalDay(dateStr: string): UseLiturgicalDayReturn {
  const [day, setDay] = useState<LiturgicalDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const getLiturgicalDay = useCallback(async () => {
    if (!dateStr) {
      setDay(null)
      setLoading(false)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      setLoading(true)
      const date = new Date(dateStr)
      const year = date.getFullYear()

      if (!yearCache[year]) {
        const romcal = new Romcal({ localizedCalendar: CostaRica_Es })
        const calendar = await romcal.generateCalendar(year);
        yearCache[year] = calendar
      }

      const calendar = yearCache[year]
      const foundDay = calendar[dateStr][0]

      if (foundDay) {
        console.info('date found', dateStr, CostaRica_Es, foundDay)
        setDay(foundDay)
        setError(null)
      } else {
        setDay(null)
        setError(`Date ${dateStr} not found`)
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error loading liturgical day:', err)
        setDay(null)
        setError(err.message)
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
