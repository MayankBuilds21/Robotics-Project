import React, { useState, useEffect } from 'react';
import './AIMode.css';

const AIMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [aiDecision, setAiDecision] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [decisionCount, setDecisionCount] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/ai/decision', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
          setAiDecision(data.decision);
          setTelemetry(data.telemetry);
          setDecisionCount(prev => prev + 1);
          setStatus('✅ New AI decision generated from SIMULATED sensors');
        }
      } catch (error) {
        console.error('Error:', error);
        setStatus('❌ Error getting AI decision');
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleAI = async () => {
    try {
      const endpoint = isRunning ? '/api/ai/stop' : '/api/ai/start';
      const response = await fetch(endpoint, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setIsRunning(!isRunning);
        if (isRunning) setDecisionCount(0);
        setStatus(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Error toggling AI');
    }
  };

  return (
    <div className="ai-mode">
      <h2>🤖 AI Mode - Robot makes autonomous decisions!</h2>

      <div className="info-banner">
        <p>📊 Robot generates telemetry from SIMULATED/RANDOM sensors and makes autonomous decisions.</p>
        <p>🧠 Robot decides where to go - NOT your input.</p>
      </div>

      <div className="ai-status">
        <div className={`status-indicator ${isRunning ? 'active' : ''}`}>
          {isRunning ? '🔴 Running' : '⚪ Stopped'}
        </div>
        <p>{status}</p>
      </div>

      <button className={`toggle-btn ${isRunning ? 'stop' : 'start'}`} onClick={toggleAI}>
        {isRunning ? 'Stop AI' : 'Start AI'}
      </button>

      {telemetry && (
        <div className="telemetry-section">
          <h3>Simulated Sensor Readings (Random):</h3>
          <div className="sensor-grid">
            <div className="sensor-card">
              <p><strong>Front:</strong> {telemetry.sensors.frontDistance.toFixed(1)} cm</p>
            </div>
            <div className="sensor-card">
              <p><strong>Left:</strong> {telemetry.sensors.leftDistance.toFixed(1)} cm</p>
            </div>
            <div className="sensor-card">
              <p><strong>Right:</strong> {telemetry.sensors.rightDistance.toFixed(1)} cm</p>
            </div>
            <div className="sensor-card">
              <p><strong>Temp:</strong> {telemetry.sensors.temperature.toFixed(1)}°C</p>
            </div>
          </div>
        </div>
      )}

      {aiDecision && (
        <div className="ai-decision-section">
          <h3>AI Decision #{decisionCount}:</h3>
          <div className="decision-card">
            <p><strong>Direction:</strong> {aiDecision.direction}</p>
            <p><strong>Speed:</strong> {aiDecision.speed}%</p>
            <p><strong>Confidence:</strong> {(aiDecision.confidence * 100).toFixed(1)}%</p>
            <p><strong>Reasoning:</strong> {aiDecision.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMode;