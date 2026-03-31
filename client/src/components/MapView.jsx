import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MapView({ path = [], current = {} }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const polylineRef = useRef(null)
  const circleRef = useRef(null)

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      console.log('🗺️ Initializing map...')
      
      const map = L.map(mapRef.current).setView([19.0760, 72.8777], 15)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
    }

    return () => {
      // Don't destroy map on unmount, keep it persistent
    }
  }, [])

  // Update robot position marker and path
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const map = mapInstanceRef.current
    const lat = current?.lat || 19.0760
    const lon = current?.lon || 72.8777
    const yaw = current?.yaw || 0

    console.log(`📍 Updating position: [${lat}, ${lon}]`)

    // Create or update main marker
    if (!markerRef.current) {
      console.log('📌 Creating new marker')
      
      const robotIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-cyan-500 border-2 border-cyan-300 rounded-full shadow-lg transform" style="transform: rotate(${yaw}deg)">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>`,
        iconSize: [32, 32],
        className: 'robot-marker',
      })

      markerRef.current = L.marker([lat, lon], { icon: robotIcon }).addTo(map)
    } else {
      // Update marker position and rotation
      markerRef.current.setLatLng([lat, lon])
      
      const robotIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-cyan-500 border-2 border-cyan-300 rounded-full shadow-lg" style="transform: rotate(${yaw}deg)">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>`,
        iconSize: [32, 32],
        className: 'robot-marker',
      })
      
      markerRef.current.setIcon(robotIcon)
    }

    // Create or update position circle (accuracy indicator)
    if (!circleRef.current) {
      circleRef.current = L.circle([lat, lon], {
        radius: 5,
        fillColor: '#06b6d4',
        color: '#22d3ee',
        weight: 2,
        opacity: 0.3,
        fillOpacity: 0.1,
      }).addTo(map)
    } else {
      circleRef.current.setLatLng([lat, lon])
    }

    // Update path polyline
    if (path && path.length > 1) {
      const pathCoords = path.map(point => [point.lat, point.lon])

      if (!polylineRef.current) {
        console.log('📍 Creating polyline path')
        polylineRef.current = L.polyline(pathCoords, {
          color: '#22d3ee',
          weight: 2,
          opacity: 0.7,
          dashArray: '5, 5',
        }).addTo(map)
      } else {
        polylineRef.current.setLatLngs(pathCoords)
      }

      // Add waypoints
      path.forEach((point, index) => {
        if (index > 0 && index % 10 === 0) {
          L.circleMarker([point.lat, point.lon], {
            radius: 4,
            fillColor: '#a855f7',
            color: '#9333ea',
            weight: 1,
            opacity: 0.8,
          }).addTo(map)
        }
      })
    }

    // Center map on robot
    map.setView([lat, lon], 15)
  }, [current, path])

  return (
    <div className="w-full h-full relative bg-slate-800">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Position Display Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 border border-cyan-500/50 rounded p-3 text-xs">
        <p className="text-slate-400">
          Lat: <span className="text-cyan-400 font-mono">{(current?.lat || 19.0760).toFixed(6)}</span>
        </p>
        <p className="text-slate-400">
          Lon: <span className="text-cyan-400 font-mono">{(current?.lon || 72.8777).toFixed(6)}</span>
        </p>
        <p className="text-slate-400">
          Yaw: <span className="text-cyan-400 font-mono">{(current?.yaw || 0).toFixed(1)}°</span>
        </p>
        <p className="text-slate-400 mt-1">
          Path Points: <span className="text-emerald-400 font-mono">{path?.length || 0}</span>
        </p>
      </div>

      {/* Zoom Controls Info */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/80 border border-slate-700 rounded p-2 text-xs text-slate-400">
        <p>🔍 Scroll to zoom</p>
        <p>🔄 Drag to pan</p>
      </div>
    </div>
  )
}