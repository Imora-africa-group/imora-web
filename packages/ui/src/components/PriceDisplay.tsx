import { cn } from '../lib/utils'

type PriceDisplayProps = {
  fcfa: number
  usd: number
  eur: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const fcfaSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
}

const secondarySizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

function formatFCFA(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}

function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}

export function PriceDisplay({ fcfa, usd, eur, size = 'md', className }: PriceDisplayProps) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span
        className={cn('font-serif font-bold text-[#0D2A4E]', fcfaSizes[size])}
        style={{ fontFamily: 'DM Serif Display, Georgia, serif' }}
      >
        {formatFCFA(fcfa)} FCFA
      </span>
      <span
        className={cn('text-[#4A6080]', secondarySizes[size])}
        style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
      >
        · ${formatUSD(usd)} · €{formatEUR(eur)}
      </span>
    </div>
  )
}
