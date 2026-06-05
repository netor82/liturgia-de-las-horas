import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../hooks/useAudio'
import styles from './AudioPlayer.module.css'

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2]

export default function AudioPlayer({ text, onCardChange }) {
  const { isPlaying, isPaused, currentSpeed, isSupported, play, pause, stop, setSpeed } = useAudio()
  const textRef = useRef(text)
  const [announcement, setAnnouncement] = useState('')

  // Update text reference when text prop changes
  useEffect(() => {
    textRef.current = text
  }, [text])

  // Stop audio when card changes
  useEffect(() => {
    return () => {
      stop()
    }
  }, [text, stop])

  // Announce audio state changes to screen readers
  useEffect(() => {
    if (isPlaying && !isPaused) {
      setAnnouncement(`Reproducción de audio iniciada a velocidad ${currentSpeed}x`)
    } else if (isPaused) {
      setAnnouncement('Reproducción pausada')
    }
  }, [isPlaying, isPaused, currentSpeed])

  if (!isSupported) {
    return null
  }

  const handlePlayPause = () => {
    if (isPlaying || isPaused) {
      pause()
    } else {
      play(textRef.current)
    }
  }

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value)
    setSpeed(newSpeed)

    // If audio is playing, restart with new speed
    if (isPlaying) {
      stop()
      // Small delay to ensure speech synthesis is ready
      setTimeout(() => {
        play(textRef.current)
      }, 50)
    }
  }

  const getButtonLabel = () => {
    if (isPlaying && !isPaused) {
      return 'Pausar'
    }
    if (isPaused) {
      return 'Reanudar'
    }
    return 'Escuchar'
  }

  const getSpeedLabel = () => {
    return `${currentSpeed}x`
  }

  return (
    <>
      <div className={styles.container}>
        <button
          onClick={handlePlayPause}
          className={styles.playButton}
          aria-label={getButtonLabel()}
          title="Reproducir o pausar el audio de la oración"
        >
          {getButtonLabel()}
        </button>

        <div className={styles.speedContainer}>
          <label htmlFor="speed-select" className={styles.speedLabel}>
            Velocidad:
          </label>
          <select
            id="speed-select"
            value={currentSpeed}
            onChange={handleSpeedChange}
            className={styles.speedSelect}
            aria-label="Velocidad de reproducción de audio"
            title="Selecciona la velocidad de reproducción (0.75x a 2x)"
          >
            {SPEED_OPTIONS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live region for screen reader announcements */}
      <div
        role="region"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {announcement}
      </div>
    </>
  )
}
