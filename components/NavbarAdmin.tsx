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
    { href: '/admin', label: 'Inicio', icon: '📊' },
    { href: '/admin/resultados', label: 'Resultados', icon: '⚽' },
    { href: '/admin/fases', label: 'Fases', icon: '🔄' },
    { href: '/admin/escuelas', label: 'Escuelas', icon: '🏫' },
    { href: '/admin/alumnos', label: 'Alumnos', icon: '👥' },
  ]

  return (
    <nav className="bg-[#111827] shadow-xl">
      <div className="h-1 bg-[#C8102E]" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#003DA5] flex items-center justify-center">
              <span className="text-sm">⚙️</span>
            </div>
            <div>
              <p className="text-white text-xs font-black uppercase tracking-wider leading-none">
                Panel Admin
              </p>
              <p className="text-gray-400 text-xs">Quiniela Mundial 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-gray-400 text-xs hidden sm:block">{nombre}</p>
            <button onClick={cerrarSesion} className="text-gray-500 hover:text-white text-xs underline transition-colors">
              Salir
            </button>
          </div>
        </div>

        <div className="flex gap-0.5 overflow-x-auto pb-0">
          {links.map(link => {
            const activo = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap flex items-center gap-1 px-3 py-2 rounded-t-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  activo
                    ? 'bg-gray-100 text-[#111827]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
