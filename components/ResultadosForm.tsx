'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Fase = { id: string; nombre: string; estado: string }
type Partido = {
  id: string
  fase_id: string
  grupo: string
  equipo_local: string
  equipo_visitante: string
  fecha: string
  goles_local_real: number | null
  goles_visitante_real: number | null
}

type Props = { fases: Fase[]; partidos: Partido[] }

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'America/Mazatlan',
  })
}

export default function ResultadosForm({ fases, partidos }: Props) {
  const [faseSeleccionada, setFaseSeleccionada] = useState(fases[0]?.id ?? '')
  const [resultados, setResultados] = useState<Record<string, { local: string; visitante: string }>>({})
  const [guardando, setGuardando] = useState<string | null>(null)
  const [mensajes, setMensajes] = useState<Record<string, string>>({})

  const partidosFase = partidos.filter(p => p.fase_id === faseSeleccionada)

  const grupos: Record<string, Partido[]> = {}
  partidosFase.forEach(p => {
    if (!grupos[p.grupo]) grupos[p.grupo] = []
    grupos[p.grupo].push(p)
  })

  function setRes(partidoId: string, campo: 'local' | 'visitante', valor: string) {
    const num = valor.replace(/\D/g, '').slice(0, 2)
    setResultados(prev => ({
      ...prev,
      [partidoId]: { ...prev[partidoId], [campo]: num }
    }))
  }

  async function guardarResultado(partido: Partido) {
    const res = resultados[partido.id]
    if (!res || res.local === '' || res.visitante === '') {
      setMensajes(prev => ({ ...prev, [partido.id]: '⚠️ Ingresa los dos marcadores.' }))
      return
    }

    setGuardando(partido.id)
    const supabase = createClient()

    const golesLocal = parseInt(res.local)
    const golesVisitante = parseInt(res.visitante)

    const { error } = await supabase
      .from('partidos')
      .update({
        goles_local_real: golesLocal,
        goles_visitante_real: golesVisitante,
        cerrado: true,
      })
      .eq('id', partido.id)

    if (error) {
      setMensajes(prev => ({ ...prev, [partido.id]: '❌ Error al guardar.' }))
      setGuardando(null)
      return
    }

    // Calcular puntos de todos los pronósticos de este partido
    await supabase.rpc('actualizar_puntos_partido', { p_partido_id: partido.id })

    setMensajes(prev => ({ ...prev, [partido.id]: '✅ Resultado guardado y puntos calculados.' }))
    setGuardando(null)
    window.location.reload()
  }

  return (
    <div>
      {/* Selector de fase */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Mostrar partidos de:</label>
        <div className="flex gap-2 flex-wrap">
          {fases.map(f => (
            <button
              key={f.id}
              onClick={() => setFaseSeleccionada(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                faseSeleccionada === f.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f.nombre}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(grupos).sort().map(([grupo, matchs]) => (
        <div key={grupo} className="mb-6">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">
              Grupo {grupo}
            </span>
          </h3>

          <div className="space-y-3">
            {matchs.map(partido => {
              const yaCapturado = partido.goles_local_real !== null
              const res = resultados[partido.id]

              return (
                <div key={partido.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <p className="text-xs text-gray-400 mb-2">{formatFecha(partido.fecha)}</p>

                  <div className="flex items-center gap-3">
                    <span className="flex-1 text-sm font-semibold text-right text-gray-800">
                      {partido.equipo_local}
                    </span>

                    {yaCapturado ? (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                        <span className="text-2xl font-black text-green-700">{partido.goles_local_real}</span>
                        <span className="text-gray-400 font-bold">-</span>
                        <span className="text-2xl font-black text-green-700">{partido.goles_visitante_real}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="0"
                          value={res?.local ?? ''}
                          onChange={e => setRes(partido.id, 'local', e.target.value)}
                          className="w-14 h-11 text-center text-xl font-black border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                        <span className="text-gray-400 font-bold text-xl">-</span>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="0"
                          value={res?.visitante ?? ''}
                          onChange={e => setRes(partido.id, 'visitante', e.target.value)}
                          className="w-14 h-11 text-center text-xl font-black border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                      </div>
                    )}

                    <span className="flex-1 text-sm font-semibold text-gray-800">
                      {partido.equipo_visitante}
                    </span>
                  </div>

                  {!yaCapturado && (
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => guardarResultado(partido)}
                        disabled={guardando === partido.id}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {guardando === partido.id ? 'Guardando...' : 'Guardar resultado'}
                      </button>
                      {mensajes[partido.id] && (
                        <span className="text-sm">{mensajes[partido.id]}</span>
                      )}
                    </div>
                  )}

                  {yaCapturado && (
                    <p className="text-xs text-green-600 mt-2 font-medium">✅ Resultado registrado</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
