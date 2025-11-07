import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
    renderer.setSize(width, height)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000)
    camera.position.set(0, 0, 8)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 10)
    scene.add(light)

    // Earth
    const earthGeo = new THREE.SphereGeometry(2, 64, 64)
    const earthMat = new THREE.MeshPhongMaterial({ color: 0x224488, emissive: 0x001122 })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    scene.add(earth)

    // Orbits + satellites (simple animation)
    const sats = []
    const planes = 3
    const satsPerPlane = 4
    const radius = 5.5

    for (let p = 0; p < planes; p++) {
      const orbitGeo = new THREE.RingGeometry(radius-0.005, radius+0.005, 256)
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide })
      const ring = new THREE.Mesh(orbitGeo, orbitMat)
      ring.rotation.x = Math.PI/2
      ring.rotation.z = (p/planes) * Math.PI
      scene.add(ring)

      for (let s = 0; s < satsPerPlane; s++) {
        const satGeo = new THREE.SphereGeometry(0.05)
        const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const sat = new THREE.Mesh(satGeo, satMat)
        sat.userData = { phase: (s/satsPerPlane) * Math.PI*2, plane: p }
        scene.add(sat)
        sats.push(sat)
      }
    }

    let t = 0
    const animate = () => {
      requestAnimationFrame(animate)
      t += 0.003
      sats.forEach(sat => {
        const plane = sat.userData.plane
        const phase = sat.userData.phase
        const omega = 0.5 + plane*0.05
        const angle = t*omega + phase
        const R = radius
        const inc = (plane/planes) * 55 * Math.PI/180
        const x = R * Math.cos(angle)
        const y = R * Math.sin(angle) * Math.sin(inc)
        const z = R * Math.sin(angle) * Math.cos(inc)
        sat.position.set(x, y, z)
      })
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w/h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ position: 'absolute', zIndex: 1, padding: 12, color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: 18 }}>GNSS Visualization (Prototype)</h1>
        <p style={{ margin: 0, fontSize: 12 }}>Three.js • Docker • FastAPI</p>
      </div>
      <canvas ref={canvasRef} />
      <div style={{ position: 'absolute', bottom: 10, left: 12, color: 'white', fontSize: 12 }}>
        <a href="http://localhost:8000/health" target="_blank" rel="noreferrer" style={{ color: 'white' }}>
          Backend Health
        </a>
      </div>
    </div>
  )
}
