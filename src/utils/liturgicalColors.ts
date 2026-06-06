interface SeasonColor {
  hex: string
  name: string
}

const seasonColorMap: Record<string, SeasonColor> = {
  ORDINARY_TIME: {
    hex: '#2e7d32',
    name: 'ordinary-time',
  },
  ADVENT: {
    hex: '#6a1b9a',
    name: 'advent',
  },
  CHRISTMASTIDE: {
    hex: '#f0f0f0',
    name: 'christmastide',
  },
  LENT: {
    hex: '#5e35b1',
    name: 'lent',
  },
  EASTERTIDE: {
    hex: '#d4af37',
    name: 'eastertide',
  },
}

export function getSeasonColor(seasonName: string): SeasonColor {
  return seasonColorMap[seasonName] || seasonColorMap.ORDINARY_TIME
}

export function applySeasonColor(seasonName: string): void {
  const season = getSeasonColor(seasonName)
  const root = document.documentElement

  root.setAttribute('data-season', season.name)
  root.style.setProperty('--accent-color', season.hex)
}

export function getSeasonNameDisplay(seasonName: string): string {
  const nameMap: Record<string, string> = {
    ORDINARY_TIME: 'Tiempo Ordinario',
    ADVENT: 'Adviento',
    CHRISTMASTIDE: 'Navidad',
    LENT: 'Cuaresma',
    EASTERTIDE: 'Pascua',
  }
  return nameMap[seasonName] || 'Tiempo Ordinario'
}
