import { createContext, useReducer, useCallback, ReactNode } from 'react'
import { LiturgicalDay } from 'romcal'

interface LiturgicalState {
  selectedDate: string
  liturgicalDay: LiturgicalDay | null
  selectedHour: string | null
  loading: boolean
}

interface LiturgicalContextType extends LiturgicalState {
  setDate: (date: string) => void
  setLiturgicalDay: (day: LiturgicalDay) => void
  setHour: (hour: string) => void
  setLoading: (loadingState: boolean) => void
}

export const LiturgicalContext = createContext<LiturgicalContextType | undefined>(undefined)

const initialState: LiturgicalState = {
  selectedDate: new Date().toISOString().split('T')[0],
  liturgicalDay: null,
  selectedHour: null,
  loading: true
}

type LiturgicalAction =
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_LITURGICAL_DAY'; payload: LiturgicalDay }
  | { type: 'SET_HOUR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }

function liturgicalReducer(state: LiturgicalState, action: LiturgicalAction): LiturgicalState {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload }
    case 'SET_LITURGICAL_DAY':
      return { ...state, liturgicalDay: action.payload }
    case 'SET_HOUR':
      return { ...state, selectedHour: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload}
    default:
      return state
  }
}

interface LiturgicalProviderProps {
  children: ReactNode
}

export function LiturgicalProvider({ children }: LiturgicalProviderProps) {
  const [state, dispatch] = useReducer(liturgicalReducer, initialState)

  const setDate = useCallback((date: string) => {
    dispatch({ type: 'SET_DATE', payload: date })
  }, [])

  const setLiturgicalDay = useCallback((day: LiturgicalDay) => {
    dispatch({ type: 'SET_LITURGICAL_DAY', payload: day })
  }, [])

  const setHour = useCallback((hour: string) => {
    dispatch({ type: 'SET_HOUR', payload: hour })
  }, [])

  const setLoading = useCallback((loadingState: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loadingState})
  }, [])

  const value: LiturgicalContextType = {
    ...state,
    setDate,
    setLiturgicalDay,
    setHour,
    setLoading
  }

  return <LiturgicalContext.Provider value={value}>{children}</LiturgicalContext.Provider>
}
