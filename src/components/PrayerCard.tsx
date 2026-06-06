import { useState, useRef, useEffect } from 'react'
import styles from './PrayerCard.module.css'

interface ContentCard {
  type: string
  title: string
  content: string
}

interface PrayerCardProps {
  card: ContentCard | null
  index?: number
  total?: number
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  invitatorio: 'Oración de apertura que nos invita a la alabanza',
  himno: 'Poesía cantada para celebrar la hora',
  salmodia: 'Salmos y cánticos del Antiguo Testamento',
  'lectura-breve': 'Lectura corta de la Escritura',
  'lectura-primera': 'Primera lectura, generalmente larga',
  'lectura-segunda': 'Segunda lectura, generalmente patrística',
  responsorio: 'Respuesta meditativa a la lectura',
  benedictus: 'Cántico de Zacarías (Lucas 1:68-79)',
  magnificat: 'Cántico de María (Lucas 1:46-55)',
  'nunc-dimittis': 'Cántico de Simeón (Lucas 2:29-32)',
  'himno-conclusivo': 'Himno que concluye esta hora',
  preces: 'Intercesiones y peticiones',
  'padre-nuestro': 'El Padre Nuestro',
  oracion: 'Oración conclusiva del día',
  conclusion: 'Bendición y despedida',
}

export default function PrayerCard({ card, index, total }: PrayerCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  if (!card) {
    return null
  }

  const description = SECTION_DESCRIPTIONS[card.type] || 'Sección de oración'

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showTooltip) {
        setShowTooltip(false)
      }
    }

    if (showTooltip) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showTooltip])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false)
      }
    }

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTooltip])

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{card.title}</h3>
        <div className={styles.infoContainer} ref={tooltipRef}>
          <button
            className={styles.infoIcon}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label={`Información sobre ${card.title}`}
            aria-expanded={showTooltip}
            aria-describedby={showTooltip ? 'info-tooltip' : undefined}
          >
            ℹ️
          </button>
          {showTooltip && (
            <div id="info-tooltip" className={styles.tooltip} role="tooltip">
              {description}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {card.content.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {index !== undefined && total !== undefined && (
        <div className={styles.progress}>
          {card.title} — {index + 1} de {total}
        </div>
      )}
    </article>
  )
}
