import React from 'react'
import ReactDOM from 'react-dom/client'
import { io } from 'socket.io-client'
import App from './App.jsx'
import './index.css'

// Initialize Socket.IO connection
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5173'

console.log('🔌 Connecting to socket server:', SOCKET_URL)

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  autoConnect: true,
})

// Socket event listeners
socket.on('connect', () => {
  console.log('✅ Socket connected with ID:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.warn('❌ Socket disconnected:', reason)
})

socket.on('connect_error', (error) => {
  console.error('🔴 Connection error:', error)
})

socket.on('error', (error) => {
  console.error('🔴 Socket error:', error)
})

// Initial state
const initialState = {
  socket,
  connected: socket.connected,
  operator: localStorage.getItem('operator') || null,
}

// Render App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App 
      socket={socket} 
      connected={initialState.connected}
      operator={initialState.operator}
    />
  </React.StrictMode>,
)

// Log connection status
socket.on('connect', () => {
  console.log('Socket.IO connected')
})

socket.on('disconnect', () => {
  console.log('Socket.IO disconnected')
})