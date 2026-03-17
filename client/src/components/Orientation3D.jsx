import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function Orientation3D({ orientation }) {
  const containerRef = useRef(null)
  const cubeRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)
  const [rotationZ, setRotationZ] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(3, 3, 3)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Cube
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xFF0000 }), // Red - Right
      new THREE.MeshPhongMaterial({ color: 0x00FF00 }), // Green - Left
      new THREE.MeshPhongMaterial({ color: 0x0000FF }), // Blue - Top
      new THREE.MeshPhongMaterial({ color: 0xFFFF00 }), // Yellow - Bottom
      new THREE.MeshPhongMaterial({ color: 0xFF00FF }), // Magenta - Front
      new THREE.MeshPhongMaterial({ color: 0x00FFFF })  // Cyan - Back
    ]

    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)
    cubeRef.current = cube

    // Wireframe
    const edges = new THREE.EdgesGeometry(geometry)
    const wireframe = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
    cube.add(wireframe)

    // Axes
    const axesHelper = new THREE.AxesHelper(3)
    scene.add(axesHelper)

    // Lights
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8)
    light1.position.set(5, 5, 5)
    scene.add(light1)

    const light2 = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light2)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      // AMPLIFY rotation for testing - multiply by 3 to see movement
      const amplifiedRoll = (orientation.roll * 3 * Math.PI) / 180
      const amplifiedPitch = (orientation.pitch * 3 * Math.PI) / 180
      const amplifiedYaw = (orientation.yaw * 3 * Math.PI) / 180

      cube.rotation.x = amplifiedRoll
      cube.rotation.y = amplifiedPitch
      cube.rotation.z = amplifiedYaw

      setRotationX((amplifiedRoll * 180) / Math.PI)
      setRotationY((amplifiedPitch * 180) / Math.PI)
      setRotationZ((amplifiedYaw * 180) / Math.PI)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
      if (containerRef.current && rendererRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement)
        } catch (e) {}
      }
      geometry.dispose()
      materials.forEach(m => m.dispose())
      renderer.dispose()
    }
  }, [])

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-cyan-500/20">
        <h3 className="text-cyan-400 font-bold text-sm">3D ORIENTATION (TEST - AMPLIFIED 3x)</h3>
        <p className="text-xs text-slate-500">RGB cube rotates with Red/Green/Blue faces</p>
      </div>

      <div ref={containerRef} className="flex-1 bg-slate-950/30" />

      <div className="px-4 py-3 border-t border-cyan-500/20 bg-slate-950/50">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="text-center p-2 bg-red-500/20 rounded border border-red-500/50">
            <p className="text-xs text-slate-400">INPUT Roll</p>
            <p className="text-sm font-bold text-red-400">{orientation.roll.toFixed(1)}°</p>
          </div>
          <div className="text-center p-2 bg-green-500/20 rounded border border-green-500/50">
            <p className="text-xs text-slate-400">INPUT Pitch</p>
            <p className="text-sm font-bold text-green-400">{orientation.pitch.toFixed(1)}°</p>
          </div>
          <div className="text-center p-2 bg-blue-500/20 rounded border border-blue-500/50">
            <p className="text-xs text-slate-400">INPUT Yaw</p>
            <p className="text-sm font-bold text-blue-400">{orientation.yaw.toFixed(0)}°</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-slate-800/50 rounded border border-red-500/30">
            <p className="text-xs text-slate-400">CUBE Rotation X</p>
            <p className="text-sm font-bold text-red-300">{rotationX.toFixed(1)}°</p>
          </div>
          <div className="text-center p-2 bg-slate-800/50 rounded border border-green-500/30">
            <p className="text-xs text-slate-400">CUBE Rotation Y</p>
            <p className="text-sm font-bold text-green-300">{rotationY.toFixed(1)}°</p>
          </div>
          <div className="text-center p-2 bg-slate-800/50 rounded border border-blue-500/30">
            <p className="text-xs text-slate-400">CUBE Rotation Z</p>
            <p className="text-sm font-bold text-blue-300">{rotationZ.toFixed(1)}°</p>
          </div>
        </div>
      </div>
    </div>
  )
}