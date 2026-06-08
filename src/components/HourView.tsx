import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { LiturgicalContext } from '../contexts/LiturgicalContext'
import { resolveContent } from '../utils/contentResolver'
import LiturgicalHeader from './LiturgicalHeader'
import PrayerCard from './PrayerCard'
import AudioPlayer from './AudioPlayer'
import FontSizeController from './FontSizeController'
import styles from './HourView.module.css'

interface ContentCard {
  type: string
  title: string
  content: string
}

export default function HourView() {
  const { date, hour } = useParams<{ date?: string; hour?: string }>()
  const navigate = useNavigate()
  const liturgicalCtx = useContext(LiturgicalContext)

  if (!liturgicalCtx) {
    throw new Error('LiturgicalContext must be provided')
  }

  const { liturgicalDay } = liturgicalCtx

  const [cards, setCards] = useState<ContentCard[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [liveRegion, setLiveRegion] = useState('')

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      try {
        if (hour && liturgicalDay) {
          const content = await resolveContent(hour, liturgicalDay)
          setCards(content || [])
          setCardIndex(0)
        }
      } catch (error) {
        console.error('Error loading prayer content:', error)
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [hour, liturgicalDay])

  const currentCard = cards[cardIndex]

  const handlePrevious = () => {
    if (cardIndex > 0) {
      const newIndex = cardIndex - 1
      setCardIndex(newIndex)
      setLiveRegion(
        `${cards[newIndex].title}, tarjeta ${newIndex + 1} de ${cards.length}`
      )
      window.scrollTo(0, 0)
    }
  }

  const handleNext = () => {
    if (cardIndex < cards.length - 1) {
      const newIndex = cardIndex + 1
      setCardIndex(newIndex)
      setLiveRegion(
        `${cards[newIndex].title}, tarjeta ${newIndex + 1} de ${cards.length}`
      )
      window.scrollTo(0, 0)
    }
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Cargando contenido litúrgico...</div>
      </main>
    )
  }

  if (cards.length === 0) {
    return (
      <main className={styles.container}>
        <LiturgicalHeader />
        <div className={styles.empty}>
          <p>Lo sentimos, el contenido de oración no está disponible para esta hora.</p>
          <button onClick={() => navigate(`/${date}`)} className={styles.backButton}>
            ← Volver a Horas
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.container}>

      <div className={styles.cardContainer}>
        <button onClick={() => navigate(`/${date}`)} className={styles.backButton}>
          ‹
        </button>
        <div className={styles.title}>
          <h2><span className="dayColor">●</span> Laudes</h2>
          <h3>Oración de la mañana</h3>
        </div>
        <AudioPlayer text={currentCard?.content || ''} onCardChange={cardIndex} />
      </div>
      <PrayerCard card={currentCard} />

      <nav className={styles.navigation} aria-label="Navegación de tarjetas">
        <button
          onClick={handlePrevious}
          disabled={cardIndex === 0}
          aria-label="Tarjeta anterior"
        >
          ←
        </button>

        <div className={styles.progress}>
          {cardIndex + 1} de {cards.length} { currentCard.title ? `— ${currentCard.title}` : null } 
        </div>

        <button
          onClick={handleNext}
          disabled={cardIndex === cards.length - 1}
          aria-label="Tarjeta siguiente"
        >
          →
        </button>
      </nav>

      <div className={styles.footer}>
        <FontSizeController />
      </div>

      <div
        role="region"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {liveRegion}
      </div>
    </main>
  )
}
