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
import {
  exportLogsCSV,
  exportTelemetryPathCSV,
  exportCurrentTelemetryCSV,
} from '../utils/exportUtils'

export default function Dashboard({ socket, connected, operator }) {
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
    },
    path: [],
  })

  const [logs, setLogs] = useState([])

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
      setTelemetry(data)

      const infoMsg = `Telemetry received - Battery: ${data.current.battery.toFixed(
        2
      )}V, Signal: ${data.current.signal.toFixed(0)}dBm, Roll: ${data.current.roll.toFixed(
        1
      )}°, Pitch: ${data.current.pitch.toFixed(1)}°, Yaw: ${data.current.yaw.toFixed(0)}°`

      const newLogs = [
        {
          id: Date.now(),
          message: infoMsg,
          type: 'info',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]

      if (data.current.battery < batteryThreshold) {
        newLogs.push({
          id: Date.now() + 1,
          message: `⚡ Battery Low: ${data.current.battery.toFixed(2)}V`,
          type: 'warning',
          timestamp: new Date().toLocaleTimeString(),
        })
      }
      if (data.current.signal < signalThreshold) {
        newLogs.push({
          id: Date.now() + 2,
          message: `📶 Weak Signal: ${data.current.signal.toFixed(0)}dBm`,
          type: 'warning',
          timestamp: new Date().toLocaleTimeString(),
        })
      }
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

    socket.on('telemetry', handleTelemetry)

    return () => {
      console.log('📊 Stopping telemetry stream...')
      socket.off('telemetry', handleTelemetry)
      socket.emit('telemetry:stop')
    }
  }, [socket, batteryThreshold, signalThreshold])

  return (
    <div className="w-full h-screen bg-slate-950 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-cyan-500/20 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">MISSION CONTROL</h1>
            <p className="text-slate-400 text-sm mt-1">Robot Telemetry System</p>
            {/* Operator display */}
            {operator && (
              <p className="text-emerald-400 text-xs mt-1">Operator: {operator}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
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
            <span className="text-slate-400 text-sm">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 overflow-y-auto space-y-4">
          <StatusPanel telemetry={telemetry} connected={connected} />
          <OperatorPanel socket={socket} connected={connected} />
          <TelemetryCards telemetry={telemetry.current} />
        </div>

        {/* Center Panel */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
            <MapView path={telemetry.path} current={telemetry.current} />
          </div>
          <div className="h-24 bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4">
            <SignalGauge signal={telemetry.current.signal} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
            <Orientation3D
              orientation={{
                roll: telemetry.current.roll,
                pitch: telemetry.current.pitch,
                yaw: telemetry.current.yaw,
              }}
            />
          </div>
          {showCharts && (
            <div className="h-64 bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
              <TelemetryCharts telemetry={telemetry.current} />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panel - Export buttons & Logs */}
      {showLogs && (
        <div className="h-40 border-t border-cyan-500/20 bg-slate-900/50 flex flex-col">
          <div className="flex justify-end gap-2 px-2 pt-1">
            <button
              className="px-3 py-1 rounded bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-500 text-xs"
              onClick={() => exportLogsCSV(logs)}
            >
              Export Logs
            </button>
            <button
              className="px-3 py-1 rounded bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-500 text-xs"
              onClick={() => exportTelemetryPathCSV(telemetry.path)}
            >
              Export Path
            </button>
            <button
              className="px-3 py-1 rounded bg-yellow-400 text-slate-950 font-bold hover:bg-yellow-500 text-xs"
              onClick={() => exportCurrentTelemetryCSV(telemetry.current)}
            >
              Export Current
            </button>
          </div>
          <LogsPanel logs={logs} />
        </div>
      )}
    </div>
  )
}