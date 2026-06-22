/**
 * Seed provisoire — Avis, FAQ, Partenaires
 * Usage: DATABASE_URL="..." pnpm exec tsx packages/db/scripts/seed-provisional.ts
 *
 * Idempotent : supprime d'abord les données existantes de ces 3 tables
 * avant d'insérer les données provisoires.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n🌱 Seed provisoire — Avis / FAQ / Partenaires\n')

  // ── Avis ────────────────────────────────────────────────────────────────────
  await prisma.avis.deleteMany()
  const avis = await prisma.avis.createMany({
    data: [
      {
        nomClient: 'Marie-Claire Adjovi',
        note: 5,
        texte: "Avoir ma propre parcelle en Côte d'Ivoire était mon rêve depuis des années. IMORA a rendu ce processus simple et sécurisé depuis Paris. J'ai signé les documents à distance et ma parcelle à Abidjan est désormais sécurisée avec Titre Foncier. Équipe professionnelle et réactive.",
        dateAvis: new Date('2025-02-15'),
        isPublished: true,
      },
      {
        nomClient: 'Diallo Mamadou',
        note: 5,
        texte: "Je cherchais une construction Haut Standing au Bénin pour ma retraite. Le suivi du projet était impeccable, les délais respectés et la qualité au rendez-vous. Je recommande vivement IMORA pour tout projet immobilier en Afrique de l'Ouest.",
        dateAvis: new Date('2025-02-08'),
        isPublished: true,
      },
      {
        nomClient: 'Nathalie Mbala',
        note: 5,
        texte: "La gestion locative proposée par IMORA me permet de percevoir mes loyers chaque mois sans aucun souci. Le rapport mensuel est détaillé et je peux suivre mon bien en ligne depuis Bruxelles. Excellent service, je dors sur mes deux oreilles.",
        dateAvis: new Date('2025-01-22'),
        isPublished: true,
      },
      {
        nomClient: 'Jean-Baptiste Konan',
        note: 4,
        texte: "Achat d'une parcelle avec Titre Foncier à Cotonou. Tout le processus s'est déroulé sans tracasserie comme promis. Communication fluide avec l'équipe. J'aurais aimé davantage de photos lors des visites, mais dans l'ensemble très satisfait.",
        dateAvis: new Date('2024-12-10'),
        isPublished: true,
      },
      {
        nomClient: 'Fatou Sow',
        note: 5,
        texte: "En tant que membre de la diaspora au Canada, je craignais les arnaques immobilières. IMORA m'a accompagnée à chaque étape, avec transparence totale sur les documents et les coûts. Ma parcelle est sécurisée et j'envisage déjà un deuxième investissement.",
        dateAvis: new Date('2024-11-30'),
        isPublished: true,
      },
    ],
  })
  console.log(`✓ ${avis.count} avis insérés`)

  // ── FAQ ─────────────────────────────────────────────────────────────────────
  await prisma.fAQ.deleteMany()
  const faqs = await prisma.fAQ.createMany({
    data: [
      {
        question: "Comment fonctionne le processus d'achat de parcelle avec IMORA ?",
        reponse: "Le processus se déroule en 4 étapes : (1) vous choisissez votre parcelle parmi nos offres publiées, (2) vous nous contactez pour une consultation gratuite, (3) nos experts vérifient les documents et accompagnent la signature chez le notaire, (4) vous recevez votre Titre Foncier. Tout peut se faire à distance pour la diaspora.",
        ordre: 1,
        isPublished: true,
      },
      {
        question: "Est-ce qu'IMORA garantit la sécurité juridique des transactions ?",
        reponse: "Oui. Toutes les parcelles proposées par IMORA sont préalablement vérifiées par nos juristes. Nous travaillons exclusivement avec des notaires agréés et nous ne proposons que des terrains disposant d'un Titre Foncier ou en voie d'obtention. La vente notariée est systématiquement proposée.",
        ordre: 2,
        isPublished: true,
      },
      {
        question: "Puis-je investir depuis l'étranger (diaspora) ?",
        reponse: "Absolument. IMORA est spécialement conçu pour accompagner la diaspora africaine. Tout le processus peut être géré à distance : signature électronique des documents, suivi en ligne, virements internationaux sécurisés, et communication par WhatsApp/visio avec notre équipe locale.",
        ordre: 3,
        isPublished: true,
      },
      {
        question: "Quels sont les délais de livraison pour une construction ?",
        reponse: "Les délais varient selon le standing choisi : 8 à 10 mois pour un modèle Basique ou Moyen Standing, 12 à 18 mois pour un Haut Standing ou Luxe. Ces délais sont contractuellement garantis. Des rapports d'avancement photographiques vous sont envoyés chaque mois.",
        ordre: 4,
        isPublished: true,
      },
      {
        question: "Comment est calculée la commission de gestion locative ?",
        reponse: "La commission IMORA est de 10% du loyer mensuel perçu. Cette commission couvre : la recherche de locataires, la rédaction du bail, l'état des lieux, la collecte des loyers, et le reporting mensuel. Il n'y a aucun frais caché ni frais d'entrée.",
        ordre: 5,
        isPublished: true,
      },
      {
        question: "Quels documents sont nécessaires pour démarrer un projet ?",
        reponse: "Pour un achat de parcelle : une pièce d'identité valide et un justificatif de domicile suffisent pour commencer. Pour une construction : les mêmes documents plus votre projet (standing, nombre de pièces, budget). Notre équipe vous guide ensuite étape par étape pour tout le reste.",
        ordre: 6,
        isPublished: true,
      },
    ],
  })
  console.log(`✓ ${faqs.count} FAQs insérées`)

  // ── Partenaires ─────────────────────────────────────────────────────────────
  // cloudinaryPublicId = '' → la homepage affiche le nom en texte (voir note ci-dessous)
  await prisma.partenaire.deleteMany()
  const partenaires = await prisma.partenaire.createMany({
    data: [
      { nom: 'Notaire Koné & Associés', cloudinaryPublicId: '', ordre: 1, isActive: true },
      { nom: 'TOPO-AFRIK Géomètres', cloudinaryPublicId: '', ordre: 2, isActive: true },
      { nom: 'BTP-CONSTRUCT', cloudinaryPublicId: '', ordre: 3, isActive: true },
      { nom: 'Banque Atlantique', cloudinaryPublicId: '', ordre: 4, isActive: true },
      { nom: 'NSIA Assurances', cloudinaryPublicId: '', ordre: 5, isActive: true },
      { nom: 'Géo Expert Bénin', cloudinaryPublicId: '', ordre: 6, isActive: true },
    ],
  })
  console.log(`✓ ${partenaires.count} partenaires insérés`)

  console.log('\n✅ Seed provisoire terminé.\n')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
