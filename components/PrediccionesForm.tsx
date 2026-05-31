'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Partido = {
  id: string
  grupo: string
  equipo_local: string
  equipo_visitante: string
  fecha: string
  goles_local_real: number | null
  goles_visitante_real: number | null
  cerrado: boolean
}

type Prediccion = {
  partido_id: string
  goles_local_predicho: number
  goles_visitante_predicho: number
  puntos_obtenidos: number
}

type Props = {
  partidos: Partido[]
  prediccionesGuardadas: Prediccion[]
  usuarioId: string
  faseCerrada: boolean
  faseNombre: string
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'America/Mazatlan',
  })
}

export default function PrediccionesForm({
  partidos, prediccionesGuardadas, usuarioId, faseCerrada
}: Props) {
  const mapInicial: Record<string, { local: string; visitante: string }> = {}
  prediccionesGuardadas.forEach(p => {
    mapInicial[p.partido_id] = {
      local: String(p.goles_local_predicho),
      visitante: String(p.goles_visitante_predicho),
    }
  })

  const [valores, setValores] = useState(mapInicial)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const yaPredijoTodo = prediccionesGuardadas.length === partidos.length

  function setValor(partidoId: string, campo: 'local' | 'visitante', valor: string) {
    if (faseCerrada || yaPredijoTodo) return
    const num = valor.replace(/\D/g, '').slice(0, 2)
    setValores(prev => ({
      ...prev,
      [partidoId]: { ...prev[partidoId], [campo]: num }
    }))
  }

  async function guardar() {
    setError('')
    setMensaje('')

    // Verificar que todos los partidos tienen predicción
    const sinPrediccion = partidos.filter(p => {
      const v = valores[p.id]
      return !v || v.local === '' || v.visitante === ''
    })

    if (sinPrediccion.length > 0) {
      setError(`Faltan ${sinPrediccion.length} partido(s) por predecir. Debes llenar todos antes de guardar.`)
      return
    }

    setGuardando(true)
    const supabase = createClient()

    const registros = partidos.map(p => ({
      usuario_id: usuarioId,
      partido_id: p.id,
      goles_local_predicho: parseInt(valores[p.id].local),
      goles_visitante_predicho: parseInt(valores[p.id].visitante),
      puntos_obtenidos: 0,
    }))

    const { error: insertError } = await supabase
      .from('predicciones')
      .upsert(registros, { onConflict: 'usuario_id,partido_id' })

    if (insertError) {
      setError('Error al guardar. Intenta de nuevo.')
      setGuardando(false)
      return
    }

    setMensaje('¡Predicciones guardadas! Éxito 🎉')
    setGuardando(false)
    window.location.reload()
  }

  // Agrupar partidos por grupo
  const grupos: Record<string, Partido[]> = {}
  partidos.forEach(p => {
    if (!grupos[p.grupo]) grupos[p.grupo] = []
    grupos[p.grupo].push(p)
  })

  const predMap: Record<string, Prediccion> = {}
  prediccionesGuardadas.forEach(p => { predMap[p.partido_id] = p })

  return (
    <div>
      {yaPredijoTodo && !faseCerrada && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-sm text-blue-700">
          ✅ Ya guardaste todas tus predicciones para esta fase. ¡Mucha suerte!
        </div>
      )}

      {Object.entries(grupos).sort().map(([grupo, matchs]) => (
        <div key={grupo} className="mb-6">
          <h3 className="text-base font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">
              Grupo {grupo}
            </span>
          </h3>

          <div className="space-y-2">
            {matchs.map(partido => {
              const pred = predMap[partido.id]
              const val = valores[partido.id]
              const tieneResultado = partido.goles_local_real !== null

              return (
                <div
                  key={partido.id}
                  className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm"
                >
                  <p className="text-xs text-gray-400 mb-2">{formatFecha(partido.fecha)}</p>

                  <div className="flex items-center gap-2">
                    {/* Equipo local */}
                    <span className="flex-1 text-sm font-semibold text-gray-800 text-right">
                      {partido.equipo_local}
                    </span>

                    {/* Resultado real o predicción */}
                    {tieneResultado ? (
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1">
                        <span className="text-lg font-black text-gray-800">
                          {partido.goles_local_real}
                        </span>
                        <span className="text-gray-400 font-bold">-</span>
                        <span className="text-lg font-black text-gray-800">
                          {partido.goles_visitante_real}
                        </span>
                      </div>
                    ) : pred ? (
                      <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                        <span className="text-lg font-black text-green-700">
                          {pred.goles_local_predicho}
                        </span>
                        <span className="text-green-400 font-bold">-</span>
                        <span className="text-lg font-black text-green-700">
                          {pred.goles_visitante_predicho}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={val?.local ?? ''}
                          onChange={e => setValor(partido.id, 'local', e.target.value)}
                          disabled={faseCerrada}
                          className="w-12 h-10 text-center text-lg font-black border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:bg-gray-100"
                          placeholder="0"
                        />
                        <span className="text-gray-400 font-bold text-xl">-</span>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={val?.visitante ?? ''}
                          onChange={e => setValor(partido.id, 'visitante', e.target.value)}
                          disabled={faseCerrada}
                          className="w-12 h-10 text-center text-lg font-black border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none disabled:bg-gray-100"
                          placeholder="0"
                        />
                      </div>
                    )}

                    {/* Equipo visitante */}
                    <span className="flex-1 text-sm font-semibold text-gray-800">
                      {partido.equipo_visitante}
                    </span>
                  </div>

                  {/* Puntos obtenidos si el partido ya terminó */}
                  {tieneResultado && pred && (
                    <div className="mt-2 text-center">
                      {pred.puntos_obtenidos === 3 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                          ⭐ ¡Marcador exacto! +3 pts
                        </span>
                      )}
                      {pred.puntos_obtenidos === 1 && (
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                          ✅ Resultado correcto +1 pt
                        </span>
                      )}
                      {pred.puntos_obtenidos === 0 && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          ❌ Sin puntos
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Botón guardar */}
      {!faseCerrada && !yaPredijoTodo && (
        <div className="sticky bottom-4 mt-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-3">
              {error}
            </div>
          )}
          {mensaje && (
            <div className="bg-green-50 border border-green-300 text-green-700 rounded-xl px-4 py-3 text-sm mb-3">
              {mensaje}
            </div>
          )}
          <button
            onClick={guardar}
            disabled={guardando}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl text-lg shadow-lg transition-colors disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : '💾 Guardar mis predicciones'}
          </button>
        </div>
      )}
    </div>
  )
}
