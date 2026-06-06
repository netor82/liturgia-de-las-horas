interface LiturgicalDay {
  date: string
  name?: string
  liturgicalSeason?: string
  celebrations?: Array<{ key: string }>
  psaltery?: { week: number }
}

interface ContentCard {
  [key: string]: unknown
}

const contentCache: Record<string, ContentCard[]> = {}

function getCelebrationFilename(key: string): string {
  return key.toLowerCase().replace(/\s+/g, '_')
}

function getSeasonFilename(season: string): string {
  const seasonMap: Record<string, string> = {
    'ORDINARY_TIME': 'ordinary',
    'ADVENT': 'advent',
    'CHRISTMASTIDE': 'christmastide',
    'LENT': 'lent',
    'EASTERTIDE': 'eastertide',
  }
  return seasonMap[season] || 'ordinary'
}

export async function resolveContent(
  hourKey: string,
  liturgicalDay: LiturgicalDay
): Promise<ContentCard[]> {
  if (!hourKey || !liturgicalDay) {
    console.warn('resolveContent: missing hourKey or liturgicalDay')
    return []
  }

  const cacheKey = `${hourKey}-${liturgicalDay.date}`
  if (contentCache[cacheKey]) {
    return contentCache[cacheKey]
  }

  let cards: ContentCard[] = []

  try {
    if (liturgicalDay.celebrations && liturgicalDay.celebrations.length > 0) {
      const celebration = liturgicalDay.celebrations[0]
      const celebrationKey = getCelebrationFilename(celebration.key)

      try {
        const feastModule = await import(
          `../data/hours/${hourKey}/feasts/${celebrationKey}.json`
        )
        if (feastModule.default) {
          cards = feastModule.default
          contentCache[cacheKey] = cards
          return cards
        }
      } catch {
        // Feast not found, fall through to seasonal
      }
    }

    if (liturgicalDay.liturgicalSeason) {
      const seasonFilename = getSeasonFilename(liturgicalDay.liturgicalSeason)

      try {
        const seasonModule = await import(
          `../data/hours/${hourKey}/seasons/${seasonFilename}.json`
        )
        if (seasonModule.default) {
          cards = seasonModule.default
          contentCache[cacheKey] = cards
          return cards
        }
      } catch {
        // Season not found, fall through to psalter
      }
    }

    const psalterWeek = liturgicalDay.psaltery?.week || 1
    try {
      const psalterModule = await import(
        `../data/hours/${hourKey}/psalter/week-${psalterWeek}.json`
      )
      if (psalterModule.default) {
        cards = psalterModule.default
        contentCache[cacheKey] = cards
        return cards
      }
    } catch {
      console.warn(
        `resolveContent: could not load psalter week ${psalterWeek} for ${hourKey}`
      )
    }
  } catch (error) {
    console.error('resolveContent: unexpected error', error)
  }

  if (cards.length === 0) {
    console.warn(`resolveContent: no content found for ${hourKey} on ${liturgicalDay.date}`)
  }

  contentCache[cacheKey] = cards
  return cards
}
