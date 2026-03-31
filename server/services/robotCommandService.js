const loraService = require('./loraService');

class RobotCommandService {
  constructor() {
    this.lastCommand = null;
    this.commandQueue = [];
  }

  async sendManualCommand(command) {
    try {
      const formattedCommand = {
        id: Date.now(),
        mode: 'MANUAL',
        action: command.action,
        direction: command.direction,
        speed: Math.min(Math.max(command.speed, 0), 100),
        angle: command.angle || 0,
        timestamp: new Date(),
        userInitiated: true
      };

      console.log('📡 Sending Manual Command via LoRa:', formattedCommand);
      await this.simulateLoraTransmission(formattedCommand);

      this.lastCommand = formattedCommand;
      this.commandQueue.push(formattedCommand);

      return {
        success: true,
        command: formattedCommand,
        message: `Manual command sent: ${command.action}`,
        deliveryStatus: 'DELIVERED'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        deliveryStatus: 'FAILED'
      };
    }
  }

  async sendAICommand(aiDecision) {
    try {
      const aiCommand = {
        id: Date.now(),
        mode: 'AI',
        action: 'AI_AUTONOMOUS',
        direction: aiDecision.direction || 'FORWARD',
        speed: aiDecision.speed || 50,
        angle: aiDecision.angle || 0,
        timestamp: new Date(),
        aiGenerated: true,
        confidence: aiDecision.confidence || 0.8
      };

      console.log('🤖 Sending AI Command via LoRa:', aiCommand);
      await this.simulateLoraTransmission(aiCommand);

      this.lastCommand = aiCommand;
      this.commandQueue.push(aiCommand);

      return {
        success: true,
        command: aiCommand,
        message: 'AI command executed',
        deliveryStatus: 'DELIVERED'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        deliveryStatus: 'FAILED'
      };
    }
  }

  encodeLoraCommand(command) {
    return JSON.stringify({
      mode: command.mode,
      action: command.action,
      dir: command.direction?.[0] || 'F',
      spd: command.speed,
      angle: command.angle,
      ts: command.timestamp.getTime()
    });
  }

  simulateLoraTransmission(payload) {
    return new Promise((resolve) => {
      const delay = Math.random() * 200 + 100;
      setTimeout(() => {
        console.log(`✅ LoRa transmission complete (${delay.toFixed(0)}ms)`);
        resolve();
      }, delay);
    });
  }

  getLastCommand() {
    return this.lastCommand;
  }

  getCommandHistory(limit = 10) {
    return this.commandQueue.slice(-limit);
  }

  clearCommandQueue() {
    this.commandQueue = [];
  }
}

module.exports = new RobotCommandService();