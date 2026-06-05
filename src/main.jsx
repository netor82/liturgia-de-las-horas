import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LiturgicalProvider } from './contexts/LiturgicalContext.jsx'
import { PreferencesProvider } from './contexts/PreferencesContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LiturgicalProvider>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
    </LiturgicalProvider>
  </React.StrictMode>,
)
