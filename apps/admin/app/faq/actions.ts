'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const faqSchema = z.object({
  question: z.string().min(1),
  reponse: z.string().min(1),
  isPublished: z.coerce.boolean().default(false),
})

export async function createFaq(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = faqSchema.parse({ ...raw, isPublished: raw.isPublished === 'true' })
    const maxOrdre = await prisma.fAQ.aggregate({ _max: { ordre: true } })
    await prisma.fAQ.create({ data: { ...data, ordre: (maxOrdre._max.ordre ?? 0) + 1 } })
    revalidatePath('/faq')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la création' }
  }
}

export async function updateFaq(id: string, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = faqSchema.parse({ ...raw, isPublished: raw.isPublished === 'true' })
    await prisma.fAQ.update({ where: { id }, data })
    revalidatePath('/faq')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

export async function deleteFaq(id: string) {
  try {
    await prisma.fAQ.delete({ where: { id } })
    revalidatePath('/faq')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function moveFaq(id: string, direction: 'up' | 'down') {
  try {
    const current = await prisma.fAQ.findUnique({ where: { id } })
    if (!current) return { success: false, error: 'Non trouvé' }

    const target = await prisma.fAQ.findFirst({
      where: direction === 'up'
        ? { ordre: { lt: current.ordre } }
        : { ordre: { gt: current.ordre } },
      orderBy: { ordre: direction === 'up' ? 'desc' : 'asc' },
    })

    if (!target) return { success: true }

    await prisma.$transaction([
      prisma.fAQ.update({ where: { id: current.id }, data: { ordre: target.ordre } }),
      prisma.fAQ.update({ where: { id: target.id }, data: { ordre: current.ordre } }),
    ])

    revalidatePath('/faq')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}

export async function toggleFaq(id: string, isPublished: boolean) {
  try {
    await prisma.fAQ.update({ where: { id }, data: { isPublished } })
    revalidatePath('/faq')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur' }
  }
}
