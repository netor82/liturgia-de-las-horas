interface HourInfo {
  displayName: string
  time: string
  rank: number
  span: number
}

const hourTimes: Record<string, HourInfo> = {
  'oficio-de-lectura': {
    displayName: 'Oficio de Lectura',
    time: '6:00 AM',
    rank: 1,
    span: 3
  },
  laudes: {
    displayName: 'Laudes',
    time: '6:00 AM',
    rank: 2,
    span: 3
  },
  tercia: {
    displayName: 'Tercia',
    time: '9:00 AM',
    rank: 3,
    span: 1
  },
  sexta: {
    displayName: 'Sexta',
    time: '12:00 PM',
    rank: 4,
    span: 1
  },
  nona: {
    displayName: 'Nona',
    time: '3:00 PM',
    rank: 5,
    span: 1
  },
  visperas: {
    displayName: 'Vísperas',
    time: '6:00 PM',
    rank: 6,
    span: 3
  },
  completas: {
    displayName: 'Completas',
    time: '9:00 PM',
    rank: 7,
    span: 3
  },
}

export function getHourDisplayName(hourKey: string): string {
  return hourTimes[hourKey]?.displayName || hourKey
}

export function getHourTime(hourKey: string): string {
  return hourTimes[hourKey]?.time || '--:-- --'
}

export function getNearestHour(): string {
  const now = new Date()
  const hour = now.getHours()

  if (hour < 9) return 'laudes'
  if (hour < 12) return 'tercia'
  if (hour < 15) return 'sexta'
  if (hour < 18) return 'nona'
  if (hour < 21) return 'visperas'
  return 'completas'
}

export function getAllHours(): (HourInfo & { key: string })[] {
  return Object.entries(hourTimes).map(([key, data]) => ({
    key,
    ...data,
  }))
}
