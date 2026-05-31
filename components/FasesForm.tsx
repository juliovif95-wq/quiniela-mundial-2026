'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Fase = { id: string; nombre: string; estado: string; orden: number }

export default function FasesForm({ fases }: { fases: Fase[] }) {
  const [cargando, setCargando] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')

  async function abrirFase(faseId: string) {
    setCargando(faseId)
    setMensaje('')
    const supabase = createClient()

    // Cerrar todas las demás fases abiertas
    await supabase.from('fases').update({ estado: 'cerrada' }).eq('estado', 'abierta')

    // Abrir la fase seleccionada
    const { error } = await supabase.from('fases').update({ estado: 'abierta' }).eq('id', faseId)

    if (error) {
      setMensaje('❌ Error al cambiar la fase.')
    } else {
      setMensaje('✅ Fase abierta correctamente.')
      window.location.reload()
    }
    setCargando(null)
  }

  async function cerrarFase(faseId: string) {
    setCargando(faseId)
    setMensaje('')
    const supabase = createClient()

    const { error } = await supabase.from('fases').update({ estado: 'cerrada' }).eq('id', faseId)

    if (error) {
      setMensaje('❌ Error al cerrar la fase.')
    } else {
      setMensaje('✅ Fase cerrada. Los alumnos ya no pueden editar predicciones.')
      window.location.reload()
    }
    setCargando(null)
  }

  return (
    <div>
      {mensaje && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm mb-4">
          {mensaje}
        </div>
      )}

      <div className="space-y-3">
        {fases.map(f => (
          <div key={f.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">{f.nombre}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                f.estado === 'abierta' ? 'bg-green-100 text-green-700' :
                f.estado === 'cerrada' ? 'bg-gray-100 text-gray-600' :
                'bg-yellow-50 text-yellow-600'
              }`}>
                {f.estado === 'abierta' ? '🟢 Abierta' : f.estado === 'cerrada' ? '🔒 Cerrada' : '⏳ Pendiente'}
              </span>
            </div>

            <div className="flex gap-2">
              {f.estado !== 'abierta' && (
                <button
                  onClick={() => abrirFase(f.id)}
                  disabled={cargando === f.id}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {cargando === f.id ? '...' : 'Abrir'}
                </button>
              )}
              {f.estado === 'abierta' && (
                <button
                  onClick={() => cerrarFase(f.id)}
                  disabled={cargando === f.id}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {cargando === f.id ? '...' : 'Cerrar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <p className="font-bold mb-1">⚠️ Recuerda:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Abre una fase cuando quieras que los alumnos ingresen sus predicciones.</li>
          <li>Ciérrala cuando comiencen los partidos de esa fase.</li>
          <li>Solo puedes tener una fase abierta a la vez.</li>
        </ul>
      </div>
    </div>
  )
}
