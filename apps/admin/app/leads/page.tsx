import { prisma } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { LeadsTable } from './LeadsTable'

const SERVICE_LABELS: Record<string, string> = {
  PARCELLE: 'Achat Parcelle',
  CONSTRUCTION: 'Construction',
  LOCATIVE: 'Gestion Locative',
  SIMULATION: 'Simulation Complète',
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; service?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const perPage = 20

  const where = {
    ...(params.statut && params.statut !== 'all' ? { statut: params.statut as 'NOUVEAU' | 'EN_COURS' | 'TRAITE' | 'ARCHIVE' } : {}),
    ...(params.service && params.service !== 'all' ? { serviceType: params.service as 'PARCELLE' | 'CONSTRUCTION' | 'LOCATIVE' | 'SIMULATION' } : {}),
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.lead.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <AdminShell title="Leads">
      <LeadsTable
        leads={leads}
        total={total}
        page={page}
        totalPages={totalPages}
        currentStatut={params.statut ?? 'all'}
        currentService={params.service ?? 'all'}
        serviceLabels={SERVICE_LABELS}
      />
    </AdminShell>
  )
}
