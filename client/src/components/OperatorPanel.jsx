import { useState } from 'react';

export default function OperatorPanel({ socket, connected }) {
  const [msg, setMsg] = useState('');

  function sendCommand(type) {
    if (!connected || !socket) { setMsg('Disconnected!'); return; }
    socket.emit('command', { type });
    setMsg(`Sent command: ${type}`);
    // Listen for responses
    socket.once('commandResponse', (data) => {
      setMsg(data.result);
    });
  }

  return (
    <div className="bg-slate-900/80 border border-cyan-500/30 rounded-lg p-4 mb-2">
      <h3 className="text-cyan-400 font-bold mb-2">Operator Controls</h3>
      <div className="flex gap-3 mb-2">
        <button
          className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-500 transition"
          onClick={() => sendCommand('resetPath')}
        >
          Reset Path
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-500 transition"
          onClick={() => sendCommand('resetTelemetry')}
        >
          Reset Telemetry
        </button>
        {/* Add more buttons for new commands */}
      </div>
      <div className="text-sm text-emerald-400">{msg}</div>
    </div>
  );
}