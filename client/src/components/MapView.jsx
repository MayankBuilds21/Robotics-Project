import { useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'

// OSM dark tiles (CartoDB dark_matter), fallback to standard if not dark
const TILE_THEMES = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  },
  light: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  }
}

export default function MapView({ path, current }) {
  const { mapTheme } = useSettings()
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!window.L) {
      // Load Leaflet CSS/JS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet/dist/leaflet.css'
      document.head.appendChild(link)

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js'
      script.onload = () => initializeMap()
      document.body.appendChild(script)
    } else {
      initializeMap()
    }
    // eslint-disable-next-line
  }, [])

  // Re-render tile layer if mapTheme changes
  useEffect(() => {
    if (!window.L || !mapRef.current) return
    const { map, markers, tileLayer } = mapRef.current

    // Remove previous tile layer
    if (tileLayer) {
      map.removeLayer(tileLayer)
    }
    // Add new tile layer
    const tiles = window.L.tileLayer(
      TILE_THEMES[mapTheme]?.url || TILE_THEMES.dark.url,
      {
        attribution: TILE_THEMES[mapTheme]?.attribution || TILE_THEMES.dark.attribution,
        maxZoom: 19,
        tileSize: 256,
      }
    ).addTo(map)
    mapRef.current.tileLayer = tiles
  }, [mapTheme])

  const initializeMap = () => {
    if (!containerRef.current || mapRef.current) return

    const L = window.L
    const map = L.map(containerRef.current).setView([current.lat, current.lon], 15)

    const tiles = L.tileLayer(
      TILE_THEMES[mapTheme]?.url || TILE_THEMES.dark.url,
      {
        attribution: TILE_THEMES[mapTheme]?.attribution || TILE_THEMES.dark.attribution,
        maxZoom: 19,
        tileSize: 256,
      }
    ).addTo(map)

    mapRef.current = { map, L, markers: {}, tileLayer: tiles }
    updateMap()
  }

  const updateMap = () => {
    if (!mapRef.current) return
    const { map, L, markers } = mapRef.current

    // Remove old path
    if (markers.polyline) map.removeLayer(markers.polyline)
    if (path.length > 1) {
      const pathCoords = path.map(p => [p.lat, p.lon])
      markers.polyline = L.polyline(pathCoords, {
        color: '#22d3ee', weight: 2, opacity: 0.7, dashArray: '5, 5'
      }).addTo(map)
    }

    // Remove old marker
    if (markers.robot) map.removeLayer(markers.robot)
    markers.robot = L.circleMarker([current.lat, current.lon], {
      radius: 10,
      fillColor: '#22d3ee',
      color: '#0f172a',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    })
      .addTo(map)
      .bindPopup(
        `<div style="color:#111;background:#22d3ee;padding:6px 12px;border-radius:6px"><strong>Robot Position</strong><br/>Lat: ${current.lat.toFixed(4)}<br/>Lon: ${current.lon.toFixed(4)}</div>`
      )
  }

  useEffect(() => { updateMap() }, [path, current])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-800"
      style={{ zIndex: 1 }}
    />
  )
}
