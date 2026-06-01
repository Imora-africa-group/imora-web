// Placeholder — full seed implemented in Phase 1
import { prisma } from "./client";

async function main() {
  console.log("Seed placeholder — implement in Phase 1");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
