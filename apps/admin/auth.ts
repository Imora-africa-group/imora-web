import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@imora/db'
import { z } from 'zod'
import { authConfig } from './auth.config'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          console.error('[auth] schema invalid', parsed.error.flatten())
          return null
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email },
        })

        console.error('[auth]', {
          email: parsed.data.email,
          passwordProvided: !!parsed.data.password,
          userFound: !!user,
          hashPrefix: user?.passwordHash?.substring(0, 7),
          secretSet: !!process.env.NEXTAUTH_SECRET,
        })

        if (!user) return null

        const valid = await compare(parsed.data.password, user.passwordHash)
        if (!valid) {
          console.error('[auth] compare failed')
          return null
        }

        return { id: user.id, email: user.email, name: user.nom, role: user.role }
      },
    }),
  ],
})
