import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.png'
  ) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', req.url))
  }

  const isLoggedIn = !!req.auth
  const isLoginPage = pathname.includes('/login')

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/fr', req.url))
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/fr/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)'],
}
