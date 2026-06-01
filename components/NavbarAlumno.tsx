'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = { nombre: string; escuela: string; logoUrl?: string | null }

export default function NavbarAlumno({ nombre, escuela, logoUrl }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function cerrarSesion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const links = [
    { href: '/dashboard', label: 'Predicciones', icon: '⚽' },
    { href: '/ranking', label: 'Ranking', icon: '🏆' },
  ]

  return (
    <nav className="bg-[#002070] shadow-xl">
      {/* Banda roja superior */}
      <div className="h-1 bg-[#C8102E]" />

      <div className="max-w-2xl mx-auto px-4">
        {/* Header con logo y usuario */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {/* Logo de la escuela o ícono por defecto */}
            <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`Logo de ${escuela}`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg">⚽</span>
              )}
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-wide leading-none font-display">
                Quiniela Mundial
              </p>
              <p className="text-[#FFD700] text-xs font-bold tracking-wider">2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-white text-xs font-bold leading-none truncate max-w-[140px]">{nombre}</p>
              <p className="text-blue-300 text-xs truncate max-w-[140px]">{escuela}</p>
            </div>
            <button
              onClick={cerrarSesion}
              className="text-blue-300 hover:text-white text-xs underline transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {links.map(link => {
            const activo = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-t-xl text-sm font-bold uppercase tracking-wide transition-all ${
                  activo
                    ? 'bg-white text-[#003DA5]'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
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
