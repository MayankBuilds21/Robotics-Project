export default function LogsPanel({ logs }) {
  return (
    <div className="w-full h-full flex flex-col px-4 py-3 overflow-hidden">
      <h3 className="text-cyan-400 font-bold text-sm mb-2">EVENT LOGS</h3>
      <div className="flex-1 overflow-y-auto font-mono text-xs text-slate-400 space-y-1">
        {logs.length === 0 ? (
          <p className="text-slate-500">Waiting for telemetry data...</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span className="text-slate-500">[{log.timestamp}]</span>
              <span className={
                log.type === 'info' ? 'text-cyan-400' :
                log.type === 'warning' ? 'text-yellow-400 font-bold' :
                log.type === 'alert' ? 'text-red-400 font-extrabold' :
                'text-cyan-400'
              }>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}