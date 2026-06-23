'use client'

import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { StatusBadge } from '@/components/StatusBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { Lead } from '@imora/db'

interface LeadsTableProps {
  leads: Lead[]
  total: number
  page: number
  totalPages: number
  currentStatut: string
  currentService: string
  serviceLabels: Record<string, string>
}

function exportCsv(leads: Lead[]) {
  const headers = ['Nom', 'Prénom', 'Téléphone', 'Email', 'Pays', 'Service', 'Date', 'Statut']
  const rows = leads.map((l) => [
    l.nom,
    l.prenom,
    `${l.indicatif} ${l.telephone}`,
    l.email,
    l.pays,
    l.serviceType,
    new Date(l.createdAt).toLocaleDateString('fr-FR'),
    l.statut,
  ])
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'leads-imora.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function LeadsTable({
  leads,
  total,
  page,
  totalPages,
  currentStatut,
  currentService,
  serviceLabels,
}: LeadsTableProps) {
  const router = useRouter()

  function buildUrl(params: Record<string, string>) {
    const sp = new URLSearchParams()
    if (params.statut && params.statut !== 'all') sp.set('statut', params.statut)
    if (params.service && params.service !== 'all') sp.set('service', params.service)
    if (params.page && params.page !== '1') sp.set('page', params.page)
    const q = sp.toString()
    return `/leads${q ? `?${q}` : ''}`
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3">
          <Select
            value={currentStatut}
            onValueChange={(v) => router.push(buildUrl({ statut: v ?? 'all', service: currentService, page: '1' }))}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="NOUVEAU">Nouveau</SelectItem>
              <SelectItem value="EN_COURS">En cours</SelectItem>
              <SelectItem value="TRAITE">Traité</SelectItem>
              <SelectItem value="ARCHIVE">Archivé</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={currentService}
            onValueChange={(v) => router.push(buildUrl({ statut: currentStatut, service: v ?? 'all', page: '1' }))}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Tous les services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les services</SelectItem>
              <SelectItem value="PARCELLE">Achat Parcelle</SelectItem>
              <SelectItem value="CONSTRUCTION">Construction</SelectItem>
              <SelectItem value="LOCATIVE">Gestion Locative</SelectItem>
              <SelectItem value="SIMULATION">Simulation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{total} lead{total > 1 ? 's' : ''}</span>
          <Button variant="outline" size="sm" onClick={() => exportCsv(leads)}>
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-6 py-3 font-medium text-gray-500">#</th>
                <th className="px-6 py-3 font-medium text-gray-500">NOM PRÉNOM</th>
                <th className="px-6 py-3 font-medium text-gray-500">TÉLÉPHONE</th>
                <th className="px-6 py-3 font-medium text-gray-500">EMAIL</th>
                <th className="px-6 py-3 font-medium text-gray-500">SERVICE</th>
                <th className="px-6 py-3 font-medium text-gray-500">DATE</th>
                <th className="px-6 py-3 font-medium text-gray-500">STATUT</th>
                <th className="px-6 py-3 font-medium text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead, i) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {(page - 1) * 20 + i + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {lead.prenom} {lead.nom}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {lead.indicatif} {lead.telephone}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {serviceLabels[lead.serviceType] ?? lead.serviceType}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.statut} />
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
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
              {leads.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    Aucun lead trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} sur {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ statut: currentStatut, service: currentService, page: String(page - 1) })}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  ← Précédent
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl({ statut: currentStatut, service: currentService, page: String(page + 1) })}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Suivant →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
