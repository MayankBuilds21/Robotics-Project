import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Base coordinates (Mumbai, India)
const BASE_LAT = 19.0760;
const BASE_LON = 72.8777;

// Store robot state
let robotState = {
  lat: BASE_LAT,
  lon: BASE_LON,
  battery: 11.5,
  roll: 0,
  pitch: 0,
  yaw: 0,
  signal: -75,
  speed: 0,
  packetLoss: 0,
  lastUpdate: new Date()
};

// Store path history
let pathHistory = [{ lat: BASE_LAT, lon: BASE_LON }];
const MAX_PATH_POINTS = 500;

// Generate random telemetry data
function generateTelemetry() {
  const randomOffset = (Math.random() - 0.5) * 0.01;

  return {
    lat: BASE_LAT + randomOffset,
    lon: BASE_LON + randomOffset,
    battery: 10 + Math.random() * 2.5,
    roll: (Math.random() - 0.5) * 20,
    pitch: (Math.random() - 0.5) * 20,
    yaw: Math.random() * 360,
    signal: -90 + Math.random() * 30,
    speed: Math.random() * 5,
    packetLoss: Math.floor(Math.random() * 5),
    timestamp: new Date().toISOString()
  };
}

// Broadcast telemetry to all connected clients
function broadcastTelemetry() {
  const telemetry = generateTelemetry();

  // Update robot state
  robotState = {
    ...robotState,
    ...telemetry
  };

  // Add to path history
  pathHistory.push({ 
    lat: telemetry.lat, 
    lon: telemetry.lon,
    timestamp: telemetry.timestamp
  });

  // Keep path history manageable
  if (pathHistory.length > MAX_PATH_POINTS) {
    pathHistory.shift();
  }

  // Emit to all connected clients
  io.emit('telemetry', {
    current: robotState,
    path: pathHistory
  });
}

// REST endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    robot: robotState,
    pathLength: pathHistory.length
  });
});

app.get('/api/path', (req, res) => {
  res.json({ path: pathHistory });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);

  // Send current state to newly connected client
  socket.emit('telemetry', {
    current: robotState,
    path: pathHistory
  });

  socket.on('disconnect', () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
  });

  // Listen for client command events
  socket.on('command', (data) => {
    console.log(`✈️ Command from UI:`, data);

    if (data.type === 'resetPath') {
      pathHistory = [{ lat: BASE_LAT, lon: BASE_LON }];
      io.emit('telemetry', {
        current: robotState,
        path: pathHistory
      });
      socket.emit('commandResponse', { result: 'Path reset!' });
    }
    if (data.type === 'resetTelemetry') {
      robotState = {
        lat: BASE_LAT,
        lon: BASE_LON,
        battery: 11.5,
        roll: 0,
        pitch: 0,
        yaw: 0,
        signal: -75,
        speed: 0,
        packetLoss: 0,
        lastUpdate: new Date()
      };
      socket.emit('commandResponse', { result: 'Telemetry reset!' });
    }
    // Add more commands as needed
  });
});

// Telemetry broadcast interval (1 second)
setInterval(broadcastTelemetry, 1000);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   🤖 ROBOT TELEMETRY MISSION CONTROL SERVER 🤖    ║
╚════════════════════════════════════════════════════╝

  Server running on: http://localhost:${PORT}
  WebSocket endpoint: ws://localhost:${PORT}
  
  Broadcasting telemetry every 1 second...
  Status: ONLINE ✓
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Server shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});