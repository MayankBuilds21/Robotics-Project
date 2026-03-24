import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Express and HTTP Server
const app = express()
const httpServer = createServer(app)

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
  maxHttpBufferSize: 1e6,
})

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Store connected clients and their states
const connectedClients = new Map()
const robotStates = new Map()

// ==================== REST API Endpoints ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size,
  })
})

// Get connection status
app.get('/api/status', (req, res) => {
  res.json({
    connected: true,
    clientCount: connectedClients.size,
    timestamp: new Date().toISOString(),
  })
})

// Get all connected clients
app.get('/api/clients', (req, res) => {
  const clients = Array.from(connectedClients.values()).map(client => ({
    id: client.id,
    operator: client.operator,
    connectedAt: client.connectedAt,
  }))
  res.json(clients)
})

// Get robot state
app.get('/api/robot/:id', (req, res) => {
  const state = robotStates.get(req.params.id)
  if (!state) {
    return res.status(404).json({ error: 'Robot not found' })
  }
  res.json(state)
})

// ==================== Socket.IO Events ====================

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id)

  // Store client info
  const clientInfo = {
    id: socket.id,
    operator: null,
    connectedAt: new Date(),
    lastSeen: new Date(),
  }
  connectedClients.set(socket.id, clientInfo)

  // Broadcast connection count to all clients
  io.emit('clientCount', { count: connectedClients.size })

  // ==================== Operator Management ====================

  // Operator login event
  socket.on('operator:login', (data) => {
    const { operatorName } = data
    if (!operatorName) {
      socket.emit('error', { message: 'Operator name is required' })
      return
    }

    clientInfo.operator = operatorName
    connectedClients.set(socket.id, clientInfo)

    console.log(`👤 Operator logged in: ${operatorName} (${socket.id})`)

    // Notify all clients
    io.emit('operator:joined', {
      operator: operatorName,
      clientId: socket.id,
      timestamp: new Date().toISOString(),
    })

    // Send confirmation
    socket.emit('operator:loginSuccess', {
      operator: operatorName,
      clientId: socket.id,
    })
  })

  // Operator logout event
  socket.on('operator:logout', () => {
    const operator = clientInfo.operator
    clientInfo.operator = null

    if (operator) {
      console.log(`👤 Operator logged out: ${operator} (${socket.id})`)

      io.emit('operator:left', {
        operator,
        clientId: socket.id,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // ==================== Telemetry Events ====================

  // Send telemetry data periodically
  let telemetryInterval = null

  socket.on('telemetry:start', () => {
    if (telemetryInterval) {
      clearInterval(telemetryInterval)
    }

    console.log('📊 Telemetry stream started for:', socket.id)

    // Generate random telemetry data
    const generateTelemetry = () => {
      const telemetry = {
        current: {
          lat: 19.0760 + (Math.random() - 0.5) * 0.02,
          lon: 72.8777 + (Math.random() - 0.5) * 0.02,
          battery: 11.5 + (Math.random() - 0.5) * 2,
          roll: Math.sin(Date.now() / 1000) * 15,
          pitch: Math.cos(Date.now() / 1000) * 15,
          yaw: (Date.now() / 100) % 360,
          signal: -75 + Math.random() * 15,
          speed: Math.random() * 5,
          packetLoss: Math.max(0, Math.random() * 10 - 5),
          timestamp: new Date().toISOString(),
        },
        path: [],
      }

      // Store robot state
      robotStates.set(socket.id, telemetry.current)

      return telemetry
    }

    // Send telemetry every 500ms
    telemetryInterval = setInterval(() => {
      const telemetry = generateTelemetry()
      socket.emit('telemetry', telemetry)

      // Also broadcast to all connected clients
      io.emit('telemetry:update', {
        clientId: socket.id,
        data: telemetry.current,
      })
    }, 500)
  })

  socket.on('telemetry:stop', () => {
    if (telemetryInterval) {
      clearInterval(telemetryInterval)
      telemetryInterval = null
      console.log('📊 Telemetry stream stopped for:', socket.id)
    }
  })

  // ==================== Command Events ====================

  // Handle robot commands from client
  socket.on('command:send', (data) => {
    const { command, params } = data

    console.log(`🎮 Command received: ${command}`, params)

    // Process command
    switch (command) {
      case 'move':
        socket.emit('command:ack', {
          command,
          status: 'success',
          message: `Robot moving to ${params.lat}, ${params.lon}`,
        })
        break
      case 'stop':
        socket.emit('command:ack', {
          command,
          status: 'success',
          message: 'Robot stopped',
        })
        break
      case 'emergency_stop':
        socket.emit('command:ack', {
          command,
          status: 'success',
          message: 'Emergency stop activated',
        })
        // Notify all clients
        io.emit('emergency:triggered', {
          clientId: socket.id,
          timestamp: new Date().toISOString(),
        })
        break
      default:
        socket.emit('command:ack', {
          command,
          status: 'error',
          message: `Unknown command: ${command}`,
        })
    }

    // Broadcast command to all clients
    io.emit('command:executed', {
      clientId: socket.id,
      command,
      params,
      timestamp: new Date().toISOString(),
    })
  })

  // ==================== Settings Events ====================

  socket.on('settings:update', (data) => {
    console.log('⚙️ Settings updated:', data)

    // Store settings per client
    clientInfo.settings = data

    // Broadcast to all clients
    io.emit('settings:changed', {
      clientId: socket.id,
      settings: data,
      timestamp: new Date().toISOString(),
    })

    // Confirm receipt
    socket.emit('settings:saved', {
      status: 'success',
      message: 'Settings saved successfully',
    })
  })

  socket.on('settings:get', () => {
    socket.emit('settings:data', clientInfo.settings || {})
  })

  // ==================== Logs Events ====================

  socket.on('log:send', (data) => {
    const { message, level, timestamp } = data

    console.log(`📝 [${level}] ${message}`)

    // Broadcast logs to all connected clients
    io.emit('log:received', {
      clientId: socket.id,
      message,
      level,
      timestamp,
    })
  })

  socket.on('logs:export', () => {
    socket.emit('logs:data', {
      logs: Array.from(robotStates.values()),
      timestamp: new Date().toISOString(),
    })
  })

  // ==================== Heartbeat ====================

  socket.on('ping', () => {
    clientInfo.lastSeen = new Date()
    socket.emit('pong', { timestamp: new Date().toISOString() })
  })

  // ==================== Error Handling ====================

  socket.on('error', (error) => {
    console.error('🔴 Socket error:', error)
    socket.emit('error:response', {
      message: 'An error occurred',
      error: error.message,
    })
  })

  // ==================== Disconnect Handling ====================

  socket.on('disconnect', (reason) => {
    const operator = clientInfo.operator
    connectedClients.delete(socket.id)
    robotStates.delete(socket.id)

    console.log(`❌ Client disconnected: ${socket.id} (Reason: ${reason})`)
    if (operator) {
      console.log(`👤 Operator disconnected: ${operator}`)
    }

    // Clear telemetry interval if active
    if (telemetryInterval) {
      clearInterval(telemetryInterval)
    }

    // Broadcast disconnection to all remaining clients
    io.emit('client:disconnected', {
      clientId: socket.id,
      operator,
      reason,
      timestamp: new Date().toISOString(),
    })

    // Update client count
    io.emit('clientCount', { count: connectedClients.size })
  })

  // ==================== Connection Success ====================

  // Send initial connection info
  socket.emit('connection:success', {
    clientId: socket.id,
    timestamp: new Date().toISOString(),
    serverInfo: {
      name: 'Mission Control Server',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
  })
})

// ==================== Error Handling Middleware ====================

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// ==================== 404 Handler ====================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  })
})

// ==================== Server Startup ====================

const PORT = process.env.PORT || 5173
const HOST = process.env.HOST || 'localhost'

httpServer.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     🤖 MISSION CONTROL SERVER STARTED     ║
╠════════════════════════════════════════════╣
║ 🚀 Server: http://${HOST}:${PORT}
║ 🔌 WebSocket: ws://${HOST}:${PORT}
║ 📡 CORS Enabled
║ 🌍 Environment: ${process.env.NODE_ENV || 'development'}
║ 👥 Connected Clients: ${connectedClients.size}
╚════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📦 SIGTERM received, shutting down gracefully...')
  httpServer.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('📦 SIGINT received, shutting down gracefully...')
  httpServer.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

export { app, httpServer, io }