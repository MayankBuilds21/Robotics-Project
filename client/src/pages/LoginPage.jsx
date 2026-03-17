import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [operator, setOperator] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // Demo: hardcoded username/password
    if (operator === 'admin' && password === 'mission123') {
      onLogin(operator)
    } else {
      setError('Invalid login. Try again!')
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-cyan-900 to-emerald-900 flex items-center justify-center">
      <div className="backdrop-blur-lg bg-slate-900/80 border border-cyan-500/30 shadow-lg rounded-xl p-8 w-full max-w-sm flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-md mb-2">
            <span className="text-slate-900 text-3xl font-bold">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">MISSION CONTROL</h1>
          <p className="text-slate-400 text-xs">Operator Login</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            className="px-4 py-2 bg-slate-800 text-cyan-300 rounded-lg border border-cyan-500/20 focus:border-cyan-500 outline-none transition"
            placeholder="Username"
            autoFocus
            value={operator}
            onChange={e => setOperator(e.target.value)}
          />
          <input
            className="px-4 py-2 bg-slate-800 text-cyan-300 rounded-lg border border-cyan-500/20 focus:border-cyan-500 outline-none transition"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            className="px-6 py-2 mt-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 rounded-lg font-bold hover:from-cyan-500 hover:to-emerald-500 shadow-md transition"
            type="submit"
          >
            Login
          </button>
        </form>
        {error && (
          <div className="text-red-400 text-xs mt-4">{error}</div>
        )}
        <div className="text-slate-400 text-xs mt-4">
          Demo: <b>admin</b> / <b>mission123</b>
        </div>
      </div>
    </div>
  )
}