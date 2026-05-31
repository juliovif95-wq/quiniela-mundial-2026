'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = { nombre: string }

export default function NavbarAdmin({ nombre }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function cerrarSesion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const links = [
    { href: '/admin', label: '📊 Inicio' },
    { href: '/admin/resultados', label: '⚽ Resultados' },
    { href: '/admin/fases', label: '🔄 Fases' },
    { href: '/admin/escuelas', label: '🏫 Escuelas' },
    { href: '/admin/alumnos', label: '👥 Alumnos' },
  ]

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-bold text-sm">⚙️ Admin — {nombre}</p>
            <p className="text-gray-400 text-xs">Quiniela Mundial 2026</p>
          </div>
          <button onClick={cerrarSesion} className="text-gray-400 hover:text-white text-sm underline">
            Salir
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-3 py-2 rounded-t-lg text-xs font-semibold transition-colors ${
                pathname === link.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-300 hover:bg-gray-700'
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
