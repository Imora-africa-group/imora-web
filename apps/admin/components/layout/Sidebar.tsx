'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  MapPin,
  Building2,
  Key,
  Handshake,
  Star,
  Trophy,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'CONTENU', type: 'section' as const },
  { label: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { label: 'Parcelles', href: '/parcelles', icon: MapPin },
  { label: 'Construction', href: '/construction', icon: Building2 },
  { label: 'LEADS', type: 'section' as const },
  { label: 'Tous les leads', href: '/leads', icon: Users },
  { label: 'GESTION', type: 'section' as const },
  { label: 'Gestion Locative', href: '/locative', icon: Key },
  { label: 'Partenaires', href: '/partenaires', icon: Handshake },
  { label: 'Avis Clients', href: '/avis', icon: Star },
  { label: 'Réalisations', href: '/realisations', icon: Trophy },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'PARAMÈTRES', type: 'section' as const },
  { label: 'Paramètres', href: '/parametres', icon: Settings },
] as const

type NavItem = typeof navItems[number]

interface SidebarProps {
  userName: string
  userRole: string
}

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside
      className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col"
      style={{ backgroundColor: '#0D2A4E' }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
        <div className="relative h-9 w-9 shrink-0">
          <Image
            src="/icon/logo-imora.png"
            alt="IMORA AFRICA"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">
            <span style={{ color: '#B8860B' }}>IMORA</span>{' '}
            <span className="text-white">AFRICA</span>
          </p>
          <p className="text-xs text-white/50 mt-0.5">Administration</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item, i) => {
          if ('type' in item && item.type === 'section') {
            return (
              <p
                key={i}
                className="pt-5 pb-1.5 px-3 text-xs font-semibold tracking-widest text-white/30 uppercase"
              >
                {item.label}
              </p>
            )
          }
          const navItem = item as Extract<NavItem, { href: string }>
          const Icon = navItem.icon
          const active = isActive(navItem.href)
          return (
            <Link
              key={navItem.href}
              href={navItem.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative',
                active
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              {active && (
                <span
                  className="absolute left-0 inset-y-1 w-1 rounded-full"
                  style={{ backgroundColor: '#B8860B' }}
                />
              )}
              <Icon size={16} className="shrink-0 ml-1" />
              {navItem.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 px-4 py-4 flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: '#B8860B', color: '#0D2A4E' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{userName}</p>
          <p className="text-xs text-white/40 truncate">{userRole}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/fr/login' })}
          className="text-white/40 hover:text-white transition-colors"
          title="Déconnexion"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
