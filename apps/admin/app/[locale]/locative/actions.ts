'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const loyerSchema = z.object({
  id: z.string().optional(),
  zone: z.string().min(1),
  ville: z.string().min(1),
  standing: z.enum(['BASIQUE', 'MOYEN', 'HAUT_STANDING', 'LUXE']),
  modele: z.string().optional(),
  nbPieces: z.coerce.number().int().positive(),
  loyerMinFCFA: z.coerce.number().int().positive(),
  loyerMaxFCFA: z.coerce.number().int().positive(),
})

const batchSchema = z.array(loyerSchema)

export async function upsertLoyers(rows: z.infer<typeof batchSchema>) {
  try {
    const parsed = batchSchema.parse(rows)
    await Promise.all(
      parsed.map((row) => {
        const { id, ...data } = row
        if (id) return prisma.loyer.update({ where: { id }, data })
        return prisma.loyer.create({ data })
      })
    )
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('[upsertLoyers]', error)
    return { success: false, error: 'Erreur lors de l\'enregistrement des loyers' }
  }
}

export async function deleteLoyer(id: string) {
  try {
    await prisma.loyer.delete({ where: { id } })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('[deleteLoyer]', error)
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
