import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Rutas públicas: login, registro, página principal
  const rutasPublicas = ['/', '/auth/login', '/auth/registro', '/informacion', '/resultados-publicos']
  const esRutaPublica = rutasPublicas.includes(pathname)

  // Si no está autenticado y la ruta no es pública → redirigir al login
  if (!user && !esRutaPublica) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Si está autenticado y va al login/registro → redirigir al dashboard
  if (user && (pathname === '/auth/login' || pathname === '/auth/registro')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
