import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { LiturgicalContext } from './contexts/LiturgicalContext'
import { useLiturgicalDay } from './hooks/useLiturgicalDay'
import { applySeasonColor } from './utils/liturgicalColors'
import HourSelector from './components/HourSelector'
import HourView from './components/HourView'
import CalendarView from './components/CalendarView'

function AppContent() {
  const location = useLocation()
  const { setLiturgicalDay } = useContext(LiturgicalContext)

  // Extract date from URL if present
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const dateFromUrl = pathSegments[0] || new Date().toISOString().split('T')[0]
  const hourFromUrl = pathSegments[1] || null

  const { day, loading } = useLiturgicalDay(dateFromUrl)

  // Update context and apply season color when day changes
  useEffect(() => {
    if (day) {
      setLiturgicalDay(day)
      // Apply season color if available
      if (day.liturgicalSeason) {
        applySeasonColor(day.liturgicalSeason)
      }
    }
  }, [day, setLiturgicalDay])

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading liturgical data...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<HourSelector />} />
      <Route path="/:date" element={<HourSelector />} />
      <Route path="/:date/:hour" element={<HourView />} />
      <Route path="/calendario" element={<CalendarView />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
