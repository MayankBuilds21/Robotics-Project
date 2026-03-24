import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ currentPage, setCurrentPage, operator, onLogout, connected }) {
  const navigate = useNavigate()
  const [isHovering, setIsHovering] = useState(null)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Mission Control' },
    { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Preferences' },
  ]

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId)
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout()
    }
  }

  return (
    <div className="w-80 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-cyan-500/20 flex flex-col overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              LORA
            </h1>
            <p className="text-xs text-slate-500">Mission Control</p>
          </div>
        </div>

        {/* Connection Status */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            connected
              ? 'bg-emerald-500/10 border border-emerald-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-emerald-400' : 'bg-red-400'
            } animate-pulse`}
          ></div>
          <span className={`text-xs font-semibold ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
            {connected ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-4">
        <p className="text-xs text-slate-600 font-semibold mb-3 px-2">NAVIGATION</p>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              onMouseEnter={() => setIsHovering(item.id)}
              onMouseLeave={() => setIsHovering(null)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-start gap-3 group ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/50'
                  : 'bg-slate-800/30 border border-cyan-500/10 hover:border-cyan-500/30'
              }`}
            >
              <span className="text-xl mt-1">{item.icon}</span>
              <div className="flex-1">
                <p className={`font-semibold ${currentPage === item.id ? 'text-cyan-400' : 'text-slate-300'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Operator Info */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
          <p className="text-xs text-slate-500 mb-1">Logged in as</p>
          <p className="text-sm font-bold text-emerald-400">{operator || 'Unknown'}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          🚪 Logout
        </button>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-cyan-500/20 text-center">
        <p className="text-xs text-slate-600">© 2026 Mission Control</p>
      </div>
    </div>
  )
}