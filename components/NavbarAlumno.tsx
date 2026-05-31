'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = { nombre: string; escuela: string }

export default function NavbarAlumno({ nombre, escuela }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function cerrarSesion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const links = [
    { href: '/dashboard', label: '⚽ Predicciones' },
    { href: '/ranking', label: '🏆 Ranking' },
  ]

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-bold text-sm leading-tight">{nombre}</p>
            <p className="text-green-200 text-xs">{escuela}</p>
          </div>
          <button
            onClick={cerrarSesion}
            className="text-green-200 hover:text-white text-sm underline"
          >
            Salir
          </button>
        </div>

        {/* Nav links */}
        <div className="flex gap-1 pb-0">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? 'bg-gray-50 text-green-700'
                  : 'text-green-100 hover:bg-green-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
