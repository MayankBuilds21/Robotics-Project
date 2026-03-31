import { useState } from 'react'

export default function AIControlPanel({ socket, connected, telemetry }) {
  const [targetLat, setTargetLat] = useState(19.0760)
  const [targetLon, setTargetLon] = useState(72.8777)
  const [aiStatus, setAiStatus] = useState('idle')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAINavigate = () => {
    if (!socket || !connected) return

    setIsProcessing(true)
    setAiStatus('navigating')

    socket.emit('command:send', {
      command: 'move',
      params: {
        lat: parseFloat(targetLat),
        lon: parseFloat(targetLon),
        mode: 'AI',
      },
    })

    setTimeout(() => {
      setIsProcessing(false)
      setAiStatus('idle')
    }, 2000)
  }

  const handleStopAI = () => {
    if (!socket || !connected) return

    setIsProcessing(false)
    setAiStatus('stopped')

    socket.emit('command:send', {
      command: 'stop',
      params: { mode: 'AI' },
    })
  }

  return (
    <div className="bg-slate-900/50 border border-purple-500/20 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-purple-400 font-bold text-lg mb-2">🤖 AI CONTROL</h3>
        <p className="text-slate-400 text-xs">Autonomous Navigation</p>
      </div>

      {/* AI Status */}
      <div className={`mb-4 p-3 rounded border text-sm font-bold ${
        aiStatus === 'navigating'
          ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
          : aiStatus === 'stopped'
          ? 'border-red-500/50 bg-red-500/10 text-red-400'
          : 'border-slate-500/50 bg-slate-500/10 text-slate-400'
      }`}>
        Status: {aiStatus.toUpperCase()}
      </div>

      {/* Target Coordinates */}
      <div className="mb-4 space-y-2">
        <label className="block text-slate-300 text-xs font-bold">
          Target Latitude
        </label>
        <input
          type="number"
          value={targetLat}
          onChange={(e) => setTargetLat(e.target.value)}
          step="0.0001"
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-slate-800 text-cyan-400 rounded border border-slate-700 text-sm disabled:opacity-50"
        />
      </div>

      <div className="mb-4 space-y-2">
        <label className="block text-slate-300 text-xs font-bold">
          Target Longitude
        </label>
        <input
          type="number"
          value={targetLon}
          onChange={(e) => setTargetLon(e.target.value)}
          step="0.0001"
          disabled={isProcessing}
          className="w-full px-3 py-2 bg-slate-800 text-cyan-400 rounded border border-slate-700 text-sm disabled:opacity-50"
        />
      </div>

      {/* AI Options */}
      <div className="mb-4 space-y-2">
        <label className="flex items-center text-slate-300 text-xs">
          <input type="checkbox" className="mr-2" defaultChecked />
          <span>Avoid Obstacles</span>
        </label>
        <label className="flex items-center text-slate-300 text-xs">
          <input type="checkbox" className="mr-2" defaultChecked />
          <span>Optimize Path</span>
        </label>
        <label className="flex items-center text-slate-300 text-xs">
          <input type="checkbox" className="mr-2" />
          <span>Follow Waypoints</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleAINavigate}
          disabled={isProcessing}
          className="p-3 rounded bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:opacity-50 transition"
        >
          {isProcessing ? '⏳ Processing' : '🎯 Start'}
        </button>
        <button
          onClick={handleStopAI}
          className="p-3 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition"
        >
          ⏹️ Stop
        </button>
      </div>

      {/* Current vs Target */}
      <div className="mt-4 p-3 bg-slate-800/50 rounded text-xs space-y-1">
        <p className="text-slate-400">
          Current: <span className="text-cyan-400">{telemetry.current.lat.toFixed(4)}</span>
          , <span className="text-cyan-400">{telemetry.current.lon.toFixed(4)}</span>
        </p>
        <p className="text-slate-400">
          Target: <span className="text-purple-400">{parseFloat(targetLat).toFixed(4)}</span>
          , <span className="text-purple-400">{parseFloat(targetLon).toFixed(4)}</span>
        </p>
      </div>
    </div>
  )
}