'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const statsSchema = z.object({
  projetsRealises: z.coerce.number().int().min(0),
  clientsSatisfaits: z.coerce.number().int().min(0),
})

export async function updateStats(data: z.infer<typeof statsSchema>) {
  try {
    const parsed = statsSchema.parse(data)
    await prisma.statOverride.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...parsed },
      update: parsed,
    })
    revalidatePath('/statistiques')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'Erreur lors de la sauvegarde' }
  }
}
