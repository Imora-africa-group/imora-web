'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateStats } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trophy, Users, MapPin, Handshake } from 'lucide-react'

interface Props {
  projetsRealises: number
  clientsSatisfaits: number
  parcellesCount: number
  partenairesCount: number
}

export function StatistiquesClient({ projetsRealises, clientsSatisfaits, parcellesCount, partenairesCount }: Props) {
  const [projets, setProjets] = useState(projetsRealises)
  const [clients, setClients] = useState(clientsSatisfaits)
  const [isPending, startTransition] = useTransition()

  function save() {
    startTransition(async () => {
      const res = await updateStats({ projetsRealises: projets, clientsSatisfaits: clients })
      if (res.success) toast.success('Statistiques sauvegardées')
      else toast.error(res.error)
    })
  }

  const stats = [
    { label: 'Projets réalisés', value: projets, icon: Trophy, color: '#B8860B', editable: true, setter: setProjets },
    { label: 'Clients satisfaits', value: clients, icon: Users, color: '#059669', editable: true, setter: setClients },
    { label: 'Parcelles disponibles', value: parcellesCount, icon: MapPin, color: '#0D2A4E', editable: false, setter: null },
    { label: 'Partenaires actifs', value: partenairesCount, icon: Handshake, color: '#7c3aed', editable: false, setter: null },
  ]

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Valeurs manuelles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm text-gray-700 block mb-1.5">Projets réalisés</Label>
            <Input
              type="number"
              min={0}
              value={projets}
              onChange={(e) => setProjets(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-sm text-gray-700 block mb-1.5">Clients satisfaits</Label>
            <Input
              type="number"
              min={0}
              value={clients}
              onChange={(e) => setClients(Number(e.target.value))}
            />
          </div>
          <div>
            <Label className="text-sm text-gray-700 block mb-1.5">Parcelles disponibles (calculé)</Label>
            <Input value={parcellesCount} disabled className="bg-gray-50 text-gray-400" />
            <p className="text-xs text-gray-400 mt-1">Calculé automatiquement depuis les parcelles publiées</p>
          </div>
          <div>
            <Label className="text-sm text-gray-700 block mb-1.5">Partenaires actifs (calculé)</Label>
            <Input value={partenairesCount} disabled className="bg-gray-50 text-gray-400" />
            <p className="text-xs text-gray-400 mt-1">Calculé automatiquement depuis les partenaires actifs</p>
          </div>
        </div>
        <Button
          onClick={save}
          disabled={isPending}
          className="text-white"
          style={{ backgroundColor: '#B8860B' }}
        >
          {isPending ? 'Enregistrement...' : 'Sauvegarder'}
        </Button>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Aperçu section Homepage
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-xl" style={{ backgroundColor: '#0D2A4E' }}>
          {stats.map((stat) => {
            const Icon = stat.icon
            const displayValue = stat.editable
              ? (stat.label === 'Projets réalisés' ? projets : clients)
              : stat.value
            return (
              <div key={stat.label} className="text-center">
                <Icon className="mx-auto mb-2 opacity-60" size={24} color={stat.color} />
                <p className="text-3xl font-bold text-white">{displayValue}+</p>
                <p className="text-xs text-white/60 mt-1">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
