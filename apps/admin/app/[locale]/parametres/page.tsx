import { prisma } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { ParametresClient } from './ParametresClient'

export default async function ParametresPage() {
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })

  const defaults = {
    whatsappNumber: '',
    fallbackRateUSD: 0.00165,
    fallbackRateEUR: 0.00152,
    exchangeRateUSD: 0.00165,
    exchangeRateEUR: 0.00152,
    exchangeRateUpdatedAt: new Date(),
    sloganText: "L'immobilier sécurisé, sans tracasserie",
    serviceParcelleDesc: '',
    serviceConstructDesc: '',
    serviceLocativeDesc: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    mentionsLegales: '',
  }

  const data = { ...defaults, ...settings }

  return (
    <AdminShell title="Paramètres">
      <ParametresClient settings={data} />
    </AdminShell>
  )
}
