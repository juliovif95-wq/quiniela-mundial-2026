'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiluetaJugador from '@/components/SiluetaJugador'

export default function LoginPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    const supabase = createClient()
    const email = `${usuario.toLowerCase().trim()}@quiniela.local`
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Usuario o contraseña incorrectos. Intenta de nuevo.')
      setCargando(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen grad-mundial flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Siluetas decorativas de fondo */}
      <SiluetaJugador
        pose="celebra"
        className="absolute right-0 bottom-0 h-[55vh] text-white opacity-10 translate-x-1/4"
      />
      <SiluetaJugador
        pose="chuta"
        className="absolute left-0 bottom-0 h-[40vh] text-white opacity-8 -translate-x-1/4 scale-x-[-1]"
      />

      {/* Banda roja decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8102E]" />

      <div className="w-full max-w-sm relative z-10">

        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-4 border border-white/20">
            <span className="text-3xl">⚽</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-wide uppercase leading-none">
            Quiniela
          </h1>
          <p className="text-[#FFD700] font-bold text-lg tracking-widest mt-1">
            MUNDIAL 2026
          </p>
          <div className="flex items-center gap-2 justify-center mt-2">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-white/60 text-xs">🇺🇸 🇨🇦 🇲🇽</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-2xl p-7 border border-white/50">
          <h2 className="text-xl font-black text-[#002070] mb-1 uppercase tracking-wide">
            Entrar a mi cuenta
          </h2>
          <p className="text-gray-400 text-sm mb-6">Ingresa tu usuario y contraseña</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Tu nombre de usuario"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-[#C8102E] text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full btn-mundial text-white font-black py-3.5 rounded-xl text-base uppercase tracking-wide shadow-lg disabled:opacity-50"
            >
              {cargando ? 'Entrando...' : 'Entrar al juego →'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              ¿Aún no tienes cuenta?{' '}
              <Link href="/auth/registro" className="text-[#003DA5] font-bold hover:text-[#C8102E] transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Banda roja decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C8102E]" />
    </div>
  )
}
