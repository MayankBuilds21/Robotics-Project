import { useState, useRef, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'

export default function SettingsPage({ operator }) {
  const {
    darkMode,
    setDarkMode,
    accentColor,
    setAccentColor,
    animationSpeed,
    setAnimationSpeed,
    showStatusPanel,
    updateSetting,
    showOperatorPanel,
    showTelemetryCards,
    showCharts,
    setShowCharts,
    showLogs,
    setShowLogs,
    showOrientation,
    dataRefreshRate,
    dataHistoryLength,
    enableGPUAcceleration,
    debugMode,
    language,
    setLanguage,
    temperatureUnit,
    setTemperatureUnit,
    distanceUnit,
    setDistanceUnit,
    timeFormat,
    setTimeFormat,
    batteryThreshold,
    setBatteryThreshold,
    signalThreshold,
    setSignalThreshold,
    mapTheme,
    setMapTheme,
    soundAlerts,
    setSoundAlerts,
    resetToDefaults,
    exportSettings,
    importSettings,
  } = useSettings()

  const [activeTab, setActiveTab] = useState('display')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const colorMap = {
      cyan: { primary: '#22d3ee', secondary: '#06b6d4', rgb: '34, 211, 238' },
      purple: { primary: '#a855f7', secondary: '#9333ea', rgb: '168, 85, 247' },
      pink: { primary: '#ec4899', secondary: '#db2777', rgb: '236, 72, 153' },
      blue: { primary: '#3b82f6', secondary: '#2563eb', rgb: '59, 130, 246' },
    }

    const colors = colorMap[accentColor] || colorMap.cyan

    document.documentElement.style.setProperty('--color-accent', colors.primary)
    document.documentElement.style.setProperty('--color-accent-dark', colors.secondary)
    document.documentElement.style.setProperty('--color-accent-rgb', colors.rgb)
  }, [accentColor])

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await importSettings(file)
      setImportMessage('✅ Settings imported successfully!')
      setTimeout(() => setImportMessage(''), 3000)
    } catch (error) {
      setImportMessage(`❌ ${error}`)
      setTimeout(() => setImportMessage(''), 3000)
    }
  }

  const tabs = [
    { id: 'display', label: 'Display', icon: '🎨', description: 'Theme & UI' },
    { id: 'performance', label: 'Performance', icon: '⚡', description: 'System' },
    { id: 'localization', label: 'Localization', icon: '🌍', description: 'Language' },
    { id: 'thresholds', label: 'Thresholds', icon: '⚙️', description: 'Alerts' },
    { id: 'data', label: 'Data', icon: '💾', description: 'Export/Import' },
  ]

  const colorOptions = [
    { value: 'cyan', label: 'Cyan', bg: 'from-cyan-400 to-cyan-600' },
    { value: 'purple', label: 'Purple', bg: 'from-purple-400 to-purple-600' },
    { value: 'pink', label: 'Pink', bg: 'from-pink-400 to-pink-600' },
    { value: 'blue', label: 'Blue', bg: 'from-blue-400 to-blue-600' },
  ]

  const speedOptions = [
    { value: 'fast', label: 'Fast', desc: '0.3s' },
    { value: 'normal', label: 'Normal', desc: '0.6s' },
    { value: 'slow', label: 'Smooth', desc: '1.0s' },
  ]

  const languageOptions = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'fr', label: '🇫🇷 Français' },
  ]

  const renderDisplayTab = () => (
    <div className="space-y-6">
      {/* Dark Mode Toggle */}
      <div className="setting-card-content">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🌙</div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">Dark Mode</h3>
              <p className="text-sm text-slate-400">Switch between dark and light theme</p>
            </div>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="hidden"
          />
          <div className={`toggle-bg ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' : 'bg-slate-800'}`}>
            <div className={`toggle-thumb ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </div>
          <span className={`toggle-label ${darkMode ? 'text-emerald-400' : 'text-slate-400'}`}>
            {darkMode ? 'Dark' : 'Light'}
          </span>
        </label>
      </div>

      {/* Accent Color Selection */}
      <div className="setting-card-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">🎨 Accent Color</h3>
          <p className="text-sm text-slate-400">Choose your preferred accent color - this will change the primary color throughout the entire app</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                accentColor === color.value
                  ? 'border-white shadow-lg shadow-white/50 ring-2 ring-white/30'
                  : 'border-transparent hover:border-white/30'
              }`}
            >
              <div className={`bg-gradient-to-br ${color.bg} h-12 rounded mb-2 shadow-lg transform transition-transform hover:scale-110`}></div>
              <p className={`text-sm font-bold text-center ${
                accentColor === color.value ? 'text-white' : 'text-slate-300'
              }`}>{color.label}</p>
              {accentColor === color.value && <p className="text-xs text-center text-emerald-400 mt-1">✓ Selected</p>}
            </button>
          ))}
        </div>
        
        {/* Live Preview */}
        <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-cyan-500/20">
          <p className="text-xs text-slate-500 mb-2">LIVE PREVIEW:</p>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded text-white font-bold text-sm" style={{
              backgroundImage: `linear-gradient(to right, var(--color-accent), var(--color-accent-dark))`,
            }}>
              Primary Button
            </div>
            <div className="px-4 py-2 rounded border-2 text-sm font-bold" style={{
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)',
            }}>
              Secondary Button
            </div>
          </div>
        </div>
      </div>

      {/* Animation Speed */}
      <div className="setting-card-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">⏱️ Animation Speed</h3>
          <p className="text-sm text-slate-400">Control UI animation duration</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {speedOptions.map((speed) => (
            <button
              key={speed.value}
              onClick={() => setAnimationSpeed(speed.value)}
              className={`p-3 rounded-lg border transition-all ${
                animationSpeed === speed.value
                  ? 'bg-cyan-500/20 border-cyan-400'
                  : 'bg-slate-800/30 border-slate-700 hover:border-cyan-400/50'
              }`}
            >
              <p className="text-sm font-semibold text-cyan-400">{speed.label}</p>
              <p className="text-xs text-slate-400">{speed.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Widget Visibility */}
      <div className="setting-card-content">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">📦 Dashboard Widgets</h3>
        <div className="space-y-3">
          {[
            { key: 'showStatusPanel', label: 'Status Panel', icon: '📊' },
            { key: 'showOperatorPanel', label: 'Operator Panel', icon: '👤' },
            { key: 'showTelemetryCards', label: 'Telemetry Cards', icon: '📈' },
            { key: 'showCharts', label: 'Charts', icon: '📉' },
            { key: 'showLogs', label: 'Logs', icon: '📝' },
            { key: 'showOrientation', label: '3D Orientation', icon: '🔄' },
          ].map((item) => {
            const currentValue = eval(item.key)
            return (
              <label key={item.key} className="toggle-item">
                <input
                  type="checkbox"
                  checked={currentValue}
                  onChange={(e) => updateSetting(item.key, e.target.checked)}
                  className="hidden"
                />
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="text-slate-300">{item.label}</span>
                <div className="toggle-switch-small ml-auto">
                  <div className="toggle-bg-small"></div>
                </div>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="setting-card-content">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">🔄</div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-400">Data Refresh Rate</h3>
            <p className="text-sm text-slate-400">How often telemetry updates (milliseconds)</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={dataRefreshRate}
            onChange={(e) => updateSetting('dataRefreshRate', Number(e.target.value))}
            className="flex-1 slider"
          />
          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg min-w-fit">
            <span className="text-cyan-400 font-semibold">{dataRefreshRate}ms</span>
          </div>
        </div>
      </div>

      <div className="setting-card-content">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">📊</div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-400">Data History Length</h3>
            <p className="text-sm text-slate-400">Number of data points to keep in memory</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={dataHistoryLength}
            onChange={(e) => updateSetting('dataHistoryLength', Number(e.target.value))}
            className="flex-1 slider"
          />
          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg min-w-fit">
            <span className="text-cyan-400 font-semibold">{dataHistoryLength}</span>
          </div>
        </div>
      </div>

      <div className="setting-card-content">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚙️</div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">GPU Acceleration</h3>
              <p className="text-sm text-slate-400">Use hardware acceleration for rendering</p>
            </div>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enableGPUAcceleration}
            onChange={(e) => updateSetting('enableGPUAcceleration', e.target.checked)}
            className="hidden"
          />
          <div className={`toggle-bg ${enableGPUAcceleration ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' : 'bg-slate-800'}`}>
            <div className={`toggle-thumb ${enableGPUAcceleration ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </div>
          <span className={`toggle-label ${enableGPUAcceleration ? 'text-emerald-400' : 'text-slate-400'}`}>
            {enableGPUAcceleration ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      <div className="setting-card-content">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🐛</div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">Debug Mode</h3>
              <p className="text-sm text-slate-400">Show console logs and technical info</p>
            </div>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => updateSetting('debugMode', e.target.checked)}
            className="hidden"
          />
          <div className={`toggle-bg ${debugMode ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' : 'bg-slate-800'}`}>
            <div className={`toggle-thumb ${debugMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </div>
          <span className={`toggle-label ${debugMode ? 'text-emerald-400' : 'text-slate-400'}`}>
            {debugMode ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>
    </div>
  )

  const renderLocalizationTab = () => (
    <div className="space-y-6">
      <div className="setting-card-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">🌐 Language</h3>
          <p className="text-sm text-slate-400">Choose your preferred language</p>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-cyan-400 font-medium"
        >
          {languageOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-card-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">🌡️ Temperature Unit</h3>
          <p className="text-sm text-slate-400">Display temperature in Celsius or Fahrenheit</p>
        </div>
        <div className="flex gap-3">
          {[
            { value: 'celsius', label: '°C Celsius' },
            { value: 'fahrenheit', label: '°F Fahrenheit' },
          ].map((unit) => (
            <button
              key={unit.value}
              onClick={() => setTemperatureUnit(unit.value)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                temperatureUnit === unit.value
                  ? 'bg-cyan-500/20 border-cyan-400'
                  : 'bg-slate-800/30 border-slate-700 hover:border-cyan-400/50'
              }`}
            >
              <p className="text-sm font-semibold text-cyan-400">{unit.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="setting-card-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">📏 Distance Unit</h3>
          <p className="text-sm text-slate-400">Display distance in Kilometers or Miles</p>
        </div>
        <div className="flex gap-3">
          {[
            { value: 'km', label: 'km Kilometers' },
            { value: 'mi', label: 'mi Miles' },
          ].map((unit) => (
            <button
              key={unit.value}
              onClick={() => setDistanceUnit(unit.value)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                distanceUnit === unit.value
                  ? 'bg-cyan-500/20 border-cyan-400'
                  : 'bg-slate-800/30 border-slate-700 hover:border-cyan-400/50'
              }`}
            >
              <p className="text-sm font-semibold text-cyan-400">{unit.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="setting-card-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">⏰ Time Format</h3>
          <p className="text-sm text-slate-400">Choose 12-hour or 24-hour format</p>
        </div>
        <div className="flex gap-3">
          {[
            { value: '12h', label: '12h Format' },
            { value: '24h', label: '24h Format' },
          ].map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => setTimeFormat(fmt.value)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                timeFormat === fmt.value
                  ? 'bg-cyan-500/20 border-cyan-400'
                  : 'bg-slate-800/30 border-slate-700 hover:border-cyan-400/50'
              }`}
            >
              <p className="text-sm font-semibold text-cyan-400">{fmt.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderThresholdsTab = () => (
    <div className="space-y-6">
      <div className="setting-card-content">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">🔋</div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-400">Battery Warning Threshold</h3>
            <p className="text-sm text-slate-400">Alert when battery drops below this voltage</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="8"
            max="13"
            step="0.1"
            value={batteryThreshold}
            onChange={(e) => setBatteryThreshold(Number(e.target.value))}
            className="flex-1 slider"
          />
          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg min-w-fit">
            <span className="text-cyan-400 font-semibold">{batteryThreshold.toFixed(1)}V</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>8V</span>
          <span>13V</span>
        </div>
      </div>

      <div className="setting-card-content">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">📶</div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-400">Signal Warning Threshold</h3>
            <p className="text-sm text-slate-400">Alert when signal strength drops below this value</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="-120"
            max="-60"
            step="1"
            value={signalThreshold}
            onChange={(e) => setSignalThreshold(Number(e.target.value))}
            className="flex-1 slider"
          />
          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg min-w-fit">
            <span className="text-cyan-400 font-semibold">{signalThreshold}dBm</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>-120dBm</span>
          <span>-60dBm</span>
        </div>
      </div>

      <div className="setting-card-content">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">🗺️ Map Theme</h3>
          <p className="text-sm text-slate-400">Choose map visualization style</p>
        </div>
        <div className="flex gap-3">
          {[
            { value: 'dark', label: '🌙 Dark' },
            { value: 'light', label: '☀️ Light' },
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() => setMapTheme(theme.value)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                mapTheme === theme.value
                  ? 'bg-cyan-500/20 border-cyan-400'
                  : 'bg-slate-800/30 border-slate-700 hover:border-cyan-400/50'
              }`}
            >
              <p className="text-sm font-semibold text-cyan-400">{theme.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="setting-card-content">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔊</div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">Sound Alerts</h3>
              <p className="text-sm text-slate-400">Play sound notifications for warnings</p>
            </div>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={soundAlerts}
            onChange={(e) => setSoundAlerts(e.target.checked)}
            className="hidden"
          />
          <div className={`toggle-bg ${soundAlerts ? 'bg-gradient-to-r from-cyan-500 to-emerald-500' : 'bg-slate-800'}`}>
            <div className={`toggle-thumb ${soundAlerts ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </div>
          <span className={`toggle-label ${soundAlerts ? 'text-emerald-400' : 'text-slate-400'}`}>
            {soundAlerts ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>
    </div>
  )

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="setting-card-content">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">⬇️</div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-400">Export Settings</h3>
            <p className="text-sm text-slate-400">Download your settings as a JSON file</p>
          </div>
        </div>
        <button
          onClick={exportSettings}
          className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30"
        >
          📥 Export Settings
        </button>
      </div>

      <div className="setting-card-content">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">⬆️</div>
          <div>
            <h3 className="text-lg font-semibold text-cyan-400">Import Settings</h3>
            <p className="text-sm text-slate-400">Load settings from a previously exported file</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition-all duration-300"
        >
          📤 Import Settings
        </button>
        {importMessage && (
          <div className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-emerald-500/30">
            <p className="text-sm text-emerald-400">{importMessage}</p>
          </div>
        )}
      </div>

      <div className="setting-card-content border-red-500/20">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl">🔄</div>
          <div>
            <h3 className="text-lg font-semibold text-red-400">Reset to Defaults</h3>
            <p className="text-sm text-slate-400">Restore all settings to their original values</p>
          </div>
        </div>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-300"
          >
            ⚠️ Reset All Settings
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-300">Are you sure? This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetToDefaults()
                  setShowResetConfirm(false)
                }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="setting-card-content bg-slate-900/50 border-emerald-500/20">
        <p className="text-sm text-slate-400">
          <span className="text-emerald-400 font-semibold">💾 Auto-Save:</span> Your settings are automatically saved to your browser's local storage and will persist across sessions.
        </p>
      </div>
    </div>
  )

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative flex-1 overflow-y-auto px-4 py-8 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center animate-fade-in sticky top-0 bg-gradient-to-b from-slate-950 via-slate-950 to-transparent py-4 z-10" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                <span className="text-2xl">⚙️</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Mission Control Settings
              </h1>
            </div>
            <p className="text-slate-400 mt-2 text-lg">Customize your robotics mission experience</p>
            {operator && (
              <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 backdrop-blur">
                <p className="text-sm text-emerald-400">👤 Operator: <span className="font-semibold">{operator}</span></p>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 animate-fade-in sticky top-32 bg-gradient-to-b from-slate-950 via-slate-950 to-transparent py-4 z-20 overflow-x-auto" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-2 border-b border-cyan-500/20 backdrop-blur-sm pb-0 min-w-max md:min-w-0">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-6 py-4 rounded-t-xl font-semibold transition-all duration-300 relative group flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-cyan-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="hidden sm:block">
                    <span>{tab.label}</span>
                    <div className="text-xs text-slate-500">{tab.description}</div>
                  </div>

                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="space-y-6 animate-fade-in pb-20" style={{ animationDelay: '0.3s' }}>
            {activeTab === 'display' && renderDisplayTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'localization' && renderLocalizationTab()}
            {activeTab === 'thresholds' && renderThresholdsTab()}
            {activeTab === 'data' && renderDataTab()}
          </div>
        </div>
      </div>

      <style>{`
        .setting-card-content {
          position: relative;
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(30, 41, 59, 0.4));
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .setting-card-content:hover {
          border-color: rgba(34, 211, 238, 0.5);
          box-shadow: 0 8px 32px rgba(34, 211, 238, 0.1);
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.5));
        }

        .setting-card-content:nth-child(1) { animation-delay: 0.4s; }
        .setting-card-content:nth-child(2) { animation-delay: 0.5s; }
        .setting-card-content:nth-child(3) { animation-delay: 0.6s; }
        .setting-card-content:nth-child(4) { animation-delay: 0.7s; }
        .setting-card-content:nth-child(5) { animation-delay: 0.8s; }
        .setting-card-content:nth-child(6) { animation-delay: 0.9s; }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
        }

        .toggle-bg {
          position: relative;
          width: 56px;
          height: 32px;
          border-radius: 9999px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .toggle-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .toggle-label {
          font-weight: 600;
          font-size: 1.125rem;
          transition: color 0.3s ease;
        }

        .toggle-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-item:hover {
          border-color: rgba(34, 211, 238, 0.5);
          background: rgba(30, 41, 59, 0.7);
        }

        .toggle-switch-small {
          width: 44px;
          height: 24px;
          background: linear-gradient(135deg, #22d3ee, #10b981);
          border-radius: 9999px;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          padding: 2px;
        }

        .toggle-item input:checked ~ .toggle-switch-small {
          opacity: 1;
        }

        .toggle-bg-small {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
        }

        /* Smooth scrolling for the content */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.4);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.6);
        }
      `}</style>
    </div>
  )
}