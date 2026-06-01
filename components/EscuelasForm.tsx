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
    setAgregando(true); setError('')
    const supabase = createClient()
    const { data, error } = await supabase.from('escuelas').insert({ nombre: nuevo.trim() }).select().single()
    if (error) setError('Error al agregar la escuela.')
    else if (data) { setEscuelas(prev => [...prev, data]); setNuevo(''); setMensaje('✅ Escuela agregada.') }
    setAgregando(false)
  }

  async function subirLogo(escuelaId: string, file: File) {
    setSubiendo(escuelaId); setError('')
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${escuelaId}.${ext}`
    const { error: uploadError } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (uploadError) {
      setError('Error al subir el logo. Verifica que el bucket "logos" existe en Supabase Storage.')
      setSubiendo(null); return
    }
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
    await supabase.from('escuelas').update({ logo_url: urlData.publicUrl }).eq('id', escuelaId)
    setEscuelas(prev => prev.map(e => e.id === escuelaId ? { ...e, logo_url: urlData.publicUrl } : e))
    setMensaje('✅ Logo actualizado.')
    setSubiendo(null)
  }

  return (
    <div>
      {mensaje && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl px-4 py-3 text-sm font-medium mb-4">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-[#C8102E] text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-4">
          {error}
        </div>
      )}

      {/* Agregar escuela */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm mb-6">
        <h2 className="font-black text-gray-700 uppercase tracking-wide text-sm mb-3">Agregar nueva escuela</h2>
        <div className="flex gap-2">
          <input
            type="text" value={nuevo} onChange={e => setNuevo(e.target.value)}
            placeholder="Nombre completo de la escuela"
            onKeyDown={e => e.key === 'Enter' && agregarEscuela()}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none input-gol"
          />
          <button
            onClick={agregarEscuela}
            disabled={agregando || !nuevo.trim()}
            className="btn-mundial text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow disabled:opacity-50"
          >
            {agregando ? '...' : '+ Agregar'}
          </button>
        </div>
      </div>

      {/* Lista de escuelas */}
      <div className="space-y-3">
        {escuelas.map(e => (
          <div key={e.id} className="bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-sm flex items-center gap-4 hover-lift">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-center shadow-sm">
              {e.logo_url
                ? <Image src={e.logo_url} alt={e.nombre} width={56} height={56} className="object-cover" />
                : <span className="text-2xl">🏫</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-800 text-sm truncate">{e.nombre}</p>
              <p className="text-xs text-gray-400">{e.logo_url ? '✅ Logo cargado' : '⬜ Sin logo'}</p>
            </div>
            <label className="cursor-pointer flex-shrink-0">
              <span className="bg-gray-100 hover:bg-[#003DA5] hover:text-white text-gray-700 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                {subiendo === e.id ? 'Subiendo...' : '📷 Subir logo'}
              </span>
              <input type="file" accept="image/*" className="hidden" disabled={subiendo === e.id}
                onChange={ev => { const file = ev.target.files?.[0]; if (file) subirLogo(e.id, file) }}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
