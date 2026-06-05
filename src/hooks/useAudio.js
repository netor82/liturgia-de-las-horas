import { useState, useEffect, useRef } from 'react'

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSpeed, setCurrentSpeed] = useState(1)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef(null)

  useEffect(() => {
    // Check if Web Speech API is available
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
    setIsSupported(supported)
  }, [])

  const play = (text) => {
    if (!isSupported) return

    // Stop any existing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = currentSpeed

    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const pause = () => {
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
  }

  const stop = () => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  const setSpeed = (speed) => {
    setCurrentSpeed(speed)
    // If speech is currently playing, we need to restart it with new speed
    // This will be handled by the component using the hook
  }

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
