import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../hooks/useAudio'
import styles from './AudioPlayer.module.css'

interface AudioPlayerProps {
  text: string
  onCardChange: number
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2]

export default function AudioPlayer({ text, onCardChange }: AudioPlayerProps) {
  const { isPlaying, isPaused, currentSpeed, isSupported, play, pause, stop, setSpeed } =
    useAudio()
  const textRef = useRef(text)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    textRef.current = text
  }, [text])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [text, stop])

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

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseFloat(e.target.value)
    setSpeed(newSpeed)

    if (isPlaying) {
      stop()
      setTimeout(() => {
        play(textRef.current)
      }, 50)
    }
  }

  const getButtonLabel = () => {
    if (isPlaying && !isPaused) {
      return '▩'
    }
    if (isPaused) {
      return '▶'
    }
    return '▶'
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
