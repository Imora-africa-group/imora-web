import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Laisser passer les routes publiques et assets
  if (
    pathname.includes('/login') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.png'
  ) {
    return NextResponse.next()
  }

  // Rediriger la racine vers la locale par défaut
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url))
  }

  // Vérifier le token JWT — aucun appel DB, compatible Edge Runtime
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return NextResponse.redirect(new URL('/fr/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)'],
}
