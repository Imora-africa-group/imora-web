'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { revalidateWebApp } from '@/lib/revalidate'

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
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[createFaq]', error)
    return { success: false, error: 'Erreur lors de la création de la FAQ' }
  }
}

export async function updateFaq(id: string, formData: FormData) {
  try {
    const raw = Object.fromEntries(formData.entries())
    const data = faqSchema.parse({ ...raw, isPublished: raw.isPublished === 'true' })
    await prisma.fAQ.update({ where: { id }, data })
    revalidatePath('/faq')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[updateFaq]', error)
    return { success: false, error: 'Erreur lors de la mise à jour de la FAQ' }
  }
}

export async function deleteFaq(id: string) {
  try {
    await prisma.fAQ.delete({ where: { id } })
    revalidatePath('/faq')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[deleteFaq]', error)
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}

export async function moveFaq(id: string, direction: 'up' | 'down') {
  try {
    const current = await prisma.fAQ.findUnique({ where: { id } })
    if (!current) return { success: false, error: 'FAQ introuvable' }

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
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[moveFaq]', error)
    return { success: false, error: 'Erreur lors du déplacement' }
  }
}

export async function toggleFaq(id: string, isPublished: boolean) {
  try {
    await prisma.fAQ.update({ where: { id }, data: { isPublished } })
    revalidatePath('/faq')
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[toggleFaq]', error)
    return { success: false, error: 'Erreur lors du changement de visibilité' }
  }
}
