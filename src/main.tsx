import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LiturgicalProvider } from './contexts/LiturgicalContext'
import { PreferencesProvider } from './contexts/PreferencesContext'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <LiturgicalProvider>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </LiturgicalProvider>
  </React.StrictMode>,
)
