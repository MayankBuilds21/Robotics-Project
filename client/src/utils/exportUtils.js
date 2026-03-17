import { saveAs } from 'file-saver';

export function exportLogsCSV(logs) {
  if (!logs || !logs.length) return;
  const csv = [
    ['Timestamp', 'Type', 'Message'],
    ...logs.map(log => [log.timestamp, log.type, `"${log.message.replace(/"/g,'""')}"`])
  ].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `telemetry-logs-${new Date().toISOString().slice(0,10)}.csv`);
}

export function exportTelemetryPathCSV(path) {
  if (!path || !path.length) return;
  const csv = [
    ['Timestamp', 'Latitude', 'Longitude'],
    ...path.map(p => [p.timestamp || '', p.lat, p.lon])
  ].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `telemetry-path-${new Date().toISOString().slice(0,10)}.csv`);
}

export function exportCurrentTelemetryCSV(current) {
  if (!current) return;
  const csv = [
    ['Key', 'Value'],
    ...Object.entries(current).map(([k, v]) => [k, JSON.stringify(v)])
  ].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `telemetry-current-${new Date().toISOString().slice(0,10)}.csv`);
}