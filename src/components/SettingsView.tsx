import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { PreferencesContext } from '../contexts/PreferencesContext'
import FontSizeSelector from './FontSizeSelector'
import styles from './SettingsView.module.css'

export default function SettingsView() {
  const navigate = useNavigate()
  const preferencesCtx = useContext(PreferencesContext)

  if (!preferencesCtx) {
    throw new Error('PreferencesContext must be provided')
  }

  const { prefersDarkMode } = preferencesCtx

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Configuración</h1>
        <button
          onClick={() => navigate('/')}
          className={styles.backButton}
          aria-label="Volver a inicio"
        >
          ← Volver
        </button>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Accesibilidad</h2>

          <FontSizeSelector />

          <div className={styles.settingInfo}>
            <h3>Tema</h3>
            <p>
              El modo oscuro/claro se adapta automáticamente a tu preferencia del sistema
              operativo.
              {prefersDarkMode ? ' Actualmente: Modo Oscuro' : ' Actualmente: Modo Claro'}
            </p>
          </div>

          <div className={styles.settingInfo}>
            <h3>Navegación por Teclado</h3>
            <ul className={styles.list}>
              <li>
                <strong>Tab</strong> - Navega entre elementos interactivos
              </li>
              <li>
                <strong>Enter/Espacio</strong> - Activa botones
              </li>
              <li>
                <strong>Flechas</strong> - Navega opciones en menús desplegables
              </li>
              <li>
                <strong>Escape</strong> - Cierra menús y tooltips
              </li>
            </ul>
          </div>

          <div className={styles.settingInfo}>
            <h3>Lector de Pantalla</h3>
            <p>
              Esta aplicación es totalmente compatible con lectores de pantalla. Todos los
              elementos interactivos tienen etiquetas descriptivas y los cambios dinámicos se
              anuncian automáticamente.
            </p>
          </div>

          <div className={styles.settingInfo}>
            <h3>Audio</h3>
            <p>
              Puedes reproducir la oración a través de síntesis de voz en navegadores modernos.
              Los controles de audio incluyen opciones de velocidad (0.75x a 2x).
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Acerca de</h2>
          <div className={styles.settingInfo}>
            <p>
              <strong>Liturgia de las Horas</strong> es una aplicación contemplativa para rezar
              la Liturgia de las Horas en español.
            </p>
            <p>
              Detalles técnicos:
            </p>
            <ul className={styles.list}>
              <li>React 18+ con Vite</li>
              <li>Calendario litúrgico con romcal</li>
              <li>Síntesis de voz mediante Web Speech API</li>
              <li>100% compatible con WCAG AA</li>
              <li>Funcionamiento completamente offline</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
