import { useState } from 'react'

export default function ManualControlPanel({ socket, connected, telemetry }) {
  const [selectedDirection, setSelectedDirection] = useState(null)
  const [isRotating, setIsRotating] = useState(false)

  const handleMove = (direction) => {
    if (!socket || !connected) {
      console.error('❌ Socket not connected')
      return
    }

    const moveStep = 0.0005 // Adjust sensitivity here
    const newLat = telemetry.current.lat
    const newLon = telemetry.current.lon

    let targetLat = newLat
    let targetLon = newLon

    switch (direction) {
      case 'up':
        targetLat = newLat + moveStep
        break
      case 'down':
        targetLat = newLat - moveStep
        break
      case 'left':
        targetLon = newLon - moveStep
        break
      case 'right':
        targetLon = newLon + moveStep
        break
      default:
        return
    }

    setSelectedDirection(direction)
    console.log(`🎮 Moving ${direction} to:`, { lat: targetLat, lon: targetLon })

    socket.emit('command:send', {
      command: 'move',
      params: {
        lat: targetLat,
        lon: targetLon,
      },
    })

    setTimeout(() => setSelectedDirection(null), 300)
  }

  const handleStop = () => {
    if (!socket || !connected) {
      console.error('❌ Socket not connected')
      return
    }

    console.log('⏹️ Stopping robot')
    socket.emit('command:send', {
      command: 'stop',
      params: {},
    })
  }

  const handleRotate = (angle) => {
    if (!socket || !connected) {
      console.error('❌ Socket not connected')
      return
    }

    setIsRotating(true)
    const newYaw = (telemetry.current.yaw + angle) % 360
    console.log(`🔄 Rotating to ${angle}° (Total: ${newYaw}°)`)

    socket.emit('command:send', {
      command: 'rotate',
      params: { angle: newYaw },
    })

    setTimeout(() => setIsRotating(false), 300)
  }

  const handleEmergencyStop = () => {
    if (!socket || !connected) {
      console.error('❌ Socket not connected')
      return
    }

    console.log('🚨 EMERGENCY STOP triggered!')
    socket.emit('command:send', {
      command: 'emergency_stop',
      params: {},
    })
  }

  return (
    <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-cyan-400 font-bold text-lg mb-2">🎮 MANUAL CONTROL</h3>
        <p className="text-slate-400 text-xs">Direct Robot Movement</p>
      </div>

      {/* Direction Pad */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div></div>
        <button
          onClick={() => handleMove('up')}
          disabled={!connected}
          className={`p-3 rounded font-bold transition ${
            selectedDirection === 'up'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Move North"
        >
          ⬆️
        </button>
        <div></div>

        <button
          onClick={() => handleMove('left')}
          disabled={!connected}
          className={`p-3 rounded font-bold transition ${
            selectedDirection === 'left'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Move West"
        >
          ⬅️
        </button>
        <button
          onClick={handleStop}
          disabled={!connected}
          className="p-3 rounded font-bold bg-slate-700 text-yellow-400 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Stop Movement"
        >
          ⏹️
        </button>
        <button
          onClick={() => handleMove('right')}
          disabled={!connected}
          className={`p-3 rounded font-bold transition ${
            selectedDirection === 'right'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Move East"
        >
          ➡️
        </button>

        <div></div>
        <button
          onClick={() => handleMove('down')}
          disabled={!connected}
          className={`p-3 rounded font-bold transition ${
            selectedDirection === 'down'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Move South"
        >
          ⬇️
        </button>
        <div></div>
      </div>

      {/* Rotation Controls */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleRotate(-15)}
          disabled={!connected || isRotating}
          className="p-2 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Rotate Counter-clockwise 15°"
        >
          ↻ -15°
        </button>
        <button
          onClick={() => handleRotate(15)}
          disabled={!connected || isRotating}
          className="p-2 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
          title="Rotate Clockwise 15°"
        >
          ↶ +15°
        </button>
      </div>

      {/* Emergency Stop */}
      <button
        onClick={handleEmergencyStop}
        disabled={!connected}
        className="w-full p-3 rounded bg-red-600 text-white font-bold hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95"
        title="Activate Emergency Stop"
      >
        🚨 EMERGENCY STOP
      </button>

      {/* Status */}
      <div className="mt-4 p-2 bg-slate-800/50 rounded text-xs space-y-1">
        <p className="text-slate-400">
          Position: <span className="text-cyan-400 font-mono">{telemetry.current.lat.toFixed(4)}</span>
          {', '}
          <span className="text-cyan-400 font-mono">{telemetry.current.lon.toFixed(4)}</span>
        </p>
        <p className="text-slate-400">
          Yaw: <span className="text-cyan-400 font-mono">{telemetry.current.yaw.toFixed(1)}°</span>
        </p>
        <p className="text-slate-400">
          Status: <span className={telemetry.current.speed === 0 ? 'text-yellow-400' : 'text-emerald-400'}>
            {telemetry.current.speed === 0 ? 'IDLE' : 'MOVING'}
          </span>
        </p>
      </div>
    </div>
  )
}