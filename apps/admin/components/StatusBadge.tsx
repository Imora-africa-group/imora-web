import { cn } from '@/lib/utils'

type LeadStatus = 'NOUVEAU' | 'EN_COURS' | 'TRAITE' | 'ARCHIVE'

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  NOUVEAU: { label: 'Nouveau', className: 'bg-blue-100 text-blue-700' },
  EN_COURS: { label: 'En cours', className: 'bg-amber-100 text-amber-700' },
  TRAITE: { label: 'Traité', className: 'bg-green-100 text-green-700' },
  ARCHIVE: { label: 'Archivé', className: 'bg-gray-100 text-gray-500' },
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.NOUVEAU
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.className)}>
      {cfg.label}
    </span>
  )
}

type PublishStatus = 'DRAFT' | 'PUBLISHED'

const PUBLISH_CONFIG: Record<PublishStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Brouillon', className: 'bg-gray-100 text-gray-600' },
  PUBLISHED: { label: 'Publié', className: 'bg-green-100 text-green-700' },
}

export function PublishBadge({ status }: { status: PublishStatus }) {
  const cfg = PUBLISH_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.className)}>
      {cfg.label}
    </span>
  )
}
