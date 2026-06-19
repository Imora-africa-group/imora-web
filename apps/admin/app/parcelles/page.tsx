import { prisma, getImageUrl } from '@imora/db'
import { AdminShell } from '@/components/layout/AdminShell'
import { PublishBadge } from '@/components/StatusBadge'
import { ParcellesActions } from './ParcellesActions'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default async function ParcellesPage() {
  const parcelles = await prisma.parcelle.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: { orderBy: { ordre: 'asc' } } },
  })

  return (
    <AdminShell title="Parcelles">
      <div className="flex justify-end mb-6">
        <Link href="/parcelles/new" className={cn(buttonVariants(), 'text-white gap-2')} style={{ backgroundColor: '#B8860B' }}>
          <Plus size={16} />
          Ajouter une parcelle
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-6 py-3 font-medium text-gray-500">PHOTO</th>
                <th className="px-6 py-3 font-medium text-gray-500">TITRE</th>
                <th className="px-6 py-3 font-medium text-gray-500">VILLE</th>
                <th className="px-6 py-3 font-medium text-gray-500">PRIX FCFA</th>
                <th className="px-6 py-3 font-medium text-gray-500">STATUT</th>
                <th className="px-6 py-3 font-medium text-gray-500">DATE</th>
                <th className="px-6 py-3 font-medium text-gray-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parcelles.map((p) => {
                const mainImg = p.images.find((i) => i.isMain) ?? p.images[0]
                const thumbUrl = mainImg
                  ? getImageUrl(mainImg.cloudinaryPublicId, { width: 80, height: 80, crop: 'fill' })
                  : null
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {thumbUrl ? (
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={thumbUrl} alt={p.titre} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{p.titre}</td>
                    <td className="px-6 py-4 text-gray-600">{p.ville}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {p.prixFCFA.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4">
                      <PublishBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <ParcellesActions id={p.id} status={p.status} />
                    </td>
                  </tr>
                )
              })}
              {parcelles.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Aucune parcelle pour l&apos;instant
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
