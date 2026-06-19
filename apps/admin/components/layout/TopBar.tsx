'use client'

import { Bell } from 'lucide-react'

interface TopBarProps {
  title: string
  userName: string
}

export function TopBar({ title, userName }: TopBarProps) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: '#0D2A4E', color: '#B8860B' }}
          >
            {initials}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 leading-none">{userName}</p>
            <p className="text-xs text-gray-400 mt-0.5">admin@imora.africa</p>
          </div>
        </div>
      </div>
    </header>
  )
}
