import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/fr/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth
      const isLoginPage = nextUrl.pathname.endsWith('/login')

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL('/', nextUrl))
      }
      if (!isLoggedIn && !isLoginPage) {
        return false
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as unknown as { role: string }).role = token.role as string
      }
      return session
    },
  },
  providers: [],
}
