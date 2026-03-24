import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function useSettings() {
  return useContext(SettingsContext)
}

export function SettingsProvider({ children }) {
  // Default settings
  const defaultSettings = {
    // Display Settings
    darkMode: true,
    accentColor: 'cyan', // cyan, purple, pink, blue
    animationSpeed: 'normal', // fast, normal, slow
    showStatusPanel: true,
    showOperatorPanel: true,
    showTelemetryCards: true,
    showCharts: true,
    showLogs: true,
    showOrientation: true,

    // Performance Settings
    dataRefreshRate: 1000, // milliseconds (1000, 2000, 5000, 10000)
    chartUpdateFrequency: 2000,
    dataHistoryLength: 500, // number of data points to keep
    enableGPUAcceleration: true,
    debugMode: false,

    // Localization Settings
    language: 'en', // en, es, fr
    temperatureUnit: 'celsius', // celsius, fahrenheit
    distanceUnit: 'km', // km, mi
    timeFormat: '24h', // 12h, 24h

    // Threshold Settings (existing)
    batteryThreshold: 10.5,
    signalThreshold: -80,
    mapTheme: 'dark',
    soundAlerts: true,
  }

  // Load settings from localStorage
  const loadSettingsFromStorage = () => {
    try {
      const saved = localStorage.getItem('roboticsSettings')
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch (error) {
      console.error('Error loading settings:', error)
      return defaultSettings
    }
  }

  // State for all settings
  const [settings, setSettings] = useState(loadSettingsFromStorage())

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('roboticsSettings', JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }, [settings])

  // Generic setter for any setting
  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Batch update multiple settings
  const updateSettings = (updates) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings)
  }

  // Export settings as JSON
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = `robotics-settings-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import settings from JSON
  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          setSettings((prev) => ({
            ...prev,
            ...imported,
          }))
          resolve('Settings imported successfully!')
        } catch (error) {
          reject('Invalid settings file format')
        }
      }
      reader.onerror = () => reject('Error reading file')
      reader.readAsText(file)
    })
  }

  const value = {
    // All settings
    ...settings,

    // Individual setters (for backward compatibility)
    updateSetting,
    updateSettings,
    resetToDefaults,
    exportSettings,
    importSettings,

    // Specific setters
    setBatteryThreshold: (val) => updateSetting('batteryThreshold', val),
    setSignalThreshold: (val) => updateSetting('signalThreshold', val),
    setMapTheme: (val) => updateSetting('mapTheme', val),
    setShowCharts: (val) => updateSetting('showCharts', val),
    setShowLogs: (val) => updateSetting('showLogs', val),
    setDarkMode: (val) => updateSetting('darkMode', val),
    setAccentColor: (val) => updateSetting('accentColor', val),
    setAnimationSpeed: (val) => updateSetting('animationSpeed', val),
    setLanguage: (val) => updateSetting('language', val),
    setTemperatureUnit: (val) => updateSetting('temperatureUnit', val),
    setDistanceUnit: (val) => updateSetting('distanceUnit', val),
    setTimeFormat: (val) => updateSetting('timeFormat', val),
    setDataRefreshRate: (val) => updateSetting('dataRefreshRate', val),
    setSoundAlerts: (val) => updateSetting('soundAlerts', val),
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}