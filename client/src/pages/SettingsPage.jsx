import { useSettings } from '../context/SettingsContext'

export default function SettingsPage({ operator }) {
  const {
    batteryThreshold, setBatteryThreshold,
    signalThreshold, setSignalThreshold,
    mapTheme, setMapTheme,
    showCharts, setShowCharts,
    showLogs, setShowLogs,
  } = useSettings()

  return (
    <div className="w-full h-screen bg-slate-950 px-8 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl text-cyan-400 font-bold mb-6">
          Settings
        </h1>
        {operator &&
          <div className="mb-4 text-xs text-emerald-400">
            Operator: {operator}
          </div>
        }
        <div className="space-y-6">
          {/* Map Theme */}
          <div>
            <label className="text-slate-400 mb-2 block">Map Theme:</label>
            <select
              className="px-4 py-2 bg-slate-900 text-cyan-400 rounded-lg"
              value={mapTheme}
              onChange={e => setMapTheme(e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          {/* Battery Threshold */}
          <div>
            <label className="text-slate-400 mb-2 block">Battery Warning Threshold (V):</label>
            <input
              className="px-4 py-2 bg-slate-900 text-cyan-400 rounded-lg"
              type="number"
              min="8"
              max="13"
              step="0.01"
              value={batteryThreshold}
              onChange={e => setBatteryThreshold(Number(e.target.value))}
            />
          </div>
          {/* Signal Threshold */}
          <div>
            <label className="text-slate-400 mb-2 block">Signal Warning Threshold (dBm):</label>
            <input
              className="px-4 py-2 bg-slate-900 text-cyan-400 rounded-lg"
              type="number"
              min="-120"
              max="-60"
              value={signalThreshold}
              onChange={e => setSignalThreshold(Number(e.target.value))}
            />
          </div>
          {/* Panel Toggles */}
          <div>
            <label className="text-slate-400 mb-2 block">Dashboard Panels:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCharts}
                  onChange={e => setShowCharts(e.target.checked)}
                />
                <span className="ml-2 text-cyan-400">Show Charts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLogs}
                  onChange={e => setShowLogs(e.target.checked)}
                />
                <span className="ml-2 text-cyan-400">Show Logs</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}