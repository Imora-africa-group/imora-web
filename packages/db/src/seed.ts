// ⚠️ DEV ONLY — ne jamais exécuter sur la DB prod
import { hash } from "bcryptjs";
import { prisma } from "./client";

async function main() {
  console.log("🌱 Seeding database...");

  // ── Settings ────────────────────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      whatsappNumber: "22997000000",
      telegramChatId: "",
      sloganText: "L'immobilier sécurisé, sans tracasserie",
      serviceParcelleDesc:
        "Des parcelles titrées et viabilisées dans les meilleurs quartiers du Bénin, à des prix compétitifs. Investissez en toute sécurité.",
      serviceConstructDesc:
        "Des maisons clés en main conçues par nos architectes. Suivi de chantier rigoureux et garantie de livraison dans les délais.",
      serviceLocativeDesc:
        "Nous gérons votre bien immobilier de A à Z : recherche de locataires solvables, encaissement des loyers et entretien.",
      exchangeRateUSD: 0.00165,
      exchangeRateEUR: 0.00152,
      fallbackRateUSD: 0.00165,
      fallbackRateEUR: 0.00152,
      facebookUrl: "https://facebook.com/imoraafricagroup",
      instagramUrl: "https://instagram.com/imoraafricagroup",
      linkedinUrl: "",
      youtubeUrl: "",
      mentionsLegales:
        "IMORA AFRICA SARL — Capital social : 10 000 000 FCFA — RCCM RB/COT/24 B XXXXX — Siège social : Cotonou, Bénin",
    },
  });
  console.log("✓ Settings");

  // ── StatOverride ─────────────────────────────────────────────────────────────
  await prisma.statOverride.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      projetsRealises: 47,
      clientsSatisfaits: 89,
    },
  });
  console.log("✓ StatOverride");

  // ── Admin user ───────────────────────────────────────────────────────────────
  const passwordHash = await hash("changeme123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@imora.africa" },
    update: {},
    create: {
      email: "admin@imora.africa",
      passwordHash,
      nom: "Admin IMORA",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✓ AdminUser");

  // ── Parcelles ────────────────────────────────────────────────────────────────
  const parcelles = [
    {
      titre: "Parcelle titrée — Akpakpa Nord",
      ville: "Cotonou",
      arrondissement: "Akpakpa",
      quartier: "Akpakpa Nord",
      prixFCFA: 6_500_000,
      superficie: 200,
      titreFoncier: true,
      venteNotariee: true,
      viabilisation: true,
      distanceGoudron: 50,
      distanceCentreVille: 5.2,
      tempsCotonou: 15,
      description:
        "Belle parcelle titrée en plein cœur d'Akpakpa Nord. Environnement résidentiel calme, toutes commodités à proximité. Eau et électricité disponibles.",
      status: "PUBLISHED" as const,
    },
    {
      titre: "Parcelle viabilisée — Fidjrossè",
      ville: "Cotonou",
      arrondissement: "Fidjrossè",
      quartier: "Fidjrossè Centre",
      prixFCFA: 9_000_000,
      superficie: 300,
      titreFoncier: true,
      venteNotariee: true,
      viabilisation: true,
      distanceGoudron: 20,
      distanceCentreVille: 8.0,
      tempsCotonou: 20,
      description:
        "Grande parcelle dans le quartier prisé de Fidjrossè. Idéale pour construction de villa ou immeuble. Titre foncier en main.",
      status: "PUBLISHED" as const,
    },
    {
      titre: "Parcelle constructible — Godomey",
      ville: "Abomey-Calavi",
      arrondissement: "Godomey",
      quartier: "Godomey Étoile",
      prixFCFA: 4_500_000,
      superficie: 250,
      titreFoncier: false,
      venteNotariee: false,
      viabilisation: true,
      distanceGoudron: 100,
      distanceCentreVille: 12.0,
      tempsCotonou: 30,
      description:
        "Parcelle en zone en pleine expansion. Excellent rapport qualité-prix. Viabilisation en cours dans le quartier. Idéale pour primo-accédants.",
      status: "PUBLISHED" as const,
    },
  ];

  for (const p of parcelles) {
    await prisma.parcelle.create({ data: p });
  }
  console.log("✓ Parcelles (3)");

  // ── Modèles Construction ─────────────────────────────────────────────────────
  const modeles = [
    {
      titre: "Villa F3 Essentielle",
      standing: "BASIQUE" as const,
      prixFCFA: 20_000_000,
      superficie: 80,
      nbPieces: 3,
      niveaux: "R+0",
      inclus: ["Salon + salle à manger", "2 chambres", "1 douche", "Cuisine", "Véranda"],
      optionsNonIncluses: ["Clôture", "Carrelage haut de gamme", "Meubles", "Groupe électrogène"],
      composition: { salon: 1, chambres: 2, cuisine: 1, douches: 1, veranda: 1 },
      status: "PUBLISHED" as const,
    },
    {
      titre: "Studio Moderne",
      standing: "BASIQUE" as const,
      prixFCFA: 12_000_000,
      superficie: 45,
      nbPieces: 1,
      niveaux: "R+0",
      inclus: ["Pièce principale", "Kitchenette", "Salle d'eau", "Terrasse"],
      optionsNonIncluses: ["Clôture", "Meubles", "Climatisation"],
      composition: { salon: 1, cuisine: 1, douches: 1, terrasse: 1 },
      status: "PUBLISHED" as const,
    },
    {
      titre: "Villa F4 Confort",
      standing: "MOYEN" as const,
      prixFCFA: 35_000_000,
      superficie: 120,
      nbPieces: 4,
      niveaux: "R+1",
      inclus: ["Grand salon", "3 chambres dont 1 suite", "2 douches", "Cuisine équipée", "Parking couvert"],
      optionsNonIncluses: ["Piscine", "Meubles", "Système d'alarme", "Groupe électrogène"],
      composition: { salon: 1, chambres: 3, cuisine: 1, douches: 2, parking: 1 },
      status: "PUBLISHED" as const,
    },
    {
      titre: "Appartement F3 Standing",
      standing: "MOYEN" as const,
      prixFCFA: 28_000_000,
      superficie: 95,
      nbPieces: 3,
      niveaux: "R+0",
      inclus: ["Salon lumineux", "2 chambres", "2 salles d'eau", "Cuisine ouverte", "Balcon"],
      optionsNonIncluses: ["Meuble de cuisine", "Dressing", "Climatisation"],
      composition: { salon: 1, chambres: 2, cuisine: 1, douches: 2, balcon: 1 },
      status: "PUBLISHED" as const,
    },
    {
      titre: "Villa Prestige F5",
      standing: "HAUT_STANDING" as const,
      prixFCFA: 65_000_000,
      superficie: 200,
      nbPieces: 5,
      niveaux: "R+1",
      inclus: ["Double salon", "4 chambres avec suites", "3 douches", "Cuisine professionnelle", "Parking 2 voitures", "Jardin paysagé"],
      optionsNonIncluses: ["Piscine", "Domotique", "Panneau solaire"],
      composition: { salon: 2, chambres: 4, cuisine: 1, douches: 3, parking: 2, jardin: 1 },
      status: "PUBLISHED" as const,
    },
    {
      titre: "Villa Executive F4",
      standing: "HAUT_STANDING" as const,
      prixFCFA: 55_000_000,
      superficie: 160,
      nbPieces: 4,
      niveaux: "R+1",
      inclus: ["Salon + séjour", "3 chambres suite", "2 douches", "Cuisine haut de gamme", "Bureau", "Terrasse couverte"],
      optionsNonIncluses: ["Piscine", "Meuble", "Groupe électrogène"],
      composition: { salon: 1, sejour: 1, chambres: 3, cuisine: 1, douches: 2, bureau: 1 },
      status: "PUBLISHED" as const,
    },
    {
      titre: "Villa Grand Luxe R+2",
      standing: "LUXE" as const,
      prixFCFA: 120_000_000,
      superficie: 350,
      nbPieces: 7,
      niveaux: "R+2",
      inclus: ["Grand double salon", "6 suites master", "5 salles de bain", "Cuisine professionnelle", "Salle de cinéma", "Piscine intérieure", "Parking 3 voitures"],
      optionsNonIncluses: ["Domotique complète", "Mobilier design", "Ascenseur"],
      composition: { salon: 2, chambres: 6, cuisine: 1, sallesDeBain: 5, cinema: 1, piscine: 1, parking: 3 },
      status: "PUBLISHED" as const,
    },
    {
      titre: "Villa Signature Piscine",
      standing: "LUXE" as const,
      prixFCFA: 95_000_000,
      superficie: 280,
      nbPieces: 6,
      niveaux: "R+1",
      inclus: ["Salon panoramique", "5 suites", "4 salles de bain", "Cuisine équipée top", "Piscine extérieure", "Terrasse BBQ", "Parking 2 voitures"],
      optionsNonIncluses: ["Mobilier", "Système domotique", "Panneau solaire 5kW"],
      composition: { salon: 1, chambres: 5, cuisine: 1, sallesDeBain: 4, piscine: 1, terrasse: 1, parking: 2 },
      status: "PUBLISHED" as const,
    },
  ];

  for (const m of modeles) {
    await prisma.modeleConstruction.create({ data: m });
  }
  console.log("✓ ModèlesConstruction (8)");

  // ── Réalisations ─────────────────────────────────────────────────────────────
  const realisations = [
    {
      titre: "Résidence Les Palmiers",
      description: "Complexe de 6 villas haut standing livré dans les délais. Finitions premium, piscine commune.",
      zone: "Cotonou Nord",
      standing: "HAUT_STANDING" as const,
      annee: 2023,
      status: "PUBLISHED" as const,
    },
    {
      titre: "Villa Familiale Fidjrossè",
      description: "Villa F4 confort sur 120m², construite en 8 mois. Client entièrement satisfait.",
      zone: "Cotonou — Fidjrossè",
      standing: "MOYEN" as const,
      annee: 2022,
      status: "PUBLISHED" as const,
    },
    {
      titre: "Ensemble Résidentiel Calavi",
      description: "4 villas F3 basiques construites simultanément pour un investisseur diaspora.",
      zone: "Abomey-Calavi",
      standing: "BASIQUE" as const,
      annee: 2024,
      status: "PUBLISHED" as const,
    },
    {
      titre: "Villa Prestige Sèmè-Kpodji",
      description: "Villa de luxe avec piscine et finitions marbre. Projet phare IMORA AFRICA.",
      zone: "Sèmè-Kpodji",
      standing: "LUXE" as const,
      annee: 2023,
      status: "PUBLISHED" as const,
    },
  ];

  for (const r of realisations) {
    await prisma.realisation.create({ data: r });
  }
  console.log("✓ Réalisations (4)");

  // ── FAQ ───────────────────────────────────────────────────────────────────────
  const faqs = [
    {
      question: "Comment financer mon projet immobilier au Bénin ?",
      reponse:
        "Plusieurs options s'offrent à vous : financement personnel, crédit bancaire (BNB, Orabank, BGFI), ou facilités de paiement proposées directement par IMORA AFRICA. Nous vous accompagnons dans le montage de votre dossier.",
      ordre: 1,
      isPublished: true,
    },
    {
      question: "Qu'est-ce qu'un titre foncier et pourquoi est-il important ?",
      reponse:
        "Le titre foncier est le document officiel qui atteste de votre droit de propriété. C'est la garantie ultime contre tout litige foncier. IMORA AFRICA privilégie les parcelles avec titre foncier pour sécuriser vos investissements.",
      ordre: 2,
      isPublished: true,
    },
    {
      question: "Quels sont vos délais de construction ?",
      reponse:
        "Les délais varient selon le modèle choisi : 6 à 8 mois pour une villa basique ou moyenne, 10 à 14 mois pour un standing supérieur ou luxe. Un calendrier précis vous est remis à la signature du contrat.",
      ordre: 3,
      isPublished: true,
    },
    {
      question: "Proposez-vous des facilités de paiement ?",
      reponse:
        "Oui. Nous proposons des plans de paiement échelonnés : 30% à la commande, 40% en cours de chantier, 30% à la livraison. Des arrangements spécifiques peuvent être négociés pour la diaspora.",
      ordre: 4,
      isPublished: true,
    },
    {
      question: "Comment se déroule une vente notariée ?",
      reponse:
        "La vente notariée est réalisée devant un notaire agréé. Elle formalise le transfert de propriété et vous protège légalement. IMORA AFRICA vous met en relation avec des notaires partenaires et vous guide tout au long de la procédure.",
      ordre: 5,
      isPublished: true,
    },
    {
      question: "Intervenez-vous dans toutes les villes du Bénin ?",
      reponse:
        "Nous sommes principalement actifs à Cotonou, Abomey-Calavi, Sèmè-Kpodji, Porto-Novo et leurs environs. Pour d'autres localités, contactez-nous pour étudier la faisabilité de votre projet.",
      ordre: 6,
      isPublished: true,
    },
  ];

  for (const f of faqs) {
    await prisma.fAQ.create({ data: f });
  }
  console.log("✓ FAQ (6)");

  // ── Avis Clients ─────────────────────────────────────────────────────────────
  const avis = [
    {
      nomClient: "Kofi Amoussou",
      note: 5,
      texte:
        "Excellente expérience avec IMORA AFRICA ! Ma villa a été livrée en avance sur le planning. L'équipe est professionnelle et à l'écoute. Je recommande vivement.",
      dateAvis: new Date("2024-03-15"),
      isPublished: true,
    },
    {
      nomClient: "Marie-Laure Agbovi",
      note: 5,
      texte:
        "Depuis la diaspora, j'avais peur d'investir au Bénin. IMORA m'a accompagnée à chaque étape : choix du terrain, suivi de construction, remise des clés. Tout s'est parfaitement passé.",
      dateAvis: new Date("2024-01-20"),
      isPublished: true,
    },
    {
      nomClient: "Jean-Pierre Houngan",
      note: 4,
      texte:
        "Très bonne prestation globale. La construction de ma villa F4 est de qualité. Un léger retard sur la livraison mais l'équipe a été transparente et réactive pour régler les problèmes.",
      dateAvis: new Date("2023-11-08"),
      isPublished: true,
    },
  ];

  for (const a of avis) {
    await prisma.avis.create({ data: a });
  }
  console.log("✓ Avis (3)");

  // ── Partenaires ───────────────────────────────────────────────────────────────
  const partenaires = [
    { nom: "BNB Bank", cloudinaryPublicId: "imora/partenaires/bnb-bank", ordre: 1, isActive: true },
    { nom: "Orabank Bénin", cloudinaryPublicId: "imora/partenaires/orabank", ordre: 2, isActive: true },
    { nom: "Ordre des Notaires du Bénin", cloudinaryPublicId: "imora/partenaires/notaires-benin", ordre: 3, isActive: true },
    { nom: "Architecture & Bâtiment Bénin", cloudinaryPublicId: "imora/partenaires/abb", ordre: 4, isActive: true },
  ];

  for (const p of partenaires) {
    await prisma.partenaire.create({ data: p });
  }
  console.log("✓ Partenaires (4)");

  // ── Loyers de référence ───────────────────────────────────────────────────────
  const loyers = [
    { zone: "Cotonou Centre", ville: "Cotonou", standing: "BASIQUE" as const, modele: "F3", nbPieces: 3, loyerMinFCFA: 80_000, loyerMaxFCFA: 120_000 },
    { zone: "Cotonou Centre", ville: "Cotonou", standing: "MOYEN" as const, modele: "F4", nbPieces: 4, loyerMinFCFA: 150_000, loyerMaxFCFA: 250_000 },
    { zone: "Cotonou Centre", ville: "Cotonou", standing: "HAUT_STANDING" as const, modele: "F5", nbPieces: 5, loyerMinFCFA: 300_000, loyerMaxFCFA: 500_000 },
    { zone: "Cotonou Centre", ville: "Cotonou", standing: "LUXE" as const, modele: "F6+", nbPieces: 6, loyerMinFCFA: 600_000, loyerMaxFCFA: 1_000_000 },
    { zone: "Fidjrossè", ville: "Cotonou", standing: "BASIQUE" as const, modele: "F3", nbPieces: 3, loyerMinFCFA: 70_000, loyerMaxFCFA: 100_000 },
    { zone: "Fidjrossè", ville: "Cotonou", standing: "MOYEN" as const, modele: "F4", nbPieces: 4, loyerMinFCFA: 130_000, loyerMaxFCFA: 200_000 },
    { zone: "Fidjrossè", ville: "Cotonou", standing: "HAUT_STANDING" as const, modele: "F5", nbPieces: 5, loyerMinFCFA: 250_000, loyerMaxFCFA: 400_000 },
    { zone: "Abomey-Calavi", ville: "Abomey-Calavi", standing: "BASIQUE" as const, modele: "F3", nbPieces: 3, loyerMinFCFA: 50_000, loyerMaxFCFA: 80_000 },
    { zone: "Abomey-Calavi", ville: "Abomey-Calavi", standing: "MOYEN" as const, modele: "F4", nbPieces: 4, loyerMinFCFA: 90_000, loyerMaxFCFA: 150_000 },
    { zone: "Abomey-Calavi", ville: "Abomey-Calavi", standing: "HAUT_STANDING" as const, modele: "F5", nbPieces: 5, loyerMinFCFA: 180_000, loyerMaxFCFA: 300_000 },
  ];

  for (const l of loyers) {
    await prisma.loyer.create({ data: l });
  }
  console.log("✓ Loyers de référence (10)");

  console.log("\n✅ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
