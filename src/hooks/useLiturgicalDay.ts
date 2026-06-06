import { Romcal, LiturgicalCalendar, LiturgicalDay } from 'romcal'
import { CostaRica_Es } from '@romcal/calendar.costa-rica'
import { applyDayColor } from '../utils/liturgicalColors'

const yearCache: Record<number, LiturgicalCalendar> = {}

export async function useLiturgicalDay(dateStr: string): Promise<LiturgicalDay | null> {
  if (!dateStr) {
    return null
  }

  try {
    const date = new Date(dateStr)
    const year = date.getFullYear()

    if (!yearCache[year]) {
      const romcal = new Romcal({ localizedCalendar: CostaRica_Es })
      const calendar = await romcal.generateCalendar(year)
      yearCache[year] = calendar
    }

    const calendar = yearCache[year]
    const foundDay = calendar[dateStr]?.[0]

    if (foundDay) {
      applyDayColor(foundDay.colors[0])
      return foundDay
    }

    return null
  } catch (err) {
    console.error('Error loading liturgical day:', err)
    return null
  }
}
