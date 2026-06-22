/**
 * Script de diagnostic — liste les valeurs distinctes de ville/arrondissement
 * actuellement en DB pour toutes les parcelles et loyers.
 *
 * Affiche ensuite les éventuelles divergences avec la liste officielle BENIN_VILLES.
 *
 * Usage: pnpm tsx packages/db/scripts/normalize-locations.ts
 *
 * Ce script est READ-ONLY. Il n'effectue aucune modification.
 * Une fois que vous avez confirmé les mappings, appliquez les corrections
 * manuellement via Prisma Studio (pnpm db:studio) ou en ajoutant une
 * section UPDATE à ce fichier.
 */

import { PrismaClient } from '@prisma/client'
import { BENIN_VILLE_NOMS, BENIN_VILLES } from '../../types/src/geo-benin'

const prisma = new PrismaClient()

async function main() {
  console.log('\n══════════════════════════════════════════')
  console.log('  IMORA — Diagnostic localisation DB')
  console.log('══════════════════════════════════════════\n')

  // ── Parcelles ──────────────────────────────────────────────────────────────
  const parcelles = await prisma.parcelle.findMany({
    select: { id: true, titre: true, pays: true, ville: true, arrondissement: true, status: true },
    orderBy: { ville: 'asc' },
  })

  const parcelleVilles = [...new Set(parcelles.map((p) => p.ville))].sort()
  const parcelleArrondissements = [...new Set(parcelles.map((p) => p.arrondissement))].sort()

  console.log(`📦 PARCELLES — ${parcelles.length} enregistrement(s)\n`)
  console.log('Villes distinctes en DB:')
  parcelleVilles.forEach((v) => {
    const isKnown = BENIN_VILLE_NOMS.includes(v)
    const count = parcelles.filter((p) => p.ville === v).length
    console.log(`  ${isKnown ? '✓' : '⚠'} "${v}" (${count} parcelle(s))`)
  })

  const unknownVilles = parcelleVilles.filter((v) => !BENIN_VILLE_NOMS.includes(v))
  if (unknownVilles.length > 0) {
    console.log('\n⚠  Villes NON RECONNUES (à corriger manuellement):')
    unknownVilles.forEach((v) => {
      const suggestions = BENIN_VILLE_NOMS.filter(
        (known) =>
          known.toLowerCase().includes(v.toLowerCase()) ||
          v.toLowerCase().includes(known.toLowerCase())
      )
      console.log(`  → "${v}" — suggestions: ${suggestions.length > 0 ? suggestions.join(', ') : 'aucune'}`)
      parcelles
        .filter((p) => p.ville === v)
        .forEach((p) => console.log(`     ID: ${p.id} | "${p.titre}" [${p.status}]`))
    })
  }

  console.log('\nArrondissements distinctes en DB:')
  parcelleArrondissements.forEach((a) => {
    const count = parcelles.filter((p) => p.arrondissement === a).length
    // Check if arrondissement matches any known list
    const allKnown = BENIN_VILLES.flatMap((v) => v.arrondissements)
    const isKnown = allKnown.includes(a)
    console.log(`  ${isKnown ? '✓' : '○'} "${a}" (${count} parcelle(s))`)
  })

  // ── Loyers ────────────────────────────────────────────────────────────────
  const loyers = await prisma.loyer.findMany({
    select: { id: true, ville: true, zone: true },
    orderBy: { ville: 'asc' },
  })

  if (loyers.length > 0) {
    console.log(`\n🏠 LOYERS — ${loyers.length} enregistrement(s)\n`)
    const loyerVilles = [...new Set(loyers.map((l) => l.ville))].sort()
    loyerVilles.forEach((v) => {
      const isKnown = BENIN_VILLE_NOMS.includes(v)
      const count = loyers.filter((l) => l.ville === v).length
      console.log(`  ${isKnown ? '✓' : '⚠'} "${v}" (${count} loyer(s))`)
    })

    const unknownLoyerVilles = loyerVilles.filter((v) => !BENIN_VILLE_NOMS.includes(v))
    if (unknownLoyerVilles.length > 0) {
      console.log('\n⚠  Villes LOYERS non reconnues:')
      unknownLoyerVilles.forEach((v) => console.log(`  → "${v}"`))
    }
  } else {
    console.log('\n🏠 LOYERS — aucun enregistrement en DB')
  }

  console.log('\n══════════════════════════════════════════')
  console.log('  Villes officielles dans geo-benin.ts')
  console.log('══════════════════════════════════════════')
  BENIN_VILLES.forEach((v) => {
    console.log(`  • ${v.ville} (${v.departement}) — ${v.arrondissements.length} arrondissements`)
  })
  console.log()
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
