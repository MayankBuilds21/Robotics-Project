import { useState, useEffect } from 'react'

export default function ModeSelector({ socket, connected, currentMode, setCurrentMode }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleModeSwitch = (mode) => {
    if (!socket || !connected || isLoading) return

    setIsLoading(true)

    if (mode === 'AI') {
      socket.emit('mode:switchAI')
    } else {
      socket.emit('mode:switchManual')
    }

    setTimeout(() => {
      setCurrentMode(mode)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="flex gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
      <button
        onClick={() => handleModeSwitch('MANUAL')}
        disabled={!connected || isLoading}
        className={`flex-1 px-3 py-2 rounded font-bold text-sm transition ${
          currentMode === 'MANUAL'
            ? 'bg-cyan-500 text-slate-950'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        } disabled:opacity-50`}
      >
        🎮 MANUAL
      </button>
      <button
        onClick={() => handleModeSwitch('AI')}
        disabled={!connected || isLoading}
        className={`flex-1 px-3 py-2 rounded font-bold text-sm transition ${
          currentMode === 'AI'
            ? 'bg-purple-500 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        } disabled:opacity-50`}
      >
        🤖 AI
      </button>
    </div>
  )
}