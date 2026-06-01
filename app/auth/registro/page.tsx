'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiluetaJugador from '@/components/SiluetaJugador'
import LogoQuiniela from '@/components/LogoQuiniela'

type Escuela = { id: string; nombre: string }

const GRADOS = [
  '1° Primaria', '2° Primaria', '3° Primaria', '4° Primaria', '5° Primaria', '6° Primaria',
  '1° Secundaria', '2° Secundaria', '3° Secundaria',
]

export default function RegistroPage() {
  const router = useRouter()
  const [escuelas, setEscuelas] = useState<Escuela[]>([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [form, setForm] = useState({
    celular: '', nombre_completo: '', escuela_id: '',
    grado: '', usuario: '', password: '', password2: '',
    tipo_usuario: 'alumno' as 'alumno' | 'maestro',
  })

  useEffect(() => {
    async function cargarEscuelas() {
      const supabase = createClient()
      const { data } = await supabase.from('escuelas').select('id, nombre').order('nombre')
      if (data) setEscuelas(data)
    }
    cargarEscuelas()
  }, [])

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) { setError('Las contraseñas no coinciden.'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (!/^\d{10}$/.test(form.celular)) { setError('El número de celular debe tener exactamente 10 dígitos.'); return }
    if (form.usuario.length < 4) { setError('El usuario debe tener al menos 4 caracteres.'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(form.usuario)) { setError('El usuario solo puede tener letras, números y _ (guión bajo).'); return }

    setCargando(true)
    const supabase = createClient()
    const email = `${form.usuario.toLowerCase().trim()}@quiniela.local`

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password: form.password })
    if (authError) {
      setError(authError.message.includes('already registered') ? 'Ese usuario ya está en uso. Elige otro.' : 'Error al crear tu cuenta. Intenta de nuevo.')
      setCargando(false); return
    }
    if (!authData.user) { setError('No se pudo crear la cuenta. Intenta de nuevo.'); setCargando(false); return }

    const { error: perfilError } = await supabase.from('perfiles').insert({
      id: authData.user.id,
      nombre_completo: form.nombre_completo.trim(),
      grado: form.grado,
      escuela_id: form.escuela_id,
      celular: form.celular,
      usuario: form.usuario.toLowerCase().trim(),
      rol: 'alumno',
      tipo_usuario: form.tipo_usuario,
    })

    if (perfilError) {
      if (perfilError.message.includes('celular')) setError('Ese número de celular ya está registrado.')
      else if (perfilError.message.includes('usuario')) setError('Ese usuario ya está en uso. Elige otro.')
      else setError('Error al guardar tu perfil. Intenta de nuevo.')
      await supabase.auth.signOut()
      setCargando(false); return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen grad-mundial flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Patrón de puntos de fondo */}
      <div className="absolute inset-0 bg-dots pointer-events-none" />

      {/* Siluetas decorativas */}
      <SiluetaJugador
        pose="corre"
        className="absolute right-0 bottom-0 h-[48vh] text-white opacity-[0.08] translate-x-1/3"
      />
      <SiluetaJugador
        pose="cabeceo"
        className="absolute left-0 bottom-0 h-[38vh] text-white opacity-[0.07] -translate-x-1/4"
      />
      <SiluetaJugador
        pose="salta"
        className="absolute right-[12%] bottom-[12vh] h-[24vh] text-white opacity-[0.05]"
      />

      {/* Estrellas decorativas */}
      <div className="absolute top-14 right-1/4 text-[#FFD700] text-2xl opacity-20 animate-pulse-soft">★</div>
      <div className="absolute top-10 left-1/3 text-[#FFD700] text-base opacity-15 animate-pulse-soft" style={{ animationDelay: '1s' }}>★</div>

      {/* Banda superior */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C8102E] via-[#FF2040] to-[#C8102E]" />

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">

        {/* Logo SVG */}
        <div className="flex justify-center mb-5">
          <LogoQuiniela className="w-24 h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]" />
        </div>

        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden border border-white/30">
          {/* Barra dorada superior */}
          <div className="h-1.5 bg-gradient-to-r from-[#FFD700] via-[#FFF8DC] to-[#FFD700]" />

          <div className="p-6">
            <h2 className="font-display text-2xl text-[#002070] uppercase tracking-wide mb-1">
              Crear mi cuenta
            </h2>
            <p className="text-gray-400 text-sm mb-5">Llena todos los campos para registrarte</p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Selector alumno / maestro */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  ¿Eres alumno o maestro?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => set('tipo_usuario', 'alumno')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                      form.tipo_usuario === 'alumno'
                        ? 'bg-[#003DA5] border-[#003DA5] text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#003DA5]'
                    }`}
                  >
                    <span>🎒</span> Soy alumno
                  </button>
                  <button
                    type="button"
                    onClick={() => set('tipo_usuario', 'maestro')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                      form.tipo_usuario === 'maestro'
                        ? 'bg-[#7c3aed] border-[#7c3aed] text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#7c3aed]'
                    }`}
                  >
                    <span>📋</span> Soy maestro
                  </button>
                </div>
              </div>

              <Field label="📱 Número de celular">
                <input
                  type="tel" value={form.celular} onChange={e => set('celular', e.target.value)}
                  placeholder="10 dígitos, ej: 6641234567"
                  required maxLength={10}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol"
                />
              </Field>

              <Field label="👤 Nombre completo">
                <input
                  type="text" value={form.nombre_completo} onChange={e => set('nombre_completo', e.target.value)}
                  placeholder="Nombre y apellidos"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol"
                />
              </Field>

              <Field label="🏫 Mi escuela">
                <select
                  value={form.escuela_id} onChange={e => set('escuela_id', e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol bg-white"
                >
                  <option value="">Selecciona tu escuela</option>
                  {escuelas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </Field>

              <Field label="📚 Grado escolar">
                <select
                  value={form.grado} onChange={e => set('grado', e.target.value)}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol bg-white"
                >
                  <option value="">Selecciona tu grado</option>
                  {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>

              <Field label="🔑 Elige tu usuario" hint="Solo letras, números y _ (guión bajo)">
                <input
                  type="text" value={form.usuario} onChange={e => set('usuario', e.target.value)}
                  placeholder="ej: juanito123"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol"
                />
              </Field>

              <Field label="🔒 Contraseña" hint="Mínimo 6 caracteres">
                <input
                  type="password" value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol"
                />
              </Field>

              <Field label="🔒 Repite tu contraseña">
                <input
                  type="password" value={form.password2} onChange={e => set('password2', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:outline-none input-gol"
                />
              </Field>

              {error && (
                <div className="bg-red-50 border-l-4 border-[#C8102E] text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full btn-mundial text-white font-black py-3.5 rounded-xl text-base uppercase tracking-wide shadow-lg disabled:opacity-50 font-display"
              >
                {cargando ? 'Creando cuenta...' : 'Crear mi cuenta →'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" className="text-[#003DA5] font-bold hover:text-[#C8102E] transition-colors">
                  Entrar aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banda inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C8102E] via-[#FF2040] to-[#C8102E]" />
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}
