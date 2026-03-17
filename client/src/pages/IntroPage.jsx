import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Radio, Wifi } from 'lucide-react'

export default function IntroPage() {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for animated background effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="w-full h-screen bg-slate-950 overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 grid-bg"></div>
      </div>

      {/* Animated Light Effect Following Mouse */}
      <div
        className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease-out',
        }}
      ></div>

      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex items-center justify-between px-12">
        {/* Left Section - Text Content */}
        <div className="flex-1 max-w-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center transform hover:scale-110 transition-transform">
              <span className="text-slate-950 font-bold text-xl">🌍</span>
            </div>
            <span className="text-cyan-400 font-bold text-lg tracking-wider">Lora</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            ROBOT TELEMETRY
          </h1>

          {/* Subheadings */}
          <h2 className="text-3xl text-cyan-400 font-bold mb-2">
            MISSION CONTROL SYSTEM
          </h2>
          <h3 className="text-2xl text-emerald-400 font-bold mb-8">
            ADVANCED TELEMETRY
          </h3>

          {/* Description */}
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Real-time monitoring and control for LoRa-based long-range autonomous robots with
            advanced telemetry visualization, 3D orientation tracking and mission analytics.
          </p>

          {/* Tech Stack */}
          <div className="mb-12 space-y-3">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-cyan-400" />
              <span className="text-slate-300">React 18</span>
            </div>
            <div className="flex items-center gap-3">
              <Radio size={20} className="text-cyan-400" />
              <span className="text-slate-300">Three.js</span>
            </div>
            <div className="flex items-center gap-3">
              <Wifi size={20} className="text-cyan-400" />
              <span className="text-slate-300">WebSocket</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-cyan-400" />
              <span className="text-slate-300">Node.js</span>
            </div>
            <div className="flex items-center gap-3">
              <Radio size={20} className="text-cyan-400" />
              <span className="text-slate-300">Real-time</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-12 flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-bold tracking-wider">SYSTEM READY</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="px-12 py-4 border-2 border-cyan-400 text-cyan-400 font-bold tracking-wider text-lg rounded-full hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 shadow-neon-cyan hover:shadow-lg transform hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">ENTER MISSION CONTROL</span>
            <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </button>

          {/* Connection Info */}
          <p className="text-slate-400 text-sm mt-6">
            Connect to Mission Control<br />
            <span className="text-cyan-400 font-mono">localhost:3001</span> • Real-time Streaming
          </p>
        </div>

        {/* Right Section - Robot Visualization */}
        <div className="flex-1 flex items-center justify-center">
          {/* Robot 3D Visualization (SVG) */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Orbiting Circle */}
            <div className="absolute w-96 h-96 border border-cyan-500/20 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
            <div className="absolute w-80 h-80 border border-emerald-500/10 rounded-full animate-spin" style={{ animationDuration: '15s' }}></div>

            {/* Robot SVG */}
            <svg
              viewBox="0 0 300 250"
              className="w-96 h-96 relative z-10 drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(34, 211, 238, 0.3))',
              }}
            >
              {/* Main Robot Body */}
              <g className="animate-bounce" style={{ animationDuration: '3s' }}>
                {/* Chassis */}
                <rect x="80" y="120" width="140" height="80" rx="10" fill="url(#chassis-gradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.9" />

                {/* Main Hull */}
                <ellipse cx="150" cy="130" rx="65" ry="40" fill="url(#hull-gradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.8" />

                {/* Top Dome */}
                <circle cx="150" cy="100" r="35" fill="url(#dome-gradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />

                {/* Antenna */}
                <line x1="150" y1="60" x2="150" y2="20" stroke="#22d3ee" strokeWidth="3" opacity="0.7" />
                <circle cx="150" cy="15" r="6" fill="#22d3ee" opacity="0.8" />

                {/* Antenna Rings */}
                <circle cx="150" cy="45" r="12" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
                <circle cx="150" cy="45" r="18" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.2" />

                {/* Wheels - Left */}
                <circle cx="100" cy="200" r="18" fill="url(#wheel-gradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.9" />
                <circle cx="100" cy="200" r="12" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />

                {/* Wheels - Right */}
                <circle cx="200" cy="200" r="18" fill="url(#wheel-gradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.9" />
                <circle cx="200" cy="200" r="12" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />

                {/* Wheels - Back */}
                <circle cx="120" cy="220" r="15" fill="url(#wheel-gradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />
                <circle cx="180" cy="220" r="15" fill="url(#wheel-gradient)" stroke="#22d3ee" strokeWidth="2" opacity="0.85" />

                {/* Sensor Window */}
                <rect x="135" y="110" width="30" height="25" rx="5" fill="#06b6d4" opacity="0.3" stroke="#22d3ee" strokeWidth="1" />

                {/* LED Indicators */}
                <circle cx="145" cy="135" r="3" fill="#34d399" opacity="0.8" />
                <circle cx="155" cy="135" r="3" fill="#22d3ee" opacity="0.8" />
              </g>

              {/* Gradients */}
              <defs>
                <linearGradient id="chassis-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.5 }} />
                </linearGradient>
                <linearGradient id="hull-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#34d399', stopOpacity: 0.4 }} />
                  <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0.3 }} />
                </linearGradient>
                <linearGradient id="dome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.2 }} />
                </linearGradient>
                <linearGradient id="wheel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#64748b', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 0.4 }} />
                </linearGradient>
              </defs>
            </svg>

            {/* Glow Effect Behind Robot */}
            <div className="absolute w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.6;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}