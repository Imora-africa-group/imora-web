'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { saveWhatsapp, saveRates, saveContenu, saveSocial, saveMentions } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Settings {
  whatsappNumber: string
  fallbackRateUSD: number
  fallbackRateEUR: number
  exchangeRateUSD: number
  exchangeRateEUR: number
  exchangeRateUpdatedAt: Date
  sloganText: string
  serviceParcelleDesc: string
  serviceConstructDesc: string
  serviceLocativeDesc: string
  facebookUrl: string
  instagramUrl: string
  linkedinUrl: string
  youtubeUrl: string
  mentionsLegales: string
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">{title}</h2>
      {children}
    </div>
  )
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-700">{label}</Label>
      {children}
    </div>
  )
}

function SaveButton({ isPending, onClick }: { isPending: boolean; onClick: () => void }) {
  return (
    <Button onClick={onClick} disabled={isPending} className="text-white" style={{ backgroundColor: '#B8860B' }}>
      {isPending ? 'Enregistrement...' : 'Sauvegarder'}
    </Button>
  )
}

export function ParametresClient({ settings }: { settings: Settings }) {
  const [isPending, startTransition] = useTransition()

  // WhatsApp
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber)
  // Rates
  const [rateUSD, setRateUSD] = useState(settings.fallbackRateUSD)
  const [rateEUR, setRateEUR] = useState(settings.fallbackRateEUR)
  // Contenu
  const [slogan, setSlogan] = useState(settings.sloganText)
  const [parcDesc, setParcDesc] = useState(settings.serviceParcelleDesc)
  const [constrDesc, setConstrDesc] = useState(settings.serviceConstructDesc)
  const [locDesc, setLocDesc] = useState(settings.serviceLocativeDesc)
  // Social
  const [fb, setFb] = useState(settings.facebookUrl)
  const [ig, setIg] = useState(settings.instagramUrl)
  const [li, setLi] = useState(settings.linkedinUrl)
  const [yt, setYt] = useState(settings.youtubeUrl)
  // Mentions
  const [mentions, setMentions] = useState(settings.mentionsLegales)

  function run(fn: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const res = await fn()
      if (res.success) toast.success('Sauvegardé')
      else toast.error(res.error ?? 'Erreur')
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* WhatsApp */}
      <Section title="WhatsApp Business">
        <FieldRow label="Numéro WhatsApp (avec indicatif)">
          <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+22900000000" />
        </FieldRow>
        <SaveButton isPending={isPending} onClick={() => run(() => saveWhatsapp({ whatsappNumber: whatsapp }))} />
      </Section>

      {/* Taux de change */}
      <Section title="Taux de change">
        <div className="grid grid-cols-2 gap-4">
          <FieldRow label="Taux USD fallback (1 FCFA = x USD)">
            <Input type="number" step="0.00001" value={rateUSD} onChange={(e) => setRateUSD(Number(e.target.value))} />
          </FieldRow>
          <FieldRow label="Taux EUR fallback (1 FCFA = x EUR)">
            <Input type="number" step="0.00001" value={rateEUR} onChange={(e) => setRateEUR(Number(e.target.value))} />
          </FieldRow>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
          Taux actuels (API) : 1 FCFA = {settings.exchangeRateUSD.toFixed(6)} USD | {settings.exchangeRateEUR.toFixed(6)} EUR
          <br />
          Dernière mise à jour : {new Date(settings.exchangeRateUpdatedAt).toLocaleString('fr-FR')}
        </div>
        <SaveButton isPending={isPending} onClick={() => run(() => saveRates({ fallbackRateUSD: rateUSD, fallbackRateEUR: rateEUR }))} />
      </Section>

      {/* Contenu statique */}
      <Section title="Contenu statique">
        <FieldRow label="Slogan">
          <Input value={slogan} onChange={(e) => setSlogan(e.target.value)} />
        </FieldRow>
        <FieldRow label="Description service Parcelle">
          <Textarea value={parcDesc} onChange={(e) => setParcDesc(e.target.value)} rows={3} className="resize-none" />
        </FieldRow>
        <FieldRow label="Description service Construction">
          <Textarea value={constrDesc} onChange={(e) => setConstrDesc(e.target.value)} rows={3} className="resize-none" />
        </FieldRow>
        <FieldRow label="Description service Locative">
          <Textarea value={locDesc} onChange={(e) => setLocDesc(e.target.value)} rows={3} className="resize-none" />
        </FieldRow>
        <SaveButton isPending={isPending} onClick={() => run(() => saveContenu({
          sloganText: slogan, serviceParcelleDesc: parcDesc,
          serviceConstructDesc: constrDesc, serviceLocativeDesc: locDesc,
        }))} />
      </Section>

      {/* Réseaux sociaux */}
      <Section title="Réseaux sociaux">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldRow label="Facebook"><Input value={fb} onChange={(e) => setFb(e.target.value)} placeholder="https://facebook.com/..." /></FieldRow>
          <FieldRow label="Instagram"><Input value={ig} onChange={(e) => setIg(e.target.value)} placeholder="https://instagram.com/..." /></FieldRow>
          <FieldRow label="LinkedIn"><Input value={li} onChange={(e) => setLi(e.target.value)} placeholder="https://linkedin.com/..." /></FieldRow>
          <FieldRow label="YouTube"><Input value={yt} onChange={(e) => setYt(e.target.value)} placeholder="https://youtube.com/..." /></FieldRow>
        </div>
        <SaveButton isPending={isPending} onClick={() => run(() => saveSocial({ facebookUrl: fb, instagramUrl: ig, linkedinUrl: li, youtubeUrl: yt }))} />
      </Section>

      {/* Mentions légales */}
      <Section title="Mentions légales">
        <FieldRow label="Contenu mentions légales">
          <Textarea value={mentions} onChange={(e) => setMentions(e.target.value)} rows={10} className="resize-none font-mono text-xs" />
        </FieldRow>
        <SaveButton isPending={isPending} onClick={() => run(() => saveMentions({ mentionsLegales: mentions }))} />
      </Section>
    </div>
  )
}
