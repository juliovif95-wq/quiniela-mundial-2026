'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
    celular: '',
    nombre_completo: '',
    escuela_id: '',
    grado: '',
    usuario: '',
    password: '',
    password2: '',
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

    // Validaciones básicas
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (!/^\d{10}$/.test(form.celular)) {
      setError('El número de celular debe tener exactamente 10 dígitos.')
      return
    }
    if (form.usuario.length < 4) {
      setError('El usuario debe tener al menos 4 caracteres.')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(form.usuario)) {
      setError('El usuario solo puede tener letras, números y guión bajo (_).')
      return
    }

    setCargando(true)
    const supabase = createClient()
    const email = `${form.usuario.toLowerCase().trim()}@quiniela.local`

    // Crear cuenta en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: form.password,
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('Ese nombre de usuario ya está en uso. Elige otro.')
      } else {
        setError('Ocurrió un error al crear tu cuenta. Intenta de nuevo.')
      }
      setCargando(false)
      return
    }

    if (!authData.user) {
      setError('No se pudo crear la cuenta. Intenta de nuevo.')
      setCargando(false)
      return
    }

    // Guardar perfil del alumno
    const { error: perfilError } = await supabase.from('perfiles').insert({
      id: authData.user.id,
      nombre_completo: form.nombre_completo.trim(),
      grado: form.grado,
      escuela_id: form.escuela_id,
      celular: form.celular,
      usuario: form.usuario.toLowerCase().trim(),
      rol: 'alumno',
    })

    if (perfilError) {
      if (perfilError.message.includes('celular')) {
        setError('Ese número de celular ya está registrado.')
      } else if (perfilError.message.includes('usuario')) {
        setError('Ese nombre de usuario ya está en uso. Elige otro.')
      } else {
        setError('Error al guardar tu perfil. Intenta de nuevo.')
      }
      // Limpiar el usuario de auth si falló el perfil
      await supabase.auth.signOut()
      setCargando(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-green-700 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">⚽</div>
          <h1 className="text-2xl font-bold text-white">Quiniela Mundial 2026</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">Crear mi cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Paso 1: Celular */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                📱 Número de celular
              </label>
              <input
                type="tel"
                value={form.celular}
                onChange={e => set('celular', e.target.value)}
                placeholder="10 dígitos, ej: 6641234567"
                required
                maxLength={10}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                👤 Nombre completo
              </label>
              <input
                type="text"
                value={form.nombre_completo}
                onChange={e => set('nombre_completo', e.target.value)}
                placeholder="Nombre y apellidos"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Escuela */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🏫 Mi escuela
              </label>
              <select
                value={form.escuela_id}
                onChange={e => set('escuela_id', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Selecciona tu escuela</option>
                {escuelas.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>

            {/* Grado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                📚 Grado escolar
              </label>
              <select
                value={form.grado}
                onChange={e => set('grado', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Selecciona tu grado</option>
                {GRADOS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Usuario */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🔑 Elige tu usuario
              </label>
              <input
                type="text"
                value={form.usuario}
                onChange={e => set('usuario', e.target.value)}
                placeholder="ej: juanito123"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Solo letras, números y _ (guión bajo)</p>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🔒 Contraseña
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                🔒 Repite tu contraseña
              </label>
              <input
                type="password"
                value={form.password2}
                onChange={e => set('password2', e.target.value)}
                placeholder="Escríbela igual que arriba"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-base transition-colors disabled:opacity-50"
            >
              {cargando ? 'Creando cuenta...' : 'Crear mi cuenta ⚽'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
                Entrar aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
