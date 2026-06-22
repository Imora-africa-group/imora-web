'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { revalidateWebApp } from '@/lib/revalidate'

const whatsappSchema = z.object({ whatsappNumber: z.string() })
const ratesSchema = z.object({
  fallbackRateUSD: z.coerce.number().positive(),
  fallbackRateEUR: z.coerce.number().positive(),
})
const contenSchema = z.object({
  sloganText: z.string(),
  serviceParcelleDesc: z.string(),
  serviceConstructDesc: z.string(),
  serviceLocativeDesc: z.string(),
})
const socialSchema = z.object({
  facebookUrl: z.string(),
  instagramUrl: z.string(),
  linkedinUrl: z.string(),
  youtubeUrl: z.string(),
})
const mentionsSchema = z.object({ mentionsLegales: z.string() })

async function getOrCreate() {
  return prisma.settings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton' },
    update: {},
  })
}

export async function saveWhatsapp(data: z.infer<typeof whatsappSchema>) {
  try {
    const parsed = whatsappSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[saveWhatsapp]', error)
    return { success: false, error: 'Erreur lors de la sauvegarde du numéro WhatsApp' }
  }
}

export async function saveRates(data: z.infer<typeof ratesSchema>) {
  try {
    const parsed = ratesSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    revalidateWebApp(['/', '/parcelles', '/construction']).catch((e) =>
      console.warn('[revalidate] web sync failed:', e)
    )
    return { success: true }
  } catch (error) {
    console.error('[saveRates]', error)
    return { success: false, error: 'Erreur lors de la sauvegarde des taux de change' }
  }
}

export async function saveContenu(data: z.infer<typeof contenSchema>) {
  try {
    const parsed = contenSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[saveContenu]', error)
    return { success: false, error: 'Erreur lors de la sauvegarde du contenu' }
  }
}

export async function saveSocial(data: z.infer<typeof socialSchema>) {
  try {
    const parsed = socialSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[saveSocial]', error)
    return { success: false, error: 'Erreur lors de la sauvegarde des liens sociaux' }
  }
}

export async function saveMentions(data: z.infer<typeof mentionsSchema>) {
  try {
    const parsed = mentionsSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    return { success: true }
  } catch (error) {
    console.error('[saveMentions]', error)
    return { success: false, error: 'Erreur lors de la sauvegarde des mentions légales' }
  }
}
