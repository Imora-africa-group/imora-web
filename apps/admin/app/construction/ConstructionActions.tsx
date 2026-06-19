'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateModeleStatus, deleteModele } from './actions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export function ConstructionActions({ id, status }: { id: string; status: 'DRAFT' | 'PUBLISHED' }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function toggleStatus() {
    startTransition(async () => {
      const newStatus = status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
      const res = await updateModeleStatus(id, newStatus)
      if (res.success) toast.success(newStatus === 'PUBLISHED' ? 'Modèle publié' : 'Mis en brouillon')
      else toast.error(res.error)
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteModele(id)
      if (res.success) toast.success('Modèle supprimé')
      else toast.error(res.error)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => router.push(`/construction/${id}/edit`)} className="h-8 w-8 p-0">
        <Edit size={14} />
      </Button>
      <Button variant="ghost" size="sm" onClick={toggleStatus} disabled={isPending} className="h-8 w-8 p-0">
        {status === 'PUBLISHED' ? <EyeOff size={14} /> : <Eye size={14} />}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-500 hover:text-red-600 hover:bg-accent transition-colors">
          <Trash2 size={14} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce modèle ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
