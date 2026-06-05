import { createContext, useReducer, useCallback, useEffect } from 'react'

export const PreferencesContext = createContext()

const initialState = {
  fontSize: 'normal',
  prefersDarkMode: false,
}

function preferencesReducer(state, action) {
  switch (action.type) {
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload }
    case 'SET_DARK_MODE':
      return { ...state, prefersDarkMode: action.payload }
    case 'INIT_FROM_STORAGE':
      return action.payload
    default:
      return state
  }
}

export function PreferencesProvider({ children }) {
  const [state, dispatch] = useReducer(preferencesReducer, initialState)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('preferences')
    if (stored) {
      try {
        dispatch({ type: 'INIT_FROM_STORAGE', payload: JSON.parse(stored) })
      } catch (e) {
        console.warn('Failed to load preferences:', e)
      }
    }

    // Check system dark mode preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    dispatch({ type: 'SET_DARK_MODE', payload: darkModeQuery.matches })

    // Listen for dark mode changes
    const handler = (e) => dispatch({ type: 'SET_DARK_MODE', payload: e.matches })
    darkModeQuery.addEventListener('change', handler)

    return () => darkModeQuery.removeEventListener('change', handler)
  }, [])

  // Persist fontSize to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fontSize', state.fontSize)
  }, [state.fontSize])

  // Persist all preferences
  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(state))
  }, [state])

  // Apply font size class to document
  useEffect(() => {
    const html = document.documentElement
    html.className = `font-${state.fontSize}`
  }, [state.fontSize])

  const setFontSize = useCallback((size) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size })
  }, [])

  const value = {
    ...state,
    setFontSize,
  }

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}
