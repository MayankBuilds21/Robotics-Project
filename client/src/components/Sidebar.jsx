import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ connected, operator, onLogout }) {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Settings', path: '/settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900 p-2 rounded-lg border border-cyan-500/30"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-slate-900 border-r border-cyan-500/20 flex flex-col h-screen overflow-hidden lg:w-64`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-950 font-bold text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-cyan-400">LORA</h1>
              <p className="text-xs text-slate-400">Mission Control</p>
              {/* Operator display */}
              {operator && (
                <p className="text-xs text-emerald-400 mt-1">Operator: {operator}</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="px-6 py-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`}></div>
            <span className="text-sm font-medium">
              {connected ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  active
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-800/50 border border-transparent hover:border-cyan-500/30'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-cyan-500/20">
          {onLogout ? (
            <button
              className="w-full px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-medium"
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <button className="w-full px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-medium">
              Exit System
            </button>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  )
}