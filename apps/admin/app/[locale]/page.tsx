import { prisma } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { StatusBadge } from '@/components/StatusBadge'
import { Users, TrendingUp, MapPin, Trophy } from 'lucide-react'
import { Link } from '@/i18n/navigation'

async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [leadsToday, leadsTotal, parcellesPubliees, realisationsPubliees, recentLeads] =
    await Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.lead.count(),
      prisma.parcelle.count({ where: { status: 'PUBLISHED' } }),
      prisma.realisation.count({ where: { status: 'PUBLISHED' } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nom: true,
          prenom: true,
          serviceType: true,
          createdAt: true,
          statut: true,
        },
      }),
    ])

  return { leadsToday, leadsTotal, parcellesPubliees, realisationsPubliees, recentLeads }
}

const SERVICE_LABELS: Record<string, string> = {
  PARCELLE: 'Achat Parcelle',
  CONSTRUCTION: 'Construction',
  LOCATIVE: 'Gestion Locative',
  SIMULATION: 'Simulation Complète',
}

const KPI_CARDS = [
  {
    key: 'leadsToday',
    label: "Leads aujourd'hui",
    icon: TrendingUp,
    color: '#B8860B',
    borderColor: 'border-l-amber-500',
  },
  {
    key: 'leadsTotal',
    label: 'Leads total',
    icon: Users,
    color: '#0D2A4E',
    borderColor: 'border-l-blue-600',
  },
  {
    key: 'parcellesPubliees',
    label: 'Parcelles publiées',
    icon: MapPin,
    color: '#059669',
    borderColor: 'border-l-emerald-500',
  },
  {
    key: 'realisationsPubliees',
    label: 'Réalisations publiées',
    icon: Trophy,
    color: '#7c3aed',
    borderColor: 'border-l-violet-500',
  },
]

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <AdminShell title="Tableau de bord">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon
          const value = data[card.key as keyof typeof data] as number
          return (
            <div
              key={card.key}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${card.borderColor} p-6`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-3xl font-bold" style={{ color: '#0D2A4E' }}>
                    {value}
                  </p>
                </div>
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center opacity-15"
                  style={{ backgroundColor: card.color }}
                >
                  <Icon size={20} style={{ color: card.color }} className="opacity-100" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Leads récents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Leads récents</h2>
          <Link
            href="/leads"
            className="text-sm font-medium"
            style={{ color: '#B8860B' }}
          >
            Voir tous →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 font-medium text-gray-500">NOM</th>
                <th className="px-6 py-3 font-medium text-gray-500">SERVICE</th>
                <th className="px-6 py-3 font-medium text-gray-500">DATE</th>
                <th className="px-6 py-3 font-medium text-gray-500">STATUT</th>
                <th className="px-6 py-3 font-medium text-gray-500">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {lead.prenom} {lead.nom}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {SERVICE_LABELS[lead.serviceType] ?? lead.serviceType}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {lead.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.statut} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-sm font-medium"
                      style={{ color: '#B8860B' }}
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
              {data.recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Aucun lead pour l&apos;instant
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ajouter une parcelle', sub: 'Publier une nouvelle offre', href: '/parcelles/new' },
          { label: 'Voir tous les leads', sub: 'Gérer les demandes clients', href: '/leads' },
          { label: 'Publier un avis', sub: 'Ajouter un témoignage client', href: '/avis' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5 hover:border-amber-200 hover:shadow-md transition-all group"
          >
            <p className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">
              {action.label}
            </p>
            <p className="text-sm text-gray-400 mt-1">{action.sub}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
