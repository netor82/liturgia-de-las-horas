import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import HourSelector from './components/HourSelector'
import HourView from './components/HourView'
import CalendarView from './components/CalendarView'
import YearView from './components/YearView'
import SettingsView from './components/SettingsView'

function AppContent() {

  return (
    <Routes>
      <Route path="/" element={<HourSelector />} />
      <Route path="/calendario" element={<CalendarView />} />
      <Route path="/anno" element={<YearView />} />
      <Route path="/configuracion" element={<SettingsView />} />
      <Route path="/:date" element={<HourSelector />} />
      <Route path="/:date/:hour" element={<HourView />} />
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
