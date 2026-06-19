import { AdminShell } from '@/components/layout/AdminShell'
import { ModeleForm } from '../ModeleForm'
import { createModele } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewModelePage() {
  return (
    <AdminShell title="Nouveau modèle de construction">
      <div className="mb-6">
        <Link href="/construction" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} /> Retour
        </Link>
      </div>
      <ModeleForm action={createModele as never} actionLabel="Publier" />
    </AdminShell>
  )
}
