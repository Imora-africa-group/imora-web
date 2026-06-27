// Script one-shot — créer l'admin en production
// Usage : pnpm --filter=@imora/db exec dotenv -e ../../.env -- tsx src/create-admin.ts
import { hash } from 'bcryptjs'
import { prisma } from './client'

async function main() {
  const email = 'admin@imora.africa'
  const password = 'changeme123'

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log('✓ AdminUser existe déjà — rien à faire')
    return
  }

  const passwordHash = await hash(password, 10)
  await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      nom: 'Admin IMORA',
      role: 'SUPER_ADMIN',
    },
  })
  console.log(`✅ AdminUser créé : ${email} / ${password}`)
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
