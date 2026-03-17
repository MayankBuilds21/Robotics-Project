import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function TelemetryCharts({ telemetry }) {
  const [batteryData, setBatteryData] = useState([])
  const [signalData, setSignalData] = useState([])
  const [rollData, setRollData] = useState([])
  const [pitchData, setPitchData] = useState([])
  const [yawData, setYawData] = useState([])
  const [labels, setLabels] = useState([])

  useEffect(() => {
    // Keep only last 20 data points
    setBatteryData(prev => [...prev, telemetry.battery].slice(-20))
    setSignalData(prev => [...prev, telemetry.signal].slice(-20))
    setRollData(prev => [...prev, telemetry.roll].slice(-20))
    setPitchData(prev => [...prev, telemetry.pitch].slice(-20))
    setYawData(prev => [...prev, telemetry.yaw].slice(-20))
    setLabels(prev => [...prev, new Date().toLocaleTimeString()].slice(-20))
  }, [telemetry])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#94a3b8',
          font: { size: 10 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        titleColor: '#22d3ee',
        bodyColor: '#e2e8f0',
        borderColor: '#22d3ee',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(34, 211, 238, 0.1)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      x: {
        grid: { color: 'rgba(34, 211, 238, 0.08)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  }

  const batteryChartData = {
    labels,
    datasets: [
      {
        label: 'Battery (V)',
        data: batteryData,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.15)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22d3ee',
        pointBorderColor: '#0f172a',
        pointRadius: 2,
        pointHoverRadius: 5
      }
    ]
  }

  const signalChartData = {
    labels,
    datasets: [
      {
        label: 'Signal (dBm)',
        data: signalData,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.18)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#0f172a',
        pointRadius: 2,
        pointHoverRadius: 5
      }
    ]
  }

  const orientationChartData = {
    labels,
    datasets: [
      {
        label: 'Roll (°)',
        data: rollData,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244,63,94,0.07)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f43f5e',
        pointBorderColor: '#0f172a',
        pointRadius: 2
      },
      {
        label: 'Pitch (°)',
        data: pitchData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.07)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#0f172a',
        pointRadius: 2
      },
      {
        label: 'Yaw (°)',
        data: yawData,
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251,191,36,0.07)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fbbf24',
        pointBorderColor: '#0f172a',
        pointRadius: 2
      }
    ]
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
      {/* Title */}
      <div className="px-4 py-3 border-b border-cyan-500/20">
        <h3 className="text-cyan-400 font-bold text-sm">LIVE TELEMETRY</h3>
      </div>

      {/* Charts */}
      <div className="flex-1 overflow-hidden grid grid-rows-3 gap-2 p-2">
        {/* Battery Chart */}
        <div className="bg-slate-950/50 rounded border border-cyan-500/20 p-2">
          {batteryData.length > 0 && <Line data={batteryChartData} options={chartOptions} />}
        </div>
        {/* Signal Chart */}
        <div className="bg-slate-950/50 rounded border border-cyan-500/20 p-2">
          {signalData.length > 0 && <Line data={signalChartData} options={chartOptions} />}
        </div>
        {/* Orientation Chart */}
        <div className="bg-slate-950/50 rounded border border-cyan-500/20 p-2">
          {(rollData.length > 0 || pitchData.length > 0 || yawData.length > 0) && (
            <Line data={orientationChartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  )
}