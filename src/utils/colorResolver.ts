import { LiturgicalDay } from 'romcal'

export const getColorClassName = (liturgicalDay: LiturgicalDay): string => {
  let color = liturgicalDay.colors?.[0]?.toLowerCase() || 'green'
  color = color[0].toUpperCase() + color.substring(1)
  return 'color' + color;
}

