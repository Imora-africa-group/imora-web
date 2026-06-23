'use client'
import { useEffect, useRef } from 'react'

export default function DotsCloud() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const points = Array.from({ length: 350 }, () => {
      const angle = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 0.6)
      const x = W / 2 + r * (W * 0.48) * Math.cos(angle)
      const y = H / 2 + r * (H * 0.45) * Math.sin(angle)
      const size = 0.8 + Math.random() * 2
      const opacity = 0.15 + Math.random() * 0.5
      const speedX = (Math.random() - 0.5) * 0.15
      const speedY = (Math.random() - 0.5) * 0.08
      return { x, y, size, opacity, speedX, speedY, baseX: x, baseY: y }
    })

    let t = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.008

      points.forEach(p => {
        const px = p.baseX + Math.sin(t + p.baseX * 0.01) * 8
        const py = p.baseY + Math.cos(t + p.baseY * 0.01) * 4

        const dx = (px - W / 2) / (W * 0.48)
        const dy = (py - H / 2) / (H * 0.45)
        const dist = Math.sqrt(dx * dx + dy * dy)
        const edgeFade = Math.max(0, 1 - dist)

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(13,42,78,${p.opacity * edgeFade})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  )
}
