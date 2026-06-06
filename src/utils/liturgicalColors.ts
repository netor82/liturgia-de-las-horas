
export function applyDayColor(seasonName: string): void {
  const root = document.documentElement
  root.setAttribute('data-day-color', seasonName)
}

