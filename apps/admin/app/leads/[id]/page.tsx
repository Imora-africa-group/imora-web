import { prisma } from '@imora/db'
import { notFound } from 'next/navigation'
import { AdminShell } from '@/components/layout/AdminShell'
import { StatusBadge } from '@/components/StatusBadge'
import { LeadActions } from './LeadActions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buildWhatsAppUrl } from '@imora/db'

const SERVICE_LABELS: Record<string, string> = {
  PARCELLE: '🏗️ Achat Parcelle',
  CONSTRUCTION: '🏠 Construction',
  LOCATIVE: '🔑 Gestion Locative',
  SIMULATION: '📊 Simulation Complète',
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({ where: { id } })
  if (!lead) notFound()

  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const waNumber = settings?.whatsappNumber ?? ''
  const waUrl = buildWhatsAppUrl(
    waNumber,
    `Bonjour ${lead.prenom} ${lead.nom}, suite à votre demande sur IMORA AFRICA...`
  )

  const simData = lead.simulationData as Record<string, unknown> | null
  const extras = lead.extras as string[] | null

  return (
    <AdminShell title={`Lead — ${lead.prenom} ${lead.nom}`}>
      <div className="mb-6">
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux leads
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infos client */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Informations client
          </h2>
          <div className="space-y-3 text-sm">
            <Row label="Nom" value={`${lead.prenom} ${lead.nom}`} />
            <Row label="Téléphone" value={`${lead.indicatif} ${lead.telephone}`} />
            <Row label="Email" value={lead.email} />
            <Row label="Pays" value={lead.pays} />
            <Row label="Service" value={SERVICE_LABELS[lead.serviceType] ?? lead.serviceType} />
            <Row
              label="Date"
              value={new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
            <div className="pt-2">
              <span className="text-gray-400">Statut</span>
              <div className="mt-1">
                <StatusBadge status={lead.statut} />
              </div>
            </div>
            {lead.message && (
              <div className="pt-2">
                <span className="text-gray-400 block mb-1">Message</span>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 italic">
                  {lead.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Simulation */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Données simulation
          </h2>
          {simData ? (
            <div className="space-y-3 text-sm">
              {Object.entries(simData).map(([key, val]) => (
                <Row key={key} label={key} value={String(val)} />
              ))}
              {extras && extras.length > 0 && (
                <div className="pt-2">
                  <span className="text-gray-400 block mb-1">Extras sélectionnés</span>
                  <div className="flex flex-wrap gap-1.5">
                    {extras.map((e) => (
                      <span
                        key={e}
                        className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-100"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Pas de simulation pour ce lead.</p>
          )}
        </div>

        {/* Actions */}
        <LeadActions lead={lead} waUrl={waUrl} />
      </div>
    </AdminShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  )
}
