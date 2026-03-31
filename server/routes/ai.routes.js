const express = require('express');
const router = express.Router();
const robotCommandService = require('../services/robotCommandService');
const telemetryService = require('../services/telemetryService');

let aiMode = {
  isRunning: false,
  interval: null,
  decision: null
};

// AI: Get telemetry (simulated)
router.get('/telemetry', (req, res) => {
  try {
    const telemetry = telemetryService.generateAITelemetry();

    res.json({
      success: true,
      mode: 'AI',
      telemetry: telemetry,
      message: 'Simulated AI telemetry data'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// AI: Generate decision
router.post('/decision', async (req, res) => {
  try {
    const telemetry = telemetryService.generateAITelemetry();
    const aiDecision = makeAIDecision(telemetry.sensors);

    aiMode.decision = aiDecision;

    res.json({
      success: true,
      mode: 'AI',
      decision: aiDecision,
      telemetry: telemetry,
      message: 'AI decision generated from simulated sensors'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// AI: Start autonomous mode
router.post('/start', async (req, res) => {
  try {
    if (aiMode.isRunning) {
      return res.status(400).json({
        success: false,
        message: 'AI is already running'
      });
    }

    aiMode.isRunning = true;
    let decisionCount = 0;

    aiMode.interval = setInterval(async () => {
      try {
        const telemetry = telemetryService.generateAITelemetry();
        const aiDecision = makeAIDecision(telemetry.sensors);
        
        aiMode.decision = aiDecision;
        decisionCount++;

        console.log(`🤖 AI Decision #${decisionCount}:`, aiDecision);

        await robotCommandService.sendAICommand(aiDecision);

      } catch (error) {
        console.error('❌ AI Decision Error:', error);
      }
    }, 2000);

    res.json({
      success: true,
      mode: 'AI',
      message: 'AI autonomous mode started',
      isRunning: true,
      decisionInterval: 2000
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// AI: Stop autonomous mode
router.post('/stop', (req, res) => {
  try {
    if (!aiMode.isRunning) {
      return res.status(400).json({
        success: false,
        message: 'AI is not running'
      });
    }

    clearInterval(aiMode.interval);
    aiMode.isRunning = false;
    aiMode.interval = null;

    res.json({
      success: true,
      mode: 'AI',
      message: 'AI autonomous mode stopped',
      isRunning: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// AI: Get status
router.get('/status', (req, res) => {
  res.json({
    mode: 'AI',
    isRunning: aiMode.isRunning,
    currentDecision: aiMode.decision,
    telemetryType: 'SIMULATED (Random Sensor Data)',
    timestamp: new Date()
  });
});

// AI Decision Logic
function makeAIDecision(sensorData) {
  const { frontDistance, leftDistance, rightDistance } = sensorData;

  const obstacleThreshold = 100;
  const frontObstacle = frontDistance < obstacleThreshold;
  const leftObstacle = leftDistance < obstacleThreshold;
  const rightObstacle = rightDistance < obstacleThreshold;

  let decision = {
    direction: 'FORWARD',
    speed: 50,
    angle: 0,
    reasoning: ''
  };

  if (frontObstacle) {
    if (!rightObstacle) {
      decision.direction = 'RIGHT';
      decision.reasoning = 'Obstacle ahead - turning right (simulated)';
    } else if (!leftObstacle) {
      decision.direction = 'LEFT';
      decision.reasoning = 'Obstacle ahead - turning left (simulated)';
    } else {
      decision.direction = 'BACKWARD';
      decision.speed = 30;
      decision.reasoning = 'Surrounded by obstacles - backing up (simulated)';
    }
  } else {
    decision.direction = 'FORWARD';
    decision.speed = Math.random() * 50 + 50;
    decision.reasoning = 'Path clear - moving forward (simulated)';
  }

  return {
    ...decision,
    confidence: Math.random() * 0.3 + 0.7,
    timestamp: new Date(),
    sensorReadings: {
      front: frontDistance.toFixed(1),
      left: leftDistance.toFixed(1),
      right: rightDistance.toFixed(1)
    }
  };
}

module.exports = router;