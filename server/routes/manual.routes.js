const express = require('express');
const router = express.Router();
const robotCommandService = require('../services/robotCommandService');
const telemetryService = require('../services/telemetryService');

// MANUAL: Move robot
router.post('/move', async (req, res) => {
  try {
    const { direction, speed } = req.body;

    if (!direction) {
      return res.status(400).json({
        success: false,
        error: 'Direction required (FORWARD, BACKWARD, LEFT, RIGHT)'
      });
    }

    if (speed === undefined || speed < 0 || speed > 100) {
      return res.status(400).json({
        success: false,
        error: 'Speed must be between 0-100'
      });
    }

    const command = {
      action: 'MOVE',
      direction: direction.toUpperCase(),
      speed: speed
    };

    const result = await robotCommandService.sendManualCommand(command);

    if (result.success) {
      const telemetry = telemetryService.generateManualTelemetry(command);

      return res.json({
        success: true,
        command: result.command,
        telemetry: telemetry,
        message: `Robot moving ${direction} at ${speed}% speed`,
        mode: 'MANUAL'
      });
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// MANUAL: Stop robot
router.post('/stop', async (req, res) => {
  try {
    const command = {
      action: 'STOP',
      direction: null,
      speed: 0
    };

    const result = await robotCommandService.sendManualCommand(command);

    if (result.success) {
      const telemetry = telemetryService.generateManualTelemetry(command);

      return res.json({
        success: true,
        command: result.command,
        telemetry: telemetry,
        message: 'Robot stopped',
        mode: 'MANUAL'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// MANUAL: Rotate robot
router.post('/rotate', async (req, res) => {
  try {
    const { angle, speed } = req.body;

    if (!angle) {
      return res.status(400).json({
        success: false,
        error: 'Angle required'
      });
    }

    const command = {
      action: 'ROTATE',
      direction: angle > 0 ? 'RIGHT' : 'LEFT',
      speed: speed || 50,
      angle: angle
    };

    const result = await robotCommandService.sendManualCommand(command);

    if (result.success) {
      const telemetry = telemetryService.generateManualTelemetry(command);

      return res.json({
        success: true,
        command: result.command,
        telemetry: telemetry,
        message: `Robot rotating ${angle}°`,
        mode: 'MANUAL'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// MANUAL: Get status
router.get('/status', (req, res) => {
  const state = telemetryService.getRobotState();
  const lastCommand = robotCommandService.getLastCommand();

  res.json({
    mode: 'MANUAL',
    robotPosition: {
      x: state.x,
      y: state.y,
      heading: state.heading
    },
    robotState: {
      speed: state.speed,
      battery: state.battery.toFixed(1) + '%'
    },
    lastCommand: lastCommand,
    timestamp: new Date()
  });
});

// MANUAL: Get history
router.get('/history', (req, res) => {
  const history = robotCommandService.getCommandHistory(20);

  res.json({
    mode: 'MANUAL',
    commandCount: history.length,
    commands: history
  });
});

module.exports = router;