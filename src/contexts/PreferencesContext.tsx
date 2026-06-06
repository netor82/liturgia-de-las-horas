import { createContext, useReducer, useCallback, useEffect, ReactNode } from 'react'

type FontSize = 'small' | 'normal' | 'large' | 'xl'

interface PreferencesState {
  fontSize: FontSize
  prefersDarkMode: boolean
}

interface PreferencesContextType extends PreferencesState {
  setFontSize: (size: FontSize) => void
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

const initialState: PreferencesState = {
  fontSize: 'normal',
  prefersDarkMode: false,
}

type PreferencesAction =
  | { type: 'SET_FONT_SIZE'; payload: FontSize }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'INIT_FROM_STORAGE'; payload: PreferencesState }

function preferencesReducer(state: PreferencesState, action: PreferencesAction): PreferencesState {
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

interface PreferencesProviderProps {
  children: ReactNode
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [state, dispatch] = useReducer(preferencesReducer, initialState)

  useEffect(() => {
    const stored = localStorage.getItem('preferences')
    if (stored) {
      try {
        dispatch({ type: 'INIT_FROM_STORAGE', payload: JSON.parse(stored) })
      } catch {
        console.warn('Failed to load preferences')
      }
    }

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    dispatch({ type: 'SET_DARK_MODE', payload: darkModeQuery.matches })

    const handler = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_DARK_MODE', payload: e.matches })
    }
    darkModeQuery.addEventListener('change', handler)

    return () => darkModeQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    localStorage.setItem('fontSize', state.fontSize)
  }, [state.fontSize])

  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const html = document.documentElement
    html.className = `font-${state.fontSize}`
  }, [state.fontSize])

  const setFontSize = useCallback((size: FontSize) => {
    dispatch({ type: 'SET_FONT_SIZE', payload: size })
  }, [])

  const value: PreferencesContextType = {
    ...state,
    setFontSize,
  }

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}
