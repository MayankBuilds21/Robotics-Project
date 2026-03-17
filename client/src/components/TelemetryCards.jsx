import { Battery, Signal, Activity, Compass, MapPin, Zap } from 'lucide-react'

export default function TelemetryCards({ telemetry }) {
  const cards = [
    {
      label: 'Battery Voltage',
      value: telemetry.battery.toFixed(2),
      unit: 'V',
      icon: Battery,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Signal Strength',
      value: telemetry.signal.toFixed(0),
      unit: 'dBm',
      icon: Signal,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: 'Packet Loss',
      value: telemetry.packetLoss,
      unit: '%',
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Roll',
      value: telemetry.roll.toFixed(1),
      unit: '°',
      icon: Compass,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    {
      label: 'Pitch',
      value: telemetry.pitch.toFixed(1),
      unit: '°',
      icon: Compass,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Yaw',
      value: telemetry.yaw.toFixed(0),
      unit: '°',
      icon: Compass,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Latitude',
      value: telemetry.lat.toFixed(4),
      unit: '°',
      icon: MapPin,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Longitude',
      value: telemetry.lon.toFixed(4),
      unit: '°',
      icon: MapPin,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Speed',
      value: telemetry.speed.toFixed(2),
      unit: 'm/s',
      icon: Zap,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
  ]

  return (
    <div className="space-y-3">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`${card.bgColor} border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-all`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1">{card.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-bold ${card.color}`}>
                    {card.value}
                  </span>
                  <span className={`text-xs ${card.color}`}>
                    {card.unit}
                  </span>
                </div>
              </div>
              <Icon className={`${card.color} opacity-50`} size={20} />
            </div>
          </div>
        )
      })}
    </div>
  )
}