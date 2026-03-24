import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage({ setIsLoggedIn }) {
  const [operatorName, setOperatorName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (!operatorName.trim()) {
      setError('Please enter operator name')
      return
    }

    if (operatorName.trim().length < 2) {
      setError('Operator name must be at least 2 characters')
      return
    }

    // Simulate loading
    setIsLoading(true)
    setTimeout(() => {
      // Call the setIsLoggedIn function passed from App
      setIsLoggedIn(operatorName.trim())
      setIsLoading(false)
      // Navigation is handled in App.jsx
    }, 500)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md animate-slide-up">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-cyan-500/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
          {/* Logo Section */}
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-lg shadow-cyan-500/50 mb-4 animate-pulse">
              <span className="text-2xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              Mission Control
            </h1>
            <p className="text-slate-400 text-sm">Robotics Telemetry System</p>
          </div>

          {/* Status Badge */}
          <div className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-400">SYSTEM ONLINE</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Operator Name Input */}
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">
                👤 Operator Name
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => {
                  setOperatorName(e.target.value)
                  setError('')
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleLogin(e)
                  }
                }}
                placeholder="Enter your operator name"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-500 font-medium transition-all duration-300 hover:border-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">e.g., admin, operator, john</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 animate-slide-down">
                <p className="text-red-400 text-sm font-medium">❌ {error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !operatorName.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30 mt-6 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🚀 Enter Mission Control
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-900 text-slate-500">or</span>
              </div>
            </div>

            {/* Demo Operators */}
            <div>
              <p className="text-xs text-slate-400 mb-2">Quick Login:</p>
              <div className="grid grid-cols-3 gap-2">
                {['admin', 'operator', 'demo'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setOperatorName(name)
                      setError('')
                    }}
                    className="px-3 py-2 text-xs font-semibold bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 rounded-lg transition-all hover:bg-cyan-500/10"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Info Section */}
          <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-cyan-500/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm text-slate-400">
              <span className="text-cyan-400 font-semibold">💡 Demo Tip:</span> Click quick login buttons or enter any name to access the mission control dashboard.
            </p>
          </div>

          {/* Features List */}
          <div className="mt-6 space-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-xs text-slate-500 font-semibold mb-3">Available Features:</p>
            <div className="space-y-2">
              {[
                { icon: '📍', label: 'Real-time GPS Tracking' },
                { icon: '🔋', label: 'Battery Monitoring' },
                { icon: '📶', label: 'Signal Strength' },
                { icon: '⚙️', label: 'System Settings' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{feature.icon}</span>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center text-xs text-slate-500 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p>🔒 Secure Mission Control System</p>
        </div>
      </div>

      <style>{`
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slideDown 0.4s ease-out forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}