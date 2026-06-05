import { useContext } from 'react'
import { PreferencesContext } from '../contexts/PreferencesContext'
import styles from './FontSizeSelector.module.css'

const FONT_SIZES = [
  { value: 'small', label: 'Pequeño', description: '14px' },
  { value: 'normal', label: 'Normal', description: '16px' },
  { value: 'large', label: 'Grande', description: '18px' },
  { value: 'xl', label: 'Extra Grande', description: '20px' },
]

export default function FontSizeSelector() {
  const { fontSize, setFontSize } = useContext(PreferencesContext)

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize)
  }

  return (
    <div className={styles.container}>
      <h2>Tamaño de Fuente</h2>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Selecciona tu tamaño de fuente preferido:</legend>
        <div className={styles.options}>
          {FONT_SIZES.map((size) => (
            <div key={size.value} className={styles.option}>
              <input
                type="radio"
                id={`font-size-${size.value}`}
                name="font-size"
                value={size.value}
                checked={fontSize === size.value}
                onChange={(e) => handleFontSizeChange(e.target.value)}
                className={styles.input}
                aria-label={`${size.label} (${size.description})`}
              />
              <label htmlFor={`font-size-${size.value}`} className={styles.label}>
                <span className={styles.labelText}>{size.label}</span>
                <span className={styles.labelDescription}>{size.description}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Live region for screen reader announcements */}
      <div
        role="region"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        Tamaño de fuente cambiado a {FONT_SIZES.find((f) => f.value === fontSize)?.label}
      </div>
    </div>
  )
}
