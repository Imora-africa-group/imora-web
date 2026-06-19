import { prisma } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { StatistiquesClient } from './StatistiquesClient'

export default async function StatistiquesPage() {
  const [override, parcellesCount, partenairesCount] = await Promise.all([
    prisma.statOverride.findUnique({ where: { id: 'singleton' } }),
    prisma.parcelle.count({ where: { status: 'PUBLISHED' } }),
    prisma.partenaire.count({ where: { isActive: true } }),
  ])

  return (
    <AdminShell title="Statistiques">
      <StatistiquesClient
        projetsRealises={override?.projetsRealises ?? 0}
        clientsSatisfaits={override?.clientsSatisfaits ?? 0}
        parcellesCount={parcellesCount}
        partenairesCount={partenairesCount}
      />
    </AdminShell>
  )
}
