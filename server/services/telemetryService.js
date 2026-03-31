const EventEmitter = require('events');

class TelemetryService extends EventEmitter {
  constructor() {
    super();
    this.robotState = {
      x: 0,
      y: 0,
      heading: 0,
      speed: 0,
      battery: 100,
      obstacles: [],
      timestamp: new Date()
    };
  }

  // AI MODE: Generate random/simulated telemetry
  generateAITelemetry() {
    return {
      mode: 'AI',
      sensors: {
        frontDistance: Math.random() * 300 + 50,
        leftDistance: Math.random() * 300 + 50,
        rightDistance: Math.random() * 300 + 50,
        accelerometer: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: 9.8 + (Math.random() - 0.5) * 0.5
        },
        gyroscope: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10,
          z: (Math.random() - 0.5) * 10
        },
        position: {
          x: this.robotState.x + (Math.random() - 0.5) * 5,
          y: this.robotState.y + (Math.random() - 0.5) * 5,
          heading: this.robotState.heading + (Math.random() - 0.5) * 5
        },
        temperature: 25 + (Math.random() - 0.5) * 2,
        humidity: 60 + (Math.random() - 0.5) * 10,
        battery: Math.max(0, this.robotState.battery - Math.random() * 0.1)
      },
      aiAnalysis: {
        threatsDetected: Math.random() > 0.7,
        recommendedAction: this.getRandomAIAction(),
        confidence: Math.random() * 0.4 + 0.6
      },
      timestamp: new Date(),
      isSimulated: true
    };
  }

  // MANUAL MODE: Generate telemetry based on actual commands
  generateManualTelemetry(lastCommand) {
    if (lastCommand) {
      this.applyCommandToState(lastCommand);
    }

    return {
      mode: 'MANUAL',
      sensors: {
        currentPosition: {
          x: this.robotState.x,
          y: this.robotState.y,
          heading: this.robotState.heading
        },
        frontDistance: 250 + (Math.random() - 0.5) * 20,
        leftDistance: 200 + (Math.random() - 0.5) * 20,
        rightDistance: 200 + (Math.random() - 0.5) * 20,
        accelerometer: {
          x: (lastCommand?.direction === 'LEFT' ? -1 : lastCommand?.direction === 'RIGHT' ? 1 : 0),
          y: (lastCommand?.direction === 'FORWARD' ? this.robotState.speed / 100 : 
              lastCommand?.direction === 'BACKWARD' ? -this.robotState.speed / 100 : 0),
          z: 9.81
        },
        gyroscope: {
          x: 0,
          y: 0,
          z: lastCommand?.action === 'ROTATE' ? lastCommand.angle * 0.1 : 0
        },
        battery: this.robotState.battery
      },
      commandExecuted: {
        command: lastCommand?.action || 'IDLE',
        direction: lastCommand?.direction || null,
        speed: lastCommand?.speed || 0,
        status: 'SUCCESS'
      },
      timestamp: new Date(),
      isSimulated: false
    };
  }

  applyCommandToState(command) {
    if (!command) return;

    const speedFactor = (command.speed || 50) / 100;

    switch (command.direction) {
      case 'FORWARD':
        this.robotState.x += 5 * speedFactor;
        this.robotState.y += 5 * speedFactor;
        break;
      case 'BACKWARD':
        this.robotState.x -= 5 * speedFactor;
        this.robotState.y -= 5 * speedFactor;
        break;
      case 'LEFT':
        this.robotState.x -= 3 * speedFactor;
        break;
      case 'RIGHT':
        this.robotState.x += 3 * speedFactor;
        break;
    }

    if (command.action === 'ROTATE') {
      this.robotState.heading += command.angle;
    }

    if (command.action !== 'STOP') {
      this.robotState.battery -= 0.05;
    }

    this.robotState.speed = command.speed || 0;
  }

  getRandomAIAction() {
    const actions = ['MOVE_FORWARD', 'TURN_LEFT', 'TURN_RIGHT', 'STOP_AND_ASSESS'];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  getRobotState() {
    return { ...this.robotState };
  }

  resetState() {
    this.robotState = {
      x: 0,
      y: 0,
      heading: 0,
      speed: 0,
      battery: 100,
      obstacles: [],
      timestamp: new Date()
    };
  }
}

module.exports = new TelemetryService();