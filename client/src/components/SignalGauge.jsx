export default function SignalGauge({ signal }) {
  // Convert dBm to percentage (higher signal is less negative)
  // Range: -90 to -60 dBm
  const percentage = Math.max(0, Math.min(100, ((signal + 90) / 30) * 100))

  const getColor = () => {
    if (percentage >= 75) return 'from-emerald-400 to-cyan-400'
    if (percentage >= 50) return 'from-cyan-400 to-blue-400'
    if (percentage >= 25) return 'from-yellow-400 to-orange-400'
    return 'from-red-400 to-pink-400'
  }

  return (
    <div className="flex items-center justify-between h-full px-4">
      <div>
        <p className="text-xs text-slate-400 mb-2">Signal Strength</p>
        <p className="text-2xl font-bold text-cyan-400">{signal.toFixed(0)} dBm</p>
      </div>
      
      <div className="flex-1 mx-8">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-8 flex-1 rounded ${
                (i + 1) / 5 <= percentage / 100
                  ? `bg-gradient-to-t ${getColor()}`
                  : 'bg-slate-700/50'
              } transition-all`}
            />
          ))}
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm text-slate-400">Quality</p>
        <p className="text-2xl font-bold text-cyan-400">{percentage.toFixed(0)}%</p>
      </div>
    </div>
  )
}