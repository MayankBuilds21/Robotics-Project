import { createContext, useContext, useState } from 'react'

const SettingsContext = createContext()

export function useSettings() {
  return useContext(SettingsContext)
}

export function SettingsProvider({ children }) {
  const [batteryThreshold, setBatteryThreshold] = useState(10.5)
  const [signalThreshold, setSignalThreshold] = useState(-80)
  const [mapTheme, setMapTheme] = useState('dark')
  const [showCharts, setShowCharts] = useState(true)
  const [showLogs, setShowLogs] = useState(true)

  return (
    <SettingsContext.Provider value={{
      batteryThreshold,
      setBatteryThreshold,
      signalThreshold,
      setSignalThreshold,
      mapTheme,
      setMapTheme,
      showCharts,
      setShowCharts,
      showLogs,
      setShowLogs,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}