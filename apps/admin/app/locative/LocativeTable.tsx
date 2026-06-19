'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { upsertLoyers, deleteLoyer } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Trash2, Save } from 'lucide-react'
import type { Loyer } from '@imora/db'

type LoyerRow = Partial<Loyer> & {
  _tempId?: string
  zone: string
  ville: string
  standing: 'BASIQUE' | 'MOYEN' | 'HAUT_STANDING' | 'LUXE'
  nbPieces: number
  loyerMinFCFA: number
  loyerMaxFCFA: number
}

const STANDINGS = [
  { value: 'BASIQUE', label: 'Basique' },
  { value: 'MOYEN', label: 'Moyen' },
  { value: 'HAUT_STANDING', label: 'Haut Standing' },
  { value: 'LUXE', label: 'Luxe' },
]

export function LocativeTable({ initialLoyers }: { initialLoyers: Loyer[] }) {
  const [rows, setRows] = useState<LoyerRow[]>(initialLoyers)
  const [isPending, startTransition] = useTransition()

  function addRow() {
    setRows((p) => [
      ...p,
      { _tempId: crypto.randomUUID(), zone: '', ville: '', standing: 'BASIQUE', nbPieces: 1, loyerMinFCFA: 0, loyerMaxFCFA: 0 },
    ])
  }

  function updateRow(idx: number, key: keyof LoyerRow, value: string | number) {
    setRows((p) => p.map((r, i) => (i === idx ? { ...r, [key]: value } : r)))
  }

  function save() {
    startTransition(async () => {
      const res = await upsertLoyers(
        rows.map((r) => ({
          id: r.id,
          zone: r.zone,
          ville: r.ville,
          standing: r.standing,
          modele: r.modele ?? undefined,
          nbPieces: r.nbPieces,
          loyerMinFCFA: r.loyerMinFCFA,
          loyerMaxFCFA: r.loyerMaxFCFA,
        }))
      )
      if (res.success) toast.success('Loyers sauvegardés')
      else toast.error(res.error)
    })
  }

  function handleDelete(idx: number) {
    const row = rows[idx]
    startTransition(async () => {
      if (row.id) {
        const res = await deleteLoyer(row.id)
        if (!res.success) { toast.error(res.error); return }
      }
      setRows((p) => p.filter((_, i) => i !== idx))
      toast.success('Ligne supprimée')
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={addRow} variant="outline" className="gap-2">
          <Plus size={14} /> Ajouter une ligne
        </Button>
        <Button onClick={save} disabled={isPending} className="text-white gap-2" style={{ backgroundColor: '#B8860B' }}>
          <Save size={14} /> {isPending ? 'Sauvegarde...' : 'Sauvegarder tout'}
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                {['Zone', 'Ville', 'Standing', 'Modèle', 'Nb Pièces', 'Loyer Min FCFA', 'Loyer Max FCFA', ''].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((row, idx) => (
                <tr key={row.id ?? row._tempId}>
                  <td className="px-3 py-2">
                    <Input value={row.zone} onChange={(e) => updateRow(idx, 'zone', e.target.value)} className="h-8 text-sm min-w-24" />
                  </td>
                  <td className="px-3 py-2">
                    <Input value={row.ville} onChange={(e) => updateRow(idx, 'ville', e.target.value)} className="h-8 text-sm min-w-24" />
                  </td>
                  <td className="px-3 py-2">
                    <Select value={row.standing} onValueChange={(v) => { if (v) updateRow(idx, 'standing', v) }}>
                      <SelectTrigger className="h-8 text-sm w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STANDINGS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2">
                    <Input value={row.modele ?? ''} onChange={(e) => updateRow(idx, 'modele', e.target.value ?? '')} className="h-8 text-sm w-20" placeholder="R+1..." />
                  </td>
                  <td className="px-3 py-2">
                    <Input type="number" value={row.nbPieces} onChange={(e) => updateRow(idx, 'nbPieces', Number(e.target.value))} className="h-8 text-sm w-16" />
                  </td>
                  <td className="px-3 py-2">
                    <Input type="number" value={row.loyerMinFCFA} onChange={(e) => updateRow(idx, 'loyerMinFCFA', Number(e.target.value))} className="h-8 text-sm w-28" />
                  </td>
                  <td className="px-3 py-2">
                    <Input type="number" value={row.loyerMaxFCFA} onChange={(e) => updateRow(idx, 'loyerMaxFCFA', Number(e.target.value))} className="h-8 text-sm w-28" />
                  </td>
                  <td className="px-3 py-2">
                    <AlertDialog>
                      <AlertDialogTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-red-400 hover:text-red-600 hover:bg-accent transition-colors">
                        <Trash2 size={14} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette ligne ?</AlertDialogTitle>
                          <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(idx)} className="bg-red-500 hover:bg-red-600 text-white">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    Aucune donnée locative. Ajoutez une ligne.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
