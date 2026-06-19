'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Parcelles', href: '/parcelles' },
  { label: 'Construction', href: '/construction' },
  { label: 'Gestion Locative', href: '/gestion-locative' },
  { label: 'À Propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 shrink-0">
            <span className="font-serif text-xl font-normal" style={{ color: '#C9A84C' }}>
              IMORA
            </span>
            <span className="font-serif text-xl font-normal ml-1.5" style={{ color: '#0D2A4E' }}>
              AFRICA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                )}
                style={isActive(link.href) ? { color: '#C9A84C' } : {}}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex">
            <Link
              href="/simulation"
              className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Faire une simulation
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-gray-600"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-amber-50 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                style={isActive(link.href) ? { color: '#C9A84C' } : {}}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/simulation"
              className="mt-3 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: '#C9A84C' }}
            >
              Faire une simulation
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
