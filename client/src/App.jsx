import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import io from 'socket.io-client'

import Sidebar from './components/Sidebar'
import IntroPage from './pages/IntroPage'
import Dashboard from './pages/Dashboard'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage' // Add this page

function App() {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [operator, setOperator] = useState(null) // Operator authentication

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

    return () => {
      newSocket.close()
    }
  }, [])

  // Authentication handlers
  function handleLogin(user) {
    setOperator(user)
  }
  function handleLogout() {
    setOperator(null)
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-950">
        {/* Sidebar only after login */}
        {operator && <Sidebar connected={connected} operator={operator} onLogout={handleLogout} />}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/dashboard" element={
              operator
                ? <Dashboard socket={socket} connected={connected} operator={operator} />
                : <Navigate to="/login" />
            } />
            <Route path="/settings" element={
              operator
                ? <SettingsPage operator={operator} />
                : <Navigate to="/login" />
            } />
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to={operator ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App