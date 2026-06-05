import { createContext, useReducer, useCallback } from 'react'

export const LiturgicalContext = createContext()

const initialState = {
  selectedDate: new Date().toISOString().split('T')[0],
  liturgicalDay: null,
  selectedHour: null,
}

function liturgicalReducer(state, action) {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload }
    case 'SET_LITURGICAL_DAY':
      return { ...state, liturgicalDay: action.payload }
    case 'SET_HOUR':
      return { ...state, selectedHour: action.payload }
    default:
      return state
  }
}

export function LiturgicalProvider({ children }) {
  const [state, dispatch] = useReducer(liturgicalReducer, initialState)

  const setDate = useCallback((date) => {
    dispatch({ type: 'SET_DATE', payload: date })
  }, [])

  const setLiturgicalDay = useCallback((day) => {
    dispatch({ type: 'SET_LITURGICAL_DAY', payload: day })
  }, [])

  const setHour = useCallback((hour) => {
    dispatch({ type: 'SET_HOUR', payload: hour })
  }, [])

  const value = {
    ...state,
    setDate,
    setLiturgicalDay,
    setHour,
  }

  return <LiturgicalContext.Provider value={value}>{children}</LiturgicalContext.Provider>
}
