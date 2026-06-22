'use server'

import { prisma } from '@imora/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { revalidateWebApp } from '@/lib/revalidate'

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
    revalidateWebApp(['/']).catch((e) => console.warn('[revalidate] web sync failed:', e))
    return { success: true }
  } catch (error) {
    console.error('[updateStats]', error)
    return { success: false, error: 'Erreur lors de la sauvegarde des statistiques' }
  }
}
