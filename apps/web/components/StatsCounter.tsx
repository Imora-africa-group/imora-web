'use client'

import { useEffect, useRef, useState } from 'react'

interface StatItem {
  value: number
  label: string
  suffix?: string
}

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(ease * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}

export function StatsSection({ stats }: { stats: StatItem[] }) {
  return (
    <section style={{ backgroundColor: '#0D2A4E' }} className="py-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y-2 lg:divide-y-0 lg:divide-x divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="text-center px-6 py-4 lg:py-0">
              <p className="text-4xl lg:text-5xl font-serif font-bold" style={{ color: '#C9A84C' }}>
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-white/70 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
