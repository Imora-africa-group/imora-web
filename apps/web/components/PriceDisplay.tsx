interface PriceDisplayProps {
  fcfa: number
  usd?: number
  eur?: number
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({ fcfa, usd, eur, size = 'md' }: PriceDisplayProps) {
  const fcfaFormatted = fcfa.toLocaleString('fr-FR')
  const usdFormatted = usd ? `$${usd.toLocaleString('en-US')}` : null
  const eurFormatted = eur ? `€${eur.toLocaleString('fr-FR')}` : null

  const mainClass =
    size === 'lg'
      ? 'text-2xl font-bold'
      : size === 'sm'
      ? 'text-base font-semibold'
      : 'text-lg font-bold'

  const subClass =
    size === 'lg' ? 'text-sm' : size === 'sm' ? 'text-xs' : 'text-xs'

  return (
    <div>
      <p className={mainClass} style={{ color: '#0D2A4E' }}>
        {fcfaFormatted} FCFA
      </p>
      {(usdFormatted || eurFormatted) && (
        <p className={`${subClass} text-gray-500 mt-0.5`}>
          {[usdFormatted, eurFormatted].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  )
}
