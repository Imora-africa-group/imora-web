import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === '/login'

      if (!isLoggedIn && !isLoginPage) {
        return Response.redirect(new URL('/login', nextUrl))
      }
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL('/', nextUrl))
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
