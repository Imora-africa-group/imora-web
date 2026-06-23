'use client'
import { useEffect, useRef } from 'react'

export default function SphereDots({
  size = 400,
  color = '13,42,78',
  className = '',
}: {
  size?: number
  color?: string
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0
    const N = 800
    const dots = Array.from({ length: N }, (_, i) => ({
      phi: Math.acos(1 - 2 * (i + 0.5) / N),
      theta: Math.PI * (1 + Math.sqrt(5)) * i,
    }))

    const draw = () => {
      const W = size, H = size
      ctx.clearRect(0, 0, W, H)
      const breath = 1 + 0.06 * Math.sin(t * 0.018)
      const R = (size / 2.8) * breath
      const rotY = t * 0.004

      dots
        .map(d => {
          const x = Math.sin(d.phi) * Math.cos(d.theta + rotY)
          const y = Math.cos(d.phi)
          const z = Math.sin(d.phi) * Math.sin(d.theta + rotY)
          return { z, sx: W / 2 + R * x, sy: H / 2 - R * y }
        })
        .sort((a, b) => a.z - b.z)
        .forEach(d => {
          const vis = (d.z + 1) / 2
          ctx.beginPath()
          ctx.arc(d.sx, d.sy, 1.2 + vis * 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color},${0.15 + vis * 0.55})`
          ctx.fill()
        })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size, color])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  )
}
