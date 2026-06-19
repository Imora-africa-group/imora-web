import { cn } from '../lib/utils'

type StatusBadgeProps = {
  status: string
  className?: string
}

const STATUS_STYLES: Record<string, string> = {
  // Lead statuses
  NOUVEAU: 'bg-[#0D2A4E] text-white',
  EN_COURS: 'bg-[#FEF3C7] text-[#92400E]',
  TRAITE: 'bg-[#D1FAE5] text-[#065F46]',
  ARCHIVE: 'bg-[#F3F4F6] text-[#374151]',
  // Publish statuses
  PUBLISHED: 'bg-[#D1FAE5] text-[#065F46]',
  DRAFT: 'bg-[#F3F4F6] text-[#374151]',
}

const STATUS_LABELS: Record<string, string> = {
  NOUVEAU: 'Nouveau',
  EN_COURS: 'En cours',
  TRAITE: 'Traité',
  ARCHIVE: 'Archivé',
  PUBLISHED: 'Publié',
  DRAFT: 'Brouillon',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status] ?? 'bg-[#F3F4F6] text-[#374151]'
  const label = STATUS_LABELS[status] ?? status

  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-3 py-1.5 text-xs font-medium',
        styles,
        className
      )}
      style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
    >
      {label}
    </span>
  )
}
