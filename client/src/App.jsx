import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import io from 'socket.io-client'

import Sidebar from './components/Sidebar'
import IntroPage from './pages/IntroPage'
import Dashboard from './pages/Dashboard'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'

function App() {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [operator, setOperator] = useState(() => {
    // Restore login state from localStorage on app load
    const savedOperator = localStorage.getItem('operator')
    return savedOperator ? JSON.parse(savedOperator) : null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Connect to backend WebSocket
    const newSocket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    newSocket.on('connect', () => {
      setConnected(true)
      console.log('✓ Connected to telemetry server')
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
      console.log('✗ Disconnected from server')
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    setSocket(newSocket)
    setIsLoading(false)

    return () => {
      newSocket.close()
    }
  }, [])

  // Authentication handlers
  function handleLogin(user) {
    setOperator(user)
    // Save to localStorage to persist login
    localStorage.setItem('operator', JSON.stringify(user))
  }

  function handleLogout() {
    setOperator(null)
    // Clear from localStorage on logout
    localStorage.removeItem('operator')
  }

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-cyan-900 to-emerald-900 flex items-center justify-center">
        <div className="text-cyan-400 font-mono text-lg">Initializing System...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-950">
        {/* Sidebar only after login */}
        {operator && <Sidebar connected={connected} operator={operator} onLogout={handleLogout} />}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            {/* Login page is the default route */}
            <Route path="/login" element={
              operator ? <Navigate to="/intro" /> : <LoginPage onLogin={handleLogin} />
            } />
            
            {/* Home/Intro page (protected - requires login) */}
            <Route path="/intro" element={
              operator
                ? <IntroPage />
                : <Navigate to="/login" />
            } />

            {/* Dashboard page (protected) */}
            <Route path="/dashboard" element={
              operator
                ? <Dashboard socket={socket} connected={connected} operator={operator} />
                : <Navigate to="/login" />
            } />

            {/* Settings page (protected) */}
            <Route path="/settings" element={
              operator
                ? <SettingsPage operator={operator} />
                : <Navigate to="/login" />
            } />

            {/* Redirect all other routes */}
            <Route path="/" element={<Navigate to={operator ? "/intro" : "/login"} />} />
            <Route path="*" element={<Navigate to={operator ? "/intro" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App