// Content resolution with priority: feast > season > psalter

const contentCache = {}

// Helper function to get the filename for a celebration key
function getCelebrationFilename(key) {
  // Convert romcal keys (like 'sacred_heart_of_jesus') to filenames
  return key.toLowerCase().replace(/\s+/g, '_')
}

// Helper function to get the season name as a filename
function getSeasonFilename(season) {
  const seasonMap = {
    'ORDINARY_TIME': 'ordinary',
    'ADVENT': 'advent',
    'CHRISTMASTIDE': 'christmastide',
    'LENT': 'lent',
    'EASTERTIDE': 'eastertide',
  }
  return seasonMap[season] || 'ordinary'
}

export async function resolveContent(hourKey, liturgicalDay) {
  if (!hourKey || !liturgicalDay) {
    console.warn('resolveContent: missing hourKey or liturgicalDay')
    return []
  }

  const cacheKey = `${hourKey}-${liturgicalDay.date}`
  if (contentCache[cacheKey]) {
    return contentCache[cacheKey]
  }

  let cards = []

  try {
    // 1. Try to load feast-specific content
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
      } catch (e) {
        // Feast not found, fall through to seasonal
      }
    }

    // 2. Try to load seasonal content
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
      } catch (e) {
        // Season not found, fall through to psalter
      }
    }

    // 3. Fall back to psalter
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
    } catch (e) {
      console.warn(
        `resolveContent: could not load psalter week ${psalterWeek} for ${hourKey}`,
        e
      )
    }
  } catch (error) {
    console.error('resolveContent: unexpected error', error)
  }

  // Return cached empty result
  if (cards.length === 0) {
    console.warn(`resolveContent: no content found for ${hourKey} on ${liturgicalDay.date}`)
  }

  contentCache[cacheKey] = cards
  return cards
}
