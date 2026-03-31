import { useState, useEffect } from 'react'
import { useSettings } from '../context/SettingsContext'
import StatusPanel from '../components/StatusPanel'
import OperatorPanel from '../components/OperatorPanel'
import TelemetryCards from '../components/TelemetryCards'
import MapView from '../components/MapView'
import TelemetryCharts from '../components/TelemetryCharts'
import Orientation3D from '../components/Orientation3D'
import SignalGauge from '../components/SignalGauge'
import LogsPanel from '../components/LogsPanel'
import ModeSelector from '../components/ModeSelector'
import ManualControlPanel from '../components/ManualControlPanel'
import AIControlPanel from '../components/AIControlPanel'
import {
  exportLogsCSV,
  exportTelemetryPathCSV,
  exportCurrentTelemetryCSV,
} from '../utils/exportUtils'

export default function Dashboard({ socket, connected, operator, currentMode, setCurrentMode }) {
  const {
    batteryThreshold,
    signalThreshold,
    showCharts,
    showLogs,
  } = useSettings()

  const [telemetry, setTelemetry] = useState({
    current: {
      lat: 19.0760,
      lon: 72.8777,
      battery: 11.5,
      roll: 0,
      pitch: 0,
      yaw: 0,
      signal: -75,
      speed: 0,
      packetLoss: 0,
      timestamp: new Date().toISOString(),
      mode: 'MANUAL',
    },
    path: [],
  })

  const [logs, setLogs] = useState([])
  const [missionStats, setMissionStats] = useState({
    totalDistance: 0,
    missionTime: 0,
    waypointsCompleted: 0,
  })

  // Start telemetry stream on mount
  useEffect(() => {
    if (!socket) {
      console.warn('⚠️ Socket not available')
      return
    }

    console.log('📊 Starting telemetry stream...')
    socket.emit('telemetry:start')

    // Listen for telemetry updates
    const handleTelemetry = (data) => {
      console.log('📈 Telemetry received:', data)
      
      setTelemetry((prevTelemetry) => {
        // Update current position
        const newCurrent = {
          ...data.current,
        }

        // Build path by adding current position if it moved
        let newPath = [...prevTelemetry.path]
        
        // Check if position changed (moved more than noise threshold)
        if (
          !prevTelemetry.current ||
          Math.abs(data.current.lat - prevTelemetry.current.lat) > 0.00001 ||
          Math.abs(data.current.lon - prevTelemetry.current.lon) > 0.00001
        ) {
          // Add to path if it's a new position
          newPath.push({
            lat: data.current.lat,
            lon: data.current.lon,
            timestamp: data.current.timestamp,
          })
          console.log(`📍 Added to path. Total points: ${newPath.length}`)
        }

        return {
          current: newCurrent,
          path: newPath,
        }
      })

      // Create log entry
      const infoMsg = `Telemetry - Lat: ${data.current.lat.toFixed(5)}, Lon: ${data.current.lon.toFixed(5)}, Battery: ${data.current.battery.toFixed(2)}V, Signal: ${data.current.signal.toFixed(0)}dBm`

      const newLogs = [
        {
          id: Date.now(),
          message: infoMsg,
          type: 'info',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]

      // Battery Low Warning
      if (data.current.battery < batteryThreshold) {
        newLogs.push({
          id: Date.now() + 1,
          message: `⚡ Battery Low: ${data.current.battery.toFixed(2)}V`,
          type: 'warning',
          timestamp: new Date().toLocaleTimeString(),
        })
      }

      // Weak Signal Warning
      if (data.current.signal < signalThreshold) {
        newLogs.push({
          id: Date.now() + 2,
          message: `📶 Weak Signal: ${data.current.signal.toFixed(0)}dBm`,
          type: 'warning',
          timestamp: new Date().toLocaleTimeString(),
        })
      }

      // High Packet Loss Alert
      if (data.current.packetLoss >= 10) {
        newLogs.push({
          id: Date.now() + 3,
          message: `🚨 High Packet Loss: ${data.current.packetLoss}%`,
          type: 'alert',
          timestamp: new Date().toLocaleTimeString(),
        })
      }

      setLogs((prev) => [...newLogs, ...prev].slice(0, 50))
    }

    // Listen for command acknowledgments
    const handleCommandAck = (data) => {
      console.log('✅ Command acknowledged:', data)
      setLogs((prev) => [
        {
          id: Date.now(),
          message: `✅ ${data.message}`,
          type: 'success',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 50))
    }

    // Listen for emergency triggers
    const handleEmergency = (data) => {
      console.log('🚨 Emergency triggered:', data)
      setLogs((prev) => [
        {
          id: Date.now(),
          message: '🚨 EMERGENCY STOP ACTIVATED',
          type: 'alert',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 50))
    }

    // Listen for mode switches
    const handleModeSwitched = (data) => {
      console.log('📡 Mode switched:', data)
      setLogs((prev) => [
        {
          id: Date.now(),
          message: `🔄 Switched to ${data.mode} mode`,
          type: 'info',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 50))
    }

    socket.on('telemetry', handleTelemetry)
    socket.on('command:ack', handleCommandAck)
    socket.on('emergency:triggered', handleEmergency)
    socket.on('mode:switched', handleModeSwitched)

    return () => {
      console.log('📊 Stopping telemetry stream...')
      socket.off('telemetry', handleTelemetry)
      socket.off('command:ack', handleCommandAck)
      socket.off('emergency:triggered', handleEmergency)
      socket.off('mode:switched', handleModeSwitched)
      socket.emit('telemetry:stop')
    }
  }, [socket, batteryThreshold, signalThreshold])

  // Calculate mission statistics
  useEffect(() => {
    if (telemetry.path && telemetry.path.length > 0) {
      let totalDistance = 0
      
      // Simple distance calculation
      for (let i = 1; i < telemetry.path.length; i++) {
        const prev = telemetry.path[i - 1]
        const curr = telemetry.path[i]
        
        // Haversine formula (simplified)
        const dLat = (curr.lat - prev.lat) * 111000 // km to m at equator
        const dLon = (curr.lon - prev.lon) * 111000 * Math.cos((prev.lat * Math.PI) / 180)
        const distance = Math.sqrt(dLat * dLat + dLon * dLon)
        totalDistance += distance
      }

      setMissionStats((prev) => ({
        ...prev,
        totalDistance: totalDistance,
        missionTime: Math.floor((Date.now() - new Date(telemetry.current.timestamp)) / 1000),
      }))
    }
  }, [telemetry.path, telemetry.current.timestamp])

  return (
    <div className="w-full h-screen bg-slate-950 overflow-hidden flex flex-col">
      {/* ==================== HEADER ==================== */}
      <div className="bg-slate-900/80 border-b border-cyan-500/20 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-cyan-400">MISSION CONTROL</h1>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentMode === 'MANUAL'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
              }`}>
                {currentMode === 'MANUAL' ? '🎮 MANUAL' : '🤖 AI'}
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-1">Robot Telemetry System</p>
            {operator && (
              <p className="text-emerald-400 text-xs mt-1">👤 Operator: {operator}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Mode Selector */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
              <ModeSelector 
                socket={socket}
                connected={connected}
                currentMode={currentMode}
                setCurrentMode={setCurrentMode}
              />
            </div>

            {/* Connection Status */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                connected
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-red-500/50 bg-red-500/10'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-emerald-400' : 'bg-red-400'
                } animate-pulse`}
              ></div>
              <span className={connected ? 'text-emerald-400' : 'text-red-400'}>
                {connected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            {/* Time */}
            <span className="text-slate-400 text-sm font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        
        {/* ==================== LEFT PANEL ==================== */}
        <div className="w-80 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
          
          {/* Status Panel */}
          <StatusPanel telemetry={telemetry} connected={connected} />

          {/* Operator Panel */}
          <OperatorPanel socket={socket} connected={connected} />

          {/* Mode-Specific Control Panel */}
          <div className="transition-all duration-300">
            {currentMode === 'MANUAL' ? (
              <ManualControlPanel 
                socket={socket} 
                connected={connected} 
                telemetry={telemetry}
              />
            ) : (
              <AIControlPanel 
                socket={socket} 
                connected={connected} 
                telemetry={telemetry}
              />
            )}
          </div>

          {/* Telemetry Cards */}
          <TelemetryCards telemetry={telemetry.current} />

          {/* Mission Statistics */}
          <div className="bg-slate-900/50 border border-emerald-500/20 rounded-lg p-4">
            <h3 className="text-emerald-400 font-bold text-sm mb-3">📊 MISSION STATS</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance:</span>
                <span className="text-emerald-400 font-mono">
                  {(missionStats.totalDistance / 1000).toFixed(3)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mission Time:</span>
                <span className="text-emerald-400 font-mono">
                  {Math.floor(missionStats.missionTime / 60)}m {missionStats.missionTime % 60}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Path Points:</span>
                <span className="text-emerald-400 font-mono">
                  {telemetry.path.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== CENTER PANEL ==================== */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          
          {/* Map View */}
          <div className="flex-1 bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden shadow-lg">
            <MapView path={telemetry.path} current={telemetry.current} />
          </div>

          {/* Signal Gauge */}
          <div className="h-24 bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 shadow-lg">
            <SignalGauge signal={telemetry.current.signal} />
          </div>
        </div>

        {/* ==================== RIGHT PANEL ==================== */}
        <div className="w-96 flex flex-col gap-4 overflow-hidden">
          
          {/* Orientation 3D */}
          <div className="flex-1 bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden shadow-lg">
            <Orientation3D
              orientation={{
                roll: telemetry.current.roll,
                pitch: telemetry.current.pitch,
                yaw: telemetry.current.yaw,
              }}
            />
          </div>

          {/* Telemetry Charts (Conditional) */}
          {showCharts && (
            <div className="h-64 bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden shadow-lg">
              <TelemetryCharts telemetry={telemetry.current} />
            </div>
          )}
        </div>
      </div>

      {/* ==================== BOTTOM PANEL - LOGS & EXPORT ==================== */}
      {showLogs && (
        <div className="h-40 border-t border-cyan-500/20 bg-slate-900/50 flex flex-col shadow-lg">
          
          {/* Export Buttons */}
          <div className="flex justify-end gap-2 px-4 pt-3 pb-2">
            <button
              className="px-3 py-1 rounded bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-500 text-xs transition transform hover:scale-105 active:scale-95"
              onClick={() => exportLogsCSV(logs)}
              title="Export all logs as CSV"
            >
              📥 Export Logs
            </button>
            <button
              className="px-3 py-1 rounded bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-500 text-xs transition transform hover:scale-105 active:scale-95"
              onClick={() => exportTelemetryPathCSV(telemetry.path)}
              title="Export path data as CSV"
            >
              🗺️ Export Path
            </button>
            <button
              className="px-3 py-1 rounded bg-yellow-400 text-slate-950 font-bold hover:bg-yellow-500 text-xs transition transform hover:scale-105 active:scale-95"
              onClick={() => exportCurrentTelemetryCSV(telemetry.current)}
              title="Export current telemetry as CSV"
            >
              📊 Export Current
            </button>
          </div>

          {/* Logs Panel */}
          <LogsPanel logs={logs} />
        </div>
      )}
    </div>
  )
}