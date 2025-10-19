import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard', '/contratos', '/services']

// Rutas públicas (solo accesibles sin autenticación)
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Evitar procesar rutas de API, assets estáticos, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  console.log('🔍 Middleware - Ruta:', pathname, 'Token:', token ? 'Sí' : 'No')

  // Verificar si la ruta es protegida
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Si no hay token y es una ruta protegida, redirigir a login
  if (isProtectedRoute && !token) {
    console.log('⛔ Ruta protegida sin token, redirigiendo a /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si hay token y es una ruta pública, redirigir a dashboard
  // NOTA: La validación real del token se hace en AuthContext
  if (isPublicRoute && token) {
    console.log('🔄 Ruta pública con token, redirigiendo a /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si es la ruta raíz, redirigir según el estado de autenticación
  if (pathname === '/') {
    console.log('🏠 Ruta raíz, redirigiendo a:', token ? '/dashboard' : '/login')
    return NextResponse.redirect(new URL(token ? '/dashboard' : '/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
