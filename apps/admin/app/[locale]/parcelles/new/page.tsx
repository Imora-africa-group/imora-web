import { AdminShell } from '@/components/layout/AdminShell'
import { ParcelleForm } from '../ParcelleForm'
import { createParcelle } from '../actions'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

export default function NewParcellePage() {
  return (
    <AdminShell title="Nouvelle parcelle">
      <div className="mb-6">
        <Link href="/parcelles" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour aux parcelles
        </Link>
      </div>
      <ParcelleForm action={createParcelle as never} actionLabel="Publier" />
    </AdminShell>
  )
}
