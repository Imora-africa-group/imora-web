'use server'

import { prisma, sendLeadNotification } from '@imora/db'

export async function submitSimulation(
  fd: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const nom = String(fd.get('nom') ?? '').trim()
    const prenom = String(fd.get('prenom') ?? '').trim()
    const telephone = String(fd.get('telephone') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const pays = String(fd.get('pays') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()

    if (!nom || !prenom || !telephone || !email) {
      return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' }
    }

    const simulationData: Record<string, string> = {
      pays: String(fd.get('sim_pays') ?? ''),
      ville: String(fd.get('sim_ville') ?? ''),
      arrondissement: String(fd.get('sim_arrondissement') ?? ''),
      standing: String(fd.get('sim_standing') ?? ''),
      modeleId: String(fd.get('sim_modeleId') ?? ''),
      modeleTitre: String(fd.get('sim_modeleTitre') ?? ''),
      modelePrix: String(fd.get('sim_modelePrix') ?? ''),
      gestionLocative: String(fd.get('sim_gestionLocative') ?? ''),
      parcelleEstimMin: String(fd.get('sim_parcelleEstimMin') ?? ''),
      parcelleEstimMax: String(fd.get('sim_parcelleEstimMax') ?? ''),
      totalEstim: String(fd.get('sim_totalEstim') ?? ''),
    }

    const extras = fd.getAll('extras').map(String)

    const lead = await prisma.lead.create({
      data: {
        nom,
        prenom,
        telephone,
        indicatif: '+229',
        email,
        pays: pays || 'Non précisé',
        message,
        serviceType: 'SIMULATION',
        simulationData,
        extras: extras.length ? extras : undefined,
      },
    })

    await sendLeadNotification(lead).catch(() => {})

    return { success: true }
  } catch {
    return { success: false, error: 'Une erreur est survenue. Veuillez réessayer.' }
  }
}
