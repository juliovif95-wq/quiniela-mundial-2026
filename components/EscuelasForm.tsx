'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Escuela = { id: string; nombre: string; logo_url: string | null }

export default function EscuelasForm({ escuelas: inicial }: { escuelas: Escuela[] }) {
  const [escuelas, setEscuelas] = useState(inicial)
  const [nuevo, setNuevo] = useState('')
  const [agregando, setAgregando] = useState(false)
  const [subiendo, setSubiendo] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function agregarEscuela() {
    if (!nuevo.trim()) return
    setAgregando(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('escuelas')
      .insert({ nombre: nuevo.trim() })
      .select()
      .single()

    if (error) {
      setError('Error al agregar la escuela.')
    } else if (data) {
      setEscuelas(prev => [...prev, data])
      setNuevo('')
      setMensaje('✅ Escuela agregada.')
    }
    setAgregando(false)
  }

  async function subirLogo(escuelaId: string, file: File) {
    setSubiendo(escuelaId)
    setError('')
    const supabase = createClient()

    const ext = file.name.split('.').pop()
    const path = `${escuelaId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Error al subir el logo. Verifica que el bucket "logos" existe en Supabase Storage.')
      setSubiendo(null)
      return
    }

    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
    const logoUrl = urlData.publicUrl

    await supabase.from('escuelas').update({ logo_url: logoUrl }).eq('id', escuelaId)
    setEscuelas(prev => prev.map(e => e.id === escuelaId ? { ...e, logo_url: logoUrl } : e))
    setMensaje('✅ Logo actualizado.')
    setSubiendo(null)
  }

  return (
    <div>
      {mensaje && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Agregar escuela */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
        <h2 className="font-bold text-gray-700 mb-3">Agregar nueva escuela</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevo}
            onChange={e => setNuevo(e.target.value)}
            placeholder="Nombre de la escuela"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={e => e.key === 'Enter' && agregarEscuela()}
          />
          <button
            onClick={agregarEscuela}
            disabled={agregando || !nuevo.trim()}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50 transition-colors"
          >
            {agregando ? '...' : '+ Agregar'}
          </button>
        </div>
      </div>

      {/* Lista de escuelas */}
      <div className="space-y-3">
        {escuelas.map(e => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            {/* Logo */}
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-center">
              {e.logo_url ? (
                <Image src={e.logo_url} alt={e.nombre} width={56} height={56} className="object-cover" />
              ) : (
                <span className="text-2xl">🏫</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm truncate">{e.nombre}</p>
              <p className="text-xs text-gray-400">{e.logo_url ? 'Logo cargado' : 'Sin logo'}</p>
            </div>

            {/* Subir logo */}
            <label className="cursor-pointer">
              <span className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs px-3 py-2 rounded-lg transition-colors">
                {subiendo === e.id ? 'Subiendo...' : '📷 Logo'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={subiendo === e.id}
                onChange={ev => {
                  const file = ev.target.files?.[0]
                  if (file) subirLogo(e.id, file)
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
