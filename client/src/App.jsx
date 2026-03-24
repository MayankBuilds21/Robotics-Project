import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import IntroPage from './pages/IntroPage'

// Component to apply settings globally
function AppContent({ socket, connected: initialConnected, operator: initialOperator }) {
  const { accentColor, animationSpeed, darkMode } = useSettings()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [operator, setOperator] = useState(initialOperator)
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialOperator)
  const [connected, setConnected] = useState(initialConnected || false)

  // Apply accent color and animation speed to document
  useEffect(() => {
    const colorMap = {
      cyan: { 
        primary: '#22d3ee', 
        secondary: '#06b6d4', 
        rgb: '34, 211, 238',
        light: '#cffafe'
      },
      purple: { 
        primary: '#a855f7', 
        secondary: '#9333ea', 
        rgb: '168, 85, 247',
        light: '#f3e8ff'
      },
      pink: { 
        primary: '#ec4899', 
        secondary: '#db2777', 
        rgb: '236, 72, 153',
        light: '#fce7f3'
      },
      blue: { 
        primary: '#3b82f6', 
        secondary: '#2563eb', 
        rgb: '59, 130, 246',
        light: '#dbeafe'
      },
    }

    const colors = colorMap[accentColor] || colorMap.cyan

    // Set CSS variables
    document.documentElement.style.setProperty('--color-accent', colors.primary)
    document.documentElement.style.setProperty('--color-accent-dark', colors.secondary)
    document.documentElement.style.setProperty('--color-accent-rgb', colors.rgb)
    document.documentElement.style.setProperty('--color-accent-light', colors.light)

    // Apply to body for dark mode
    if (darkMode) {
      document.body.style.backgroundColor = '#0f172a'
    } else {
      document.body.style.backgroundColor = '#ffffff'
    }

    // Apply animation speed
    const animationMap = {
      fast: '0.3s',
      normal: '0.6s',
      slow: '1.0s',
    }
    document.documentElement.style.setProperty('--animation-speed', animationMap[animationSpeed] || '0.6s')
  }, [accentColor, darkMode, animationSpeed])

  // Monitor socket connection
  useEffect(() => {
    if (!socket) {
      setConnected(false)
      return
    }

    const handleConnect = () => {
      console.log('✅ Socket connected')
      setConnected(true)
    }

    const handleDisconnect = () => {
      console.log('❌ Socket disconnected')
      setConnected(false)
    }

    const handleError = (error) => {
      console.error('🔴 Socket error:', error)
      setConnected(false)
    }

    // Add event listeners
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('error', handleError)

    // Check initial connection status
    if (socket.connected) {
      setConnected(true)
    }

    // Cleanup
    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('error', handleError)
    }
  }, [socket])

  // Handle login
  const handleLogin = (operatorName) => {
    setOperator(operatorName)
    setIsLoggedIn(true)
    localStorage.setItem('operator', operatorName)
    setCurrentPage('dashboard')
  }

  // Handle logout
  const handleLogout = () => {
    setOperator(null)
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
    localStorage.removeItem('operator')
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route 
          path="/login" 
          element={<LoginPage setIsLoggedIn={handleLogin} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        operator={operator}
        onLogout={handleLogout}
        connected={connected}
      />
      <div style={{ flex: 1, overflow: 'hidden', width: '100%' }}>
        {currentPage === 'dashboard' && (
          <Dashboard socket={socket} connected={connected} operator={operator} />
        )}
        {currentPage === 'settings' && (
          <SettingsPage operator={operator} />
        )}
      </div>
    </div>
  )
}

export default function App({ socket, connected, operator }) {
  return (
    <SettingsProvider>
      <Router>
        <AppContent socket={socket} connected={connected} operator={operator} />
      </Router>
    </SettingsProvider>
  )
}