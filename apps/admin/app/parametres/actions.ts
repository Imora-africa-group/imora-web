'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function saveRates(data: z.infer<typeof ratesSchema>) {
  try {
    const parsed = ratesSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function saveContenu(data: z.infer<typeof contenSchema>) {
  try {
    const parsed = contenSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function saveSocial(data: z.infer<typeof socialSchema>) {
  try {
    const parsed = socialSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function saveMentions(data: z.infer<typeof mentionsSchema>) {
  try {
    const parsed = mentionsSchema.parse(data)
    await getOrCreate()
    await prisma.settings.update({ where: { id: 'singleton' }, data: parsed })
    revalidatePath('/parametres')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}
