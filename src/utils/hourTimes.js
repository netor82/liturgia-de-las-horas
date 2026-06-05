// Traditional canonical hour times
export const hourTimes = {
  'oficio-de-lectura': {
    displayName: 'Oficio de Lectura',
    time: '6:00 AM',
    rank: 1,
  },
  laudes: {
    displayName: 'Laudes',
    time: '6:00 AM',
    rank: 2,
  },
  tercia: {
    displayName: 'Tercia',
    time: '9:00 AM',
    rank: 3,
  },
  sexta: {
    displayName: 'Sexta',
    time: '12:00 PM',
    rank: 4,
  },
  nona: {
    displayName: 'Nona',
    time: '3:00 PM',
    rank: 5,
  },
  visperas: {
    displayName: 'Vísperas',
    time: '6:00 PM',
    rank: 6,
  },
  completas: {
    displayName: 'Completas',
    time: '9:00 PM',
    rank: 7,
  },
}

export function getHourDisplayName(hourKey) {
  return hourTimes[hourKey]?.displayName || hourKey
}

export function getHourTime(hourKey) {
  return hourTimes[hourKey]?.time || '--:-- --'
}

export function getNearestHour() {
  const now = new Date()
  const hour = now.getHours()

  // Map hour of day to canonical hour
  if (hour < 9) return 'oficio-de-lectura'
  if (hour < 12) return 'tercia'
  if (hour < 15) return 'sexta'
  if (hour < 18) return 'nona'
  if (hour < 21) return 'visperas'
  return 'completas'
}

export function getAllHours() {
  return Object.keys(hourTimes)
}
