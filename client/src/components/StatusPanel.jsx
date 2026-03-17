import { useEffect, useState } from 'react';

export default function StatusPanel({ telemetry, connected }) {
  const [ping, setPing] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    if (!telemetry || !telemetry.current) return;

    // Update last telemetry time
    setLastUpdate(
      telemetry.current.timestamp
        ? new Date(telemetry.current.timestamp).toLocaleTimeString()
        : new Date().toLocaleTimeString()
    );

    // Estimate ping: current time - telemetry time
    if (telemetry.current.timestamp) {
      const now = Date.now();
      const t = new Date(telemetry.current.timestamp).getTime();
      setPing(now - t);
    }
  }, [telemetry]);

  return (
    <div className="bg-slate-900/80 border border-cyan-500/20 rounded-lg px-4 py-3 mb-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
        <span className="font-bold text-lg">{connected ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}</span>
      </div>
      <div className="flex gap-6">
        <div className="text-cyan-400 font-mono text-xs">Ping: {ping !== null ? `${ping} ms` : '--'}</div>
        <div className="text-emerald-400 font-mono text-xs">Last Update: {lastUpdate}</div>
        <div className="text-orange-400 font-mono text-xs">Packet Loss: {telemetry.current.packetLoss || 0}%</div>
      </div>
    </div>
  );
}