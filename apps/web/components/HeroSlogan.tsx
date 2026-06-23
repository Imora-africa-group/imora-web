'use client'
import { useEffect, useState } from 'react'

export function HeroSlogan({ text }: { text: string }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const words = text.split(' ')

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block mr-[0.28em] last:mr-0"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0) blur(0px)' : 'translateY(18px)',
            filter: revealed ? 'blur(0px)' : 'blur(4px)',
            transition: `opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease`,
            transitionDelay: `${i * 110}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </h1>
  )
}
