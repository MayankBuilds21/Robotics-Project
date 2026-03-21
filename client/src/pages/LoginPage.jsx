import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage({ onLogin }) {
  const [operator, setOperator] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate server authentication delay
    setTimeout(() => {
      // Demo: hardcoded username/password
      if (operator === 'admin' && password === 'mission123') {
        onLogin(operator)
        // Navigate to intro/home page after successful login
        navigate('/intro', { replace: true })
      } else {
        setError('Invalid credentials. Try again!')
        setIsLoading(false)
      }
    }, 600)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-cyan-900 to-emerald-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 8s ease-in-out infinite reverse' }}></div>

      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        <div style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, 0.1) 25%, rgba(34, 211, 238, 0.1) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.1) 75%, rgba(34, 211, 238, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, 0.1) 25%, rgba(34, 211, 238, 0.1) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.1) 75%, rgba(34, 211, 238, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px',
          animation: 'gridShift 20s linear infinite'
        }} className="w-full h-full"></div>
      </div>

      {/* Picture-in-Picture Screens */}
      {/* Top-right screen */}
      <div className="absolute top-8 right-8 w-48 h-32 bg-slate-900/40 border border-cyan-500/30 rounded-lg p-3 backdrop-blur-sm hidden lg:block">
        <div className="text-cyan-400 text-xs font-mono mb-2">SYS_STATUS</div>
        <div className="text-green-400 text-xs font-mono space-y-1">
          <div>▸ Init sequence...</div>
          <div>▸ Network: <span className="text-emerald-400">OK</span></div>
          <div>▸ Auth: <span className="text-yellow-400">PENDING</span></div>
          <div>▸ Memory: <span className="text-cyan-400">256MB</span></div>
        </div>
      </div>

      {/* Bottom-left screen */}
      <div className="absolute bottom-8 left-8 w-48 h-32 bg-slate-900/40 border border-cyan-500/30 rounded-lg p-3 backdrop-blur-sm hidden lg:block">
        <div className="text-cyan-400 text-xs font-mono mb-2">NET_MONITOR</div>
        <div className="text-green-400 text-xs font-mono space-y-1">
          <div>▸ Upload: <span className="text-emerald-400">0.5 Mbps</span></div>
          <div>▸ Download: <span className="text-emerald-400">2.3 Mbps</span></div>
          <div>▸ Latency: <span className="text-cyan-400">45ms</span></div>
          <div>▸ Packets: <span className="text-yellow-400">1024</span></div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }

        @keyframes gridShift {
          0% { transform: translateX(0); }
          100% { transform: translateX(50px); }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes scan {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
        }

        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(34, 211, 238, 0.5), 0 0 30px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 25px rgba(34, 211, 238, 0.8), 0 0 40px rgba(16, 185, 129, 0.6); }
        }

        .login-container {
          animation: fadeInDown 0.8s ease-out;
        }

        .login-header {
          animation: fadeInDown 1s ease-out;
        }

        .login-form {
          animation: slideInUp 1s ease-out 0.2s both;
        }

        .input-field {
          transition: all 0.3s ease;
        }

        .input-field:focus {
          border-color: rgba(34, 211, 238, 0.8);
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.4), inset 0 0 10px rgba(34, 211, 238, 0.1);
        }

        .input-field:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .login-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .login-button:hover:not(:disabled) {
          transform: scale(1.05);
          animation: buttonPulse 1.5s ease-in-out infinite;
        }

        .login-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        .login-button:disabled {
          opacity: 0.8;
          cursor: wait;
          animation: buttonPulse 1s ease-in-out infinite;
        }

        .error-message {
          animation: shake 0.5s ease-in-out;
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.8), transparent);
          animation: scan 3s ease-in-out infinite;
          pointer-events: none;
        }

        .demo-text {
          animation: slideInUp 1s ease-out 0.4s both;
        }

        .robot-icon {
          animation: fadeInDown 1.2s ease-out;
          filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.5));
        }
      `}</style>

      <div className="login-container backdrop-blur-xl bg-slate-900/70 border border-cyan-500/40 shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col items-center relative overflow-hidden z-10">
        <div className="scan-line"></div>

        <div className="login-header mb-8 flex flex-col items-center">
          <div className="robot-icon w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-xl mb-4 border-2 border-cyan-300/50">
            <span className="text-4xl font-bold">🤖</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">MISSION CONTROL</h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase">Operator Authentication System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form w-full flex flex-col gap-5">
          <div className="relative">
            <input
              className="input-field w-full px-5 py-3 bg-slate-800/60 text-cyan-300 rounded-lg border-2 border-cyan-500/30 focus:border-cyan-400 outline-none placeholder-slate-500 font-mono text-sm"
              placeholder="USERNAME"
              autoFocus
              value={operator}
              onChange={e => setOperator(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3 text-cyan-400/50">▸</div>
          </div>

          <div className="relative">
            <input
              className="input-field w-full px-5 py-3 bg-slate-800/60 text-cyan-300 rounded-lg border-2 border-cyan-500/30 focus:border-cyan-400 outline-none placeholder-slate-500 font-mono text-sm"
              placeholder="PASSWORD"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3 text-cyan-400/50">▸</div>
          </div>

          <button
            className={`login-button px-8 py-3 mt-4 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 rounded-lg font-bold text-lg uppercase tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-75`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⟳</span> Authenticating...
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {error && (
          <div className="error-message text-red-400 text-sm mt-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg w-full text-center font-mono">
            ✗ {error}
          </div>
        )}

        <div className="demo-text text-slate-400 text-xs mt-6 p-4 bg-slate-800/40 rounded-lg w-full text-center border border-slate-700/50 font-mono">
          <div className="mb-2 text-cyan-400 font-bold">DEMO CREDENTIALS</div>
          <div>Username: <span className="text-emerald-400">admin</span></div>
          <div>Password: <span className="text-emerald-400">mission123</span></div>
        </div>
      </div>
    </div>
  )
}