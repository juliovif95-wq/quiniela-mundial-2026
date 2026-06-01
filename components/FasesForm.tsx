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
    await supabase.from('fases').update({ estado: 'cerrada' }).eq('estado', 'abierta')
    const { error } = await supabase.from('fases').update({ estado: 'abierta' }).eq('id', faseId)
    if (error) setMensaje('❌ Error al cambiar la fase.')
    else { setMensaje('✅ Fase abierta correctamente.'); window.location.reload() }
    setCargando(null)
  }

  async function cerrarFase(faseId: string) {
    setCargando(faseId)
    setMensaje('')
    const supabase = createClient()
    const { error } = await supabase.from('fases').update({ estado: 'cerrada' }).eq('id', faseId)
    if (error) setMensaje('❌ Error al cerrar la fase.')
    else { setMensaje('✅ Fase cerrada. Los alumnos ya no pueden cambiar predicciones.'); window.location.reload() }
    setCargando(null)
  }

  return (
    <div>
      {mensaje && (
        <div className="bg-blue-50 border-l-4 border-[#003DA5] text-[#003DA5] rounded-xl px-4 py-3 text-sm font-medium mb-5">
          {mensaje}
        </div>
      )}

      <div className="space-y-3 mb-6">
        {fases.map(f => (
          <div key={f.id} className={`bg-white rounded-2xl border-2 p-4 shadow-sm flex items-center justify-between hover-lift ${
            f.estado === 'abierta' ? 'border-green-200' : 'border-gray-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black ${
                f.estado === 'abierta' ? 'bg-green-500 text-white' :
                f.estado === 'cerrada' ? 'bg-gray-200 text-gray-600' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {f.orden}
              </div>
              <div>
                <p className="font-black text-gray-800">{f.nombre}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  f.estado === 'abierta' ? 'bg-green-100 text-green-700' :
                  f.estado === 'cerrada' ? 'bg-gray-100 text-gray-500' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  {f.estado === 'abierta' ? '🟢 Abierta' : f.estado === 'cerrada' ? '🔒 Cerrada' : '⏳ Pendiente'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {f.estado !== 'abierta' && (
                <button
                  onClick={() => abrirFase(f.id)}
                  disabled={cargando === f.id}
                  className="btn-mundial text-white font-bold px-4 py-2 rounded-xl text-sm shadow disabled:opacity-50"
                >
                  {cargando === f.id ? '...' : 'Abrir'}
                </button>
              )}
              {f.estado === 'abierta' && (
                <button
                  onClick={() => cerrarFase(f.id)}
                  disabled={cargando === f.id}
                  className="btn-rojo text-white font-bold px-4 py-2 rounded-xl text-sm shadow disabled:opacity-50"
                >
                  {cargando === f.id ? '...' : 'Cerrar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <p className="font-black mb-2">⚠️ Recuerda estas reglas</p>
        <ul className="space-y-1 list-disc list-inside text-amber-700">
          <li>Abre una fase cuando los alumnos puedan predecir esos partidos.</li>
          <li>Ciérrala cuando los partidos de esa fase vayan a comenzar.</li>
          <li>Solo puede haber <strong>una fase abierta</strong> a la vez.</li>
        </ul>
      </div>
    </div>
  )
}
