import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAudioReturn {
  isPlaying: boolean
  isPaused: boolean
  currentSpeed: number
  isSupported: boolean
  play: (text: string) => void
  pause: () => void
  stop: () => void
  setSpeed: (speed: number) => void
}

export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSpeed, setCurrentSpeed] = useState(1)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
    setIsSupported(supported)
  }, [])

  const play = useCallback((text: string) => {
    if (!isSupported) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = currentSpeed
    utterance.volume = 1

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = (e) => {
      setIsPlaying(false)
      setIsPaused(false)
      console.error('Speech error:', e)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isSupported, currentSpeed])

  const pause = useCallback(() => {
    if (!isSupported) return

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
      setIsPlaying(false)
    }
  }, [isSupported])

  const stop = useCallback(() => {
    if (!isSupported) return

    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }, [isSupported])

  const setSpeed = useCallback((speed: number) => {
    setCurrentSpeed(speed)
  }, [])

  return {
    isPlaying,
    isPaused,
    currentSpeed,
    isSupported,
    play,
    pause,
    stop,
    setSpeed,
  }
}
