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
const modeStates = new Map()

// ==================== REST API Endpoints ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size,
  })
})

app.get('/api/status', (req, res) => {
  res.json({
    connected: true,
    clientCount: connectedClients.size,
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/clients', (req, res) => {
  const clients = Array.from(connectedClients.values()).map(client => ({
    id: client.id,
    operator: client.operator,
    mode: modeStates.get(client.id) || 'MANUAL',
    connectedAt: client.connectedAt,
  }))
  res.json(clients)
})

app.get('/api/robot/:id', (req, res) => {
  const state = robotStates.get(req.params.id)
  if (!state) {
    return res.status(404).json({ error: 'Robot not found' })
  }
  res.json(state)
})

app.get('/api/mode/current/:clientId', (req, res) => {
  const mode = modeStates.get(req.params.clientId) || 'MANUAL'
  res.json({ mode, timestamp: new Date().toISOString() })
})

app.post('/api/mode/switch/:clientId/:mode', (req, res) => {
  const { clientId, mode } = req.params
  if (!['AI', 'MANUAL'].includes(mode)) {
    return res.status(400).json({ error: 'Invalid mode' })
  }
  
  modeStates.set(clientId, mode)
  io.to(clientId).emit('mode:switched', { mode })
  
  res.json({ success: true, mode, message: `Switched to ${mode} mode` })
})

// ==================== Socket.IO Events ====================

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id)

  const clientInfo = {
    id: socket.id,
    operator: null,
    connectedAt: new Date(),
    lastSeen: new Date(),
    mode: 'MANUAL',
    isMoving: false,
  }
  connectedClients.set(socket.id, clientInfo)
  modeStates.set(socket.id, 'MANUAL')

  // Initialize robot state with static position
  const initialRobotState = {
    lat: 19.0760,
    lon: 72.8777,
    battery: 11.5,
    roll: 0,
    pitch: 0,
    yaw: 0,
    signal: -75,
    speed: 0,
    packetLoss: 0,
    timestamp: new Date().toISOString(),
    mode: 'MANUAL',
  }
  robotStates.set(socket.id, initialRobotState)

  io.emit('clientCount', { count: connectedClients.size })

  // ==================== Operator Management ====================

  socket.on('operator:login', (data) => {
    const { operatorName } = data
    if (!operatorName) {
      socket.emit('error', { message: 'Operator name is required' })
      return
    }

    clientInfo.operator = operatorName
    connectedClients.set(socket.id, clientInfo)

    console.log(`👤 Operator logged in: ${operatorName} (${socket.id})`)

    io.emit('operator:joined', {
      operator: operatorName,
      clientId: socket.id,
      mode: clientInfo.mode,
      timestamp: new Date().toISOString(),
    })

    socket.emit('operator:loginSuccess', {
      operator: operatorName,
      clientId: socket.id,
      mode: clientInfo.mode,
    })
  })

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

  // ==================== MODE EVENTS ====================

  socket.on('mode:switchAI', () => {
    clientInfo.mode = 'AI'
    modeStates.set(socket.id, 'AI')
    console.log(`🤖 AI Mode activated for ${socket.id}`)
    
    io.emit('mode:switched', {
      clientId: socket.id,
      mode: 'AI',
      timestamp: new Date().toISOString(),
    })
  })

  socket.on('mode:switchManual', () => {
    clientInfo.mode = 'MANUAL'
    modeStates.set(socket.id, 'MANUAL')
    console.log(`🎮 Manual Mode activated for ${socket.id}`)
    
    io.emit('mode:switched', {
      clientId: socket.id,
      mode: 'MANUAL',
      timestamp: new Date().toISOString(),
    })
  })

  // ==================== Telemetry Events ====================

  let telemetryInterval = null

  socket.on('telemetry:start', () => {
    if (telemetryInterval) {
      clearInterval(telemetryInterval)
    }

    console.log('📊 Telemetry stream started for:', socket.id, `Mode: ${clientInfo.mode}`)

    // Send telemetry every 500ms WITHOUT random changes
    telemetryInterval = setInterval(() => {
      const currentState = robotStates.get(socket.id)
      
      if (currentState) {
        // Only add small signal noise, nothing else changes without command
        const telemetry = {
          current: {
            ...currentState,
            signal: -75 + Math.random() * 15, // Only signal has slight variation
            timestamp: new Date().toISOString(),
            mode: clientInfo.mode,
          },
          path: [],
        }

        socket.emit('telemetry', telemetry)
        io.emit('telemetry:update', {
          clientId: socket.id,
          data: telemetry.current,
        })
      }
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

  socket.on('command:send', (data) => {
    const { command, params } = data
    const currentState = robotStates.get(socket.id)

    console.log(`🎮 Command received (${clientInfo.mode}): ${command}`, params)

    if (!currentState) return

    switch (command) {
      case 'move':
        // Update position ONLY on move command
        currentState.lat = params.lat
        currentState.lon = params.lon
        currentState.speed = 2.5 // Set a speed while moving
        robotStates.set(socket.id, currentState)

        socket.emit('command:ack', {
          command,
          mode: clientInfo.mode,
          status: 'success',
          message: `[${clientInfo.mode}] Robot moved to ${params.lat.toFixed(4)}, ${params.lon.toFixed(4)}`,
        })
        console.log(`✅ Robot moved to: ${params.lat.toFixed(4)}, ${params.lon.toFixed(4)}`)
        break

      case 'rotate':
        // Update yaw/rotation ONLY on rotate command
        currentState.yaw = (params.angle || 0) % 360
        robotStates.set(socket.id, currentState)

        socket.emit('command:ack', {
          command,
          mode: clientInfo.mode,
          status: 'success',
          message: `[${clientInfo.mode}] Robot rotated to ${params.angle}°`,
        })
        console.log(`✅ Robot rotated to: ${params.angle}°`)
        break

      case 'stop':
        // Stop movement
        currentState.speed = 0
        robotStates.set(socket.id, currentState)

        socket.emit('command:ack', {
          command,
          mode: clientInfo.mode,
          status: 'success',
          message: `[${clientInfo.mode}] Robot stopped`,
        })
        console.log(`✅ Robot stopped at: ${currentState.lat.toFixed(4)}, ${currentState.lon.toFixed(4)}`)
        break

      case 'emergency_stop':
        // Emergency stop
        currentState.speed = 0
        robotStates.set(socket.id, currentState)

        socket.emit('command:ack', {
          command,
          mode: clientInfo.mode,
          status: 'success',
          message: '🚨 EMERGENCY STOP ACTIVATED',
        })

        io.emit('emergency:triggered', {
          clientId: socket.id,
          mode: clientInfo.mode,
          timestamp: new Date().toISOString(),
        })
        console.log(`🚨 EMERGENCY STOP for: ${socket.id}`)
        break

      default:
        socket.emit('command:ack', {
          command,
          mode: clientInfo.mode,
          status: 'error',
          message: `Unknown command: ${command}`,
        })
    }

    io.emit('command:executed', {
      clientId: socket.id,
      command,
      mode: clientInfo.mode,
      params,
      timestamp: new Date().toISOString(),
    })
  })

  // ==================== Settings Events ====================

  socket.on('settings:update', (data) => {
    console.log('⚙️ Settings updated:', data)

    clientInfo.settings = data

    io.emit('settings:changed', {
      clientId: socket.id,
      settings: data,
      timestamp: new Date().toISOString(),
    })

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

    io.emit('log:received', {
      clientId: socket.id,
      message,
      level,
      mode: clientInfo.mode,
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
    socket.emit('pong', { timestamp: new Date().toISOString(), mode: clientInfo.mode })
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
    const mode = modeStates.get(socket.id)
    connectedClients.delete(socket.id)
    robotStates.delete(socket.id)
    modeStates.delete(socket.id)

    console.log(`❌ Client disconnected: ${socket.id} (Reason: ${reason})`)
    if (operator) {
      console.log(`👤 Operator disconnected: ${operator} (Mode: ${mode})`)
    }

    if (telemetryInterval) {
      clearInterval(telemetryInterval)
    }

    io.emit('client:disconnected', {
      clientId: socket.id,
      operator,
      mode,
      reason,
      timestamp: new Date().toISOString(),
    })

    io.emit('clientCount', { count: connectedClients.size })
  })

  // ==================== Connection Success ====================

  socket.emit('connection:success', {
    clientId: socket.id,
    mode: clientInfo.mode,
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
║ 🤖 Mode Support: AI & MANUAL
║ ✅ Static Position Mode (No Random Movement)
╚════════════════════════════════════════════╝
  `)
})

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