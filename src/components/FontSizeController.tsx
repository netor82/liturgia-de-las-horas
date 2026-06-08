import { useContext } from 'react'
import { PreferencesContext } from '../contexts/PreferencesContext'
import styles from './FontSizeController.module.css'

export default function FontSizeController() {
  const preferencesCtx = useContext(PreferencesContext)

  if (!preferencesCtx) {
    throw new Error('PreferencesContext must be provided')
  }

  const { fontSize, setFontSize } = preferencesCtx

  const decreaseFontSize = () => {
    const sizes: Array<'sm' | 'normal' | 'lg' | 'xl'> = ['sm', 'normal', 'lg', 'xl']
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1])
    }
  }

  const increaseFontSize = () => {
    const sizes: Array<'sm' | 'normal' | 'lg' | 'xl'> = ['sm', 'normal', 'lg', 'xl']
    const currentIndex = sizes.indexOf(fontSize)
    if (currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1])
    }
  }

  return (
    <div className={styles.fontSizeControls}>
      <button
        onClick={decreaseFontSize}
        disabled={fontSize === 'sm'}
        className={styles.fontButton}
        aria-label="Disminuir tamaño de fuente"
      >
        A-
      </button>
      <button
        onClick={increaseFontSize}
        disabled={fontSize === 'xl'}
        className={styles.fontButton}
        aria-label="Aumentar tamaño de fuente"
      >
        A+
      </button>
    </div>
  )
}
