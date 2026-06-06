import { useState, useEffect, useCallback, useRef } from 'react'
import { Romcal } from 'romcal'

interface Celebration {
  key: string
}

interface PsalteryInfo {
  week: number
}

interface LiturgicalDay {
  date: string
  name?: string
  liturgicalSeason?: string
  celebrations?: Celebration[]
  psaltery?: PsalteryInfo
}

interface UseLiturgicalDayReturn {
  day: LiturgicalDay | null
  loading: boolean
  error: string | null
}

const yearCache: Record<number, LiturgicalDay[]> = {}

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
        const calendar = await Romcal.calendarFor({
          year,
          country: 'costaRica',
          locale: 'es',
        })
        yearCache[year] = calendar
      }

      const calendar = yearCache[year]

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
        setDay({
          date: dateStr,
          name: 'Weekday',
          liturgicalSeason: 'ORDINARY_TIME',
          psaltery: { week: 1 },
        })
        setError(null)
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error loading liturgical day:', err)
        setError(err.message)
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
