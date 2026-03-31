import React, { useState } from 'react';
import './ManualMode.css';

const ManualMode = () => {
  const [speed, setSpeed] = useState(50);
  const [status, setStatus] = useState('');
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0, heading: 0 });
  const [telemetry, setTelemetry] = useState(null);

  const sendCommand = async (action, payload = {}) => {
    try {
      const response = await fetch(`/api/manual/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        if (data.telemetry?.sensors?.currentPosition) {
          setRobotPosition(data.telemetry.sensors.currentPosition);
        }
        setTelemetry(data.telemetry);
        setStatus(`✅ ${action.toUpperCase()} - Speed: ${speed}%`);
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Command failed');
    }
  };

  const moveForward = () => sendCommand('move', { direction: 'FORWARD', speed });
  const moveBackward = () => sendCommand('move', { direction: 'BACKWARD', speed });
  const moveLeft = () => sendCommand('move', { direction: 'LEFT', speed });
  const moveRight = () => sendCommand('move', { direction: 'RIGHT', speed });
  const stopRobot = () => sendCommand('stop');
  const rotateLeft = () => sendCommand('rotate', { angle: -45, speed });
  const rotateRight = () => sendCommand('rotate', { angle: 45, speed });

  return (
    <div className="manual-mode">
      <h2>🎮 Manual Control - YOU control where the robot goes!</h2>

      <div className="info-banner">
        <p>💡 Robot follows your exact commands. Send commands and watch it move.</p>
      </div>

      <div className="speed-control">
        <label>Speed: {speed}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <div className="controls">
        <div className="movement-pad">
          <button className="btn-up" onClick={moveForward}>▲</button>
          <div className="middle-row">
            <button className="btn-left" onClick={moveLeft}>◄</button>
            <button className="btn-stop" onClick={stopRobot}>STOP</button>
            <button className="btn-right" onClick={moveRight}>►</button>
          </div>
          <button className="btn-down" onClick={moveBackward}>▼</button>
        </div>

        <div className="rotation-controls">
          <button onClick={rotateLeft}>↙ Rotate Left</button>
          <button onClick={rotateRight}>Rotate Right ↘</button>
        </div>
      </div>

      <div className="robot-status">
        <h3>Robot Position (Actual):</h3>
        <div className="position-display">
          <p>X: {robotPosition.x.toFixed(2)} m</p>
          <p>Y: {robotPosition.y.toFixed(2)} m</p>
          <p>Heading: {robotPosition.heading.toFixed(1)}°</p>
        </div>
      </div>

      <div className="status-display">
        {status}
      </div>

      {telemetry && (
        <div className="telemetry-display">
          <h4>Last Telemetry:</h4>
          <p>Command: {telemetry.commandExecuted?.command}</p>
          <p>Battery: {telemetry.sensors.battery.toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
};

export default ManualMode;