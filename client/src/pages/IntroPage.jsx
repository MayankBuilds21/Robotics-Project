import { useNavigate } from 'react-router-dom'

export default function IntroPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: '📍',
      title: 'Real-time Tracking',
      description: 'GPS location tracking with precision mapping',
    },
    {
      icon: '🔋',
      title: 'Battery Monitoring',
      description: 'Track battery voltage with smart alerts',
    },
    {
      icon: '📶',
      title: 'Signal Management',
      description: 'Monitor signal strength and connection quality',
    },
    {
      icon: '📊',
      title: 'Data Visualization',
      description: 'Advanced charts and real-time telemetry',
    },
    {
      icon: '🎮',
      title: 'Remote Control',
      description: 'Send commands and control operations',
    },
    {
      icon: '⚙️',
      title: 'System Settings',
      description: 'Customize theme, animations, and preferences',
    },
  ]

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-cyan-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Mission Control
              </h1>
              <p className="text-xs text-slate-500">Robotics Telemetry System</p>
            </div>
          </div>
          <a href="#features" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
            Learn More ↓
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-400">SYSTEM OPERATIONAL</span>
            </div>

            {/* Main Heading */}
            <div>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight">
                Advanced Robotics Control & Monitoring
              </h2>
              <p className="text-xl text-slate-300">
                Real-time telemetry, tracking, and remote control for autonomous robots
              </p>
            </div>

            {/* Description */}
            <div className="space-y-3 text-slate-400">
              <p>
                Monitor your robot's position, battery status, signal strength, and orientation in real-time. 
                Access comprehensive dashboards with live charts and detailed analytics.
              </p>
              <p>
                Get instant alerts for critical events, export mission data, and customize your experience 
                with our advanced settings system.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/50 transform hover:scale-105 hover:-translate-y-1"
              >
                🚀 Enter Mission Control
              </button>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl transition-all duration-300"
              >
                📚 Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-cyan-500/20">
              {[
                { label: 'Real-time Updates', value: '<100ms' },
                { label: 'Data Points', value: '∞' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat, idx) => (
                <div key={idx} className="animate-fade-in" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                  <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block animate-float">
            <div className="relative w-full aspect-square">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/30 animate-pulse"></div>
              
              {/* Main Visual Card */}
              <div className="absolute inset-4 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📊</div>
                  <p className="text-cyan-400 font-bold">Mission Control</p>
                  <p className="text-sm text-slate-400">Real-time Telemetry Dashboard</p>
                  
                  {/* Mini Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-4 text-xs">
                    <div className="p-2 bg-slate-800/50 rounded border border-cyan-500/20">
                      <p className="text-cyan-400 font-bold">📍 GPS</p>
                      <p className="text-slate-500">Live Tracking</p>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded border border-emerald-500/20">
                      <p className="text-emerald-400 font-bold">🔋 Battery</p>
                      <p className="text-slate-500">12.5V</p>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded border border-blue-500/20">
                      <p className="text-blue-400 font-bold">📶 Signal</p>
                      <p className="text-slate-500">-75dBm</p>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded border border-purple-500/20">
                      <p className="text-purple-400 font-bold">⚙️ Status</p>
                      <p className="text-slate-500">Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-blob"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-blob animation-delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 border-t border-cyan-500/20 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h3>
            <p className="text-slate-400">Everything you need for advanced robot control and monitoring</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-900/50 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-bold text-cyan-400 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 animate-fade-in">
            Ready to Control Your Robot?
          </h3>
          <p className="text-slate-400 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Start monitoring and controlling your autonomous robot with advanced telemetry
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/50 transform hover:scale-105 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            🚀 Launch Mission Control
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 text-sm">
          <p>🤖 Mission Control • Advanced Robotics Telemetry System</p>
          <p className="mt-2">© 2026 All Rights Reserved</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}