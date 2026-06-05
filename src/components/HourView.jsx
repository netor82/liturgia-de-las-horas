import { useParams, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { LiturgicalContext } from '../contexts/LiturgicalContext'
import { resolveContent } from '../utils/contentResolver'
import LiturgicalHeader from './LiturgicalHeader'
import PrayerCard from './PrayerCard'
import AudioPlayer from './AudioPlayer'
import styles from './HourView.module.css'

export default function HourView() {
  const { date, hour } = useParams()
  const navigate = useNavigate()
  const { liturgicalDay } = useContext(LiturgicalContext)

  const [cards, setCards] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [liveRegion, setLiveRegion] = useState('')

  // Load prayer content
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
      setLiveRegion(`${cards[newIndex].title}, tarjeta ${newIndex + 1} de ${cards.length}`)
      window.scrollTo(0, 0)
    }
  }

  const handleNext = () => {
    if (cardIndex < cards.length - 1) {
      const newIndex = cardIndex + 1
      setCardIndex(newIndex)
      setLiveRegion(`${cards[newIndex].title}, tarjeta ${newIndex + 1} de ${cards.length}`)
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
      <LiturgicalHeader />

      <div className={styles.cardContainer}>
        <PrayerCard card={currentCard} index={cardIndex} total={cards.length} />
        <AudioPlayer text={currentCard?.content || ''} onCardChange={cardIndex} />
      </div>

      <nav className={styles.navigation} aria-label="Navegación de tarjetas">
        <button
          onClick={handlePrevious}
          disabled={cardIndex === 0}
          className={styles.navButton}
          aria-label="Tarjeta anterior"
        >
          ← Anterior
        </button>

        <div className={styles.progress}>
          {currentCard?.title} — {cardIndex + 1} de {cards.length}
        </div>

        <button
          onClick={handleNext}
          disabled={cardIndex === cards.length - 1}
          className={styles.navButton}
          aria-label="Tarjeta siguiente"
        >
          Siguiente →
        </button>
      </nav>

      <div className={styles.footer}>
        <button onClick={() => navigate(`/${date}`)} className={styles.backButton}>
          ← Volver a Horas
        </button>
      </div>

      {/* Live region for screen readers */}
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
