'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { createFaq, updateFaq, deleteFaq, moveFaq, toggleFaq } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { FAQ } from '@imora/db'

function FaqForm({ faq, onDone }: { faq?: FAQ; onDone: () => void }) {
  const [question, setQuestion] = useState(faq?.question ?? '')
  const [reponse, setReponse] = useState(faq?.reponse ?? '')
  const [published, setPublished] = useState(faq?.isPublished ?? false)
  const [isPending, startTransition] = useTransition()

  function submit() {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('question', question)
      fd.set('reponse', reponse)
      fd.set('isPublished', String(published))

      const res = faq ? await updateFaq(faq.id, fd) : await createFaq(fd)
      if (res.success) {
        toast.success(faq ? 'FAQ mise à jour' : 'FAQ créée')
        onDone()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label>Question</Label>
        <Input value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Réponse</Label>
        <Textarea value={reponse} onChange={(e) => setReponse(e.target.value)} rows={5} className="mt-1 resize-none" />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={published} onCheckedChange={setPublished} />
        <Label>Publié</Label>
      </div>
      <Button onClick={submit} disabled={isPending} className="w-full text-white" style={{ backgroundColor: '#B8860B' }}>
        {isPending ? 'Enregistrement...' : faq ? 'Mettre à jour' : 'Créer'}
      </Button>
    </div>
  )
}

export function FaqClient({ faqs }: { faqs: FAQ[] }) {
  const [openModal, setOpenModal] = useState<string | 'new' | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleMove(id: string, dir: 'up' | 'down') {
    startTransition(async () => {
      const res = await moveFaq(id, dir)
      if (!res.success) toast.error(res.error)
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await toggleFaq(id, !current)
      if (!res.success) toast.error(res.error)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteFaq(id)
      if (res.success) toast.success('FAQ supprimée')
      else toast.error(res.error)
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Dialog open={openModal === 'new'} onOpenChange={(o) => setOpenModal(o ? 'new' : null)}>
          <DialogTrigger className="inline-flex items-center gap-2 rounded-lg px-2.5 h-8 text-sm font-medium text-white transition-all" style={{ backgroundColor: '#B8860B' }}>
            <Plus size={16} /> Ajouter une FAQ
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Nouvelle FAQ</DialogTitle></DialogHeader>
            <FaqForm onDone={() => setOpenModal(null)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left border-b border-gray-100">
              <th className="px-6 py-3 font-medium text-gray-500 w-12">#</th>
              <th className="px-6 py-3 font-medium text-gray-500">QUESTION</th>
              <th className="px-6 py-3 font-medium text-gray-500">STATUT</th>
              <th className="px-6 py-3 font-medium text-gray-500">ORDRE</th>
              <th className="px-6 py-3 font-medium text-gray-500">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {faqs.map((faq, i) => (
              <tr key={faq.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-400">{faq.ordre}</td>
                <td className="px-6 py-4 font-medium text-gray-900 max-w-sm truncate">{faq.question}</td>
                <td className="px-6 py-4">
                  <Switch checked={faq.isPublished} onCheckedChange={() => handleToggle(faq.id, faq.isPublished)} disabled={isPending} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleMove(faq.id, 'up')} disabled={i === 0 || isPending}>
                      <ChevronUp size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleMove(faq.id, 'down')} disabled={i === faqs.length - 1 || isPending}>
                      <ChevronDown size={14} />
                    </Button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Dialog open={openModal === faq.id} onOpenChange={(o) => setOpenModal(o ? faq.id : null)}>
                      <DialogTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent transition-colors">
                        <Edit size={14} />
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader><DialogTitle>Modifier la FAQ</DialogTitle></DialogHeader>
                        <FaqForm faq={faq} onDone={() => setOpenModal(null)} />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-400 hover:text-red-600 hover:bg-accent transition-colors">
                        <Trash2 size={14} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette FAQ ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(faq.id)} className="bg-red-500 hover:bg-red-600 text-white">Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Aucune FAQ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
