'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { bandera } from '@/lib/banderas'
import SiluetaJugador from '@/components/SiluetaJugador'

type Partido = {
  id: string; grupo: string; equipo_local: string; equipo_visitante: string
  fecha: string; goles_local_real: number | null; goles_visitante_real: number | null; cerrado: boolean
}
type Prediccion = {
  partido_id: string; goles_local_predicho: number; goles_visitante_predicho: number; puntos_obtenidos: number
}
type Props = {
  partidos: Partido[]; prediccionesGuardadas: Prediccion[]
  usuarioId: string; faseCerrada: boolean; faseNombre: string
}

const ORDEN_GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L']

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Mazatlan',
  })
}

export default function PrediccionesForm({
  partidos, prediccionesGuardadas, usuarioId, faseCerrada
}: Props) {
  // Mapa inicial de predicciones guardadas
  const predMap: Record<string, Prediccion> = {}
  prediccionesGuardadas.forEach(p => { predMap[p.partido_id] = p })

  // Estado local de valores ingresados (no guardados aún)
  const [valores, setValores] = useState<Record<string, { local: string; visitante: string }>>(() => {
    const m: Record<string, { local: string; visitante: string }> = {}
    prediccionesGuardadas.forEach(p => {
      m[p.partido_id] = {
        local: String(p.goles_local_predicho),
        visitante: String(p.goles_visitante_predicho),
      }
    })
    return m
  })

  // Partidos agrupados por grupo
  const porGrupo: Record<string, Partido[]> = {}
  partidos.forEach(p => {
    if (!porGrupo[p.grupo]) porGrupo[p.grupo] = []
    porGrupo[p.grupo].push(p)
  })
  const grupos = ORDEN_GRUPOS.filter(g => porGrupo[g])

  // Grupo actual
  const [grupoIdx, setGrupoIdx] = useState(() => {
    // Empezar en el primer grupo sin predecir todo
    const primerIncompleto = grupos.findIndex(g =>
      (porGrupo[g] ?? []).some(p => !predMap[p.id])
    )
    return primerIncompleto === -1 ? 0 : primerIncompleto
  })

  const [guardando, setGuardando] = useState(false)
  const [mensajeGrupo, setMensajeGrupo] = useState('')
  const [errorGrupo, setErrorGrupo] = useState('')

  const grupoActual = grupos[grupoIdx]
  const partidosGrupo = porGrupo[grupoActual] ?? []

  // Funciones de estado de grupo
  function grupoCompleto(g: string) {
    return (porGrupo[g] ?? []).every(p => predMap[p.id])
  }
  function grupoLleno(g: string) {
    return (porGrupo[g] ?? []).every(p => {
      const v = valores[p.id]
      return predMap[p.id] || (v && v.local !== '' && v.visitante !== '')
    })
  }

  function setValor(partidoId: string, campo: 'local' | 'visitante', valor: string) {
    if (faseCerrada || predMap[partidoId]) return
    const num = valor.replace(/\D/g, '').slice(0, 2)
    setValores(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], [campo]: num } }))
  }

  async function guardarGrupo() {
    setErrorGrupo('')
    setMensajeGrupo('')

    const sinPred = partidosGrupo.filter(p => {
      if (predMap[p.id]) return false
      const v = valores[p.id]
      return !v || v.local === '' || v.visitante === ''
    })

    if (sinPred.length > 0) {
      setErrorGrupo(`Faltan ${sinPred.length} partido${sinPred.length > 1 ? 's' : ''} por predecir en este grupo.`)
      return
    }

    // Solo guardar los que no están guardados aún
    const nuevos = partidosGrupo.filter(p => !predMap[p.id])
    if (nuevos.length === 0) {
      // Ya todo guardado, avanzar al siguiente grupo
      if (grupoIdx < grupos.length - 1) setGrupoIdx(grupoIdx + 1)
      return
    }

    setGuardando(true)
    const supabase = createClient()

    const registros = nuevos.map(p => ({
      usuario_id: usuarioId,
      partido_id: p.id,
      goles_local_predicho: parseInt(valores[p.id].local),
      goles_visitante_predicho: parseInt(valores[p.id].visitante),
      puntos_obtenidos: 0,
    }))

    const { error } = await supabase.from('predicciones').upsert(registros, { onConflict: 'usuario_id,partido_id' })

    if (error) {
      setErrorGrupo('Error al guardar. Intenta de nuevo.')
      setGuardando(false)
      return
    }

    // Actualizar predMap localmente
    nuevos.forEach(p => {
      predMap[p.id] = {
        partido_id: p.id,
        goles_local_predicho: parseInt(valores[p.id].local),
        goles_visitante_predicho: parseInt(valores[p.id].visitante),
        puntos_obtenidos: 0,
      }
    })

    setMensajeGrupo(`✅ Grupo ${grupoActual} guardado`)
    setGuardando(false)

    // Avanzar al siguiente grupo si hay más
    setTimeout(() => {
      setMensajeGrupo('')
      if (grupoIdx < grupos.length - 1) setGrupoIdx(grupoIdx + 1)
      else window.location.reload()
    }, 900)
  }

  const todosCompletos = grupos.every(g => grupoCompleto(g))
  const esUltimoGrupo = grupoIdx === grupos.length - 1

  return (
    <div>
      {/* Barra de progreso de grupos */}
      <div className="bg-white rounded-2xl p-4 shadow-md mb-5 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Progreso por grupo</p>
          <p className="text-xs text-gray-400">
            {grupos.filter(g => grupoCompleto(g)).length} / {grupos.length} grupos
          </p>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {grupos.map((g, i) => {
            const completo = grupoCompleto(g)
            const esActual = i === grupoIdx
            const accesible = completo || i <= grupoIdx

            return (
              <button
                key={g}
                onClick={() => accesible && setGrupoIdx(i)}
                disabled={!accesible}
                className={`
                  flex-shrink-0 w-9 h-9 rounded-full text-xs font-black transition-all
                  flex items-center justify-center
                  ${completo
                    ? 'bg-green-500 text-white shadow-md hover-lift'
                    : esActual
                      ? 'bg-[#003DA5] text-white shadow-lg ring-2 ring-[#003DA5]/30 scale-110'
                      : accesible
                        ? 'bg-blue-100 text-[#003DA5] hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {completo ? '✓' : g}
              </button>
            )
          })}
        </div>

        {/* Barra de progreso lineal */}
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#003DA5] to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(grupos.filter(g => grupoCompleto(g)).length / grupos.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Todos completos */}
      {todosCompletos && !faseCerrada && (
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-5 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-green-700 font-black text-lg">¡Completaste todas tus predicciones!</p>
          <p className="text-green-600 text-sm mt-1">Ya puedes esperar a que empiecen los partidos. ¡Mucha suerte!</p>
        </div>
      )}

      {/* Encabezado del grupo actual */}
      {!todosCompletos && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#003DA5] flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">{grupoActual}</span>
              </div>
              <div>
                <p className="font-black text-gray-800 text-lg">Grupo {grupoActual}</p>
                <p className="text-gray-400 text-xs">
                  {partidosGrupo.filter(p => predMap[p.id]).length} / {partidosGrupo.length} partidos predichos
                </p>
              </div>
            </div>
            {faseCerrada && (
              <span className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                🔒 Cerrada
              </span>
            )}
          </div>

          {/* Partidos del grupo */}
          <div className="space-y-3 mb-5">
            {partidosGrupo.map(partido => {
              const pred = predMap[partido.id]
              const val = valores[partido.id]
              const tieneResultado = partido.goles_local_real !== null
              const guardado = !!pred

              return (
                <div
                  key={partido.id}
                  className={`card-partido bg-white rounded-2xl border-2 overflow-hidden shadow-sm ${
                    guardado ? 'border-green-200' : tieneResultado ? 'border-gray-200' : 'border-gray-100'
                  }`}
                >
                  {/* Fecha */}
                  <div className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                    guardado ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {formatFecha(partido.fecha)}
                    {guardado && !tieneResultado && <span className="ml-2 text-green-500">✓ Predicción guardada</span>}
                  </div>

                  <div className="px-4 py-3 flex items-center gap-2 relative">
                    {/* Silueta decorativa de fondo */}
                    <SiluetaJugador
                      pose="chuta"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-12 text-gray-100 pointer-events-none"
                    />

                    {/* Equipo local */}
                    <div className="flex-1 text-right">
                      <span className="text-lg mr-1">{bandera(partido.equipo_local)}</span>
                      <span className="font-bold text-gray-800 text-sm">{partido.equipo_local}</span>
                    </div>

                    {/* Marcador */}
                    <div className="flex-shrink-0 flex items-center gap-1.5 z-10">
                      {tieneResultado ? (
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-3 py-1.5">
                          <span className="text-2xl font-black text-gray-700">{partido.goles_local_real}</span>
                          <span className="text-gray-400 font-black">–</span>
                          <span className="text-2xl font-black text-gray-700">{partido.goles_visitante_real}</span>
                        </div>
                      ) : guardado ? (
                        <div className="flex items-center gap-1.5 bg-[#003DA5] rounded-xl px-3 py-1.5 shadow-md">
                          <span className="text-2xl font-black text-white">{pred.goles_local_predicho}</span>
                          <span className="text-blue-300 font-black">–</span>
                          <span className="text-2xl font-black text-white">{pred.goles_visitante_predicho}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number" min="0" max="99" placeholder="0"
                            value={val?.local ?? ''}
                            onChange={e => setValor(partido.id, 'local', e.target.value)}
                            disabled={faseCerrada}
                            className="w-12 h-12 text-center text-xl font-black border-2 border-gray-200 rounded-xl focus:outline-none input-gol bg-white disabled:bg-gray-50"
                          />
                          <span className="text-gray-300 font-black text-xl">–</span>
                          <input
                            type="number" min="0" max="99" placeholder="0"
                            value={val?.visitante ?? ''}
                            onChange={e => setValor(partido.id, 'visitante', e.target.value)}
                            disabled={faseCerrada}
                            className="w-12 h-12 text-center text-xl font-black border-2 border-gray-200 rounded-xl focus:outline-none input-gol bg-white disabled:bg-gray-50"
                          />
                        </div>
                      )}
                    </div>

                    {/* Equipo visitante */}
                    <div className="flex-1">
                      <span className="font-bold text-gray-800 text-sm">{partido.equipo_visitante}</span>
                      <span className="text-lg ml-1">{bandera(partido.equipo_visitante)}</span>
                    </div>
                  </div>

                  {/* Puntos obtenidos */}
                  {tieneResultado && pred && (
                    <div className={`px-4 py-1.5 text-center text-xs font-black ${
                      pred.puntos_obtenidos === 3 ? 'bg-yellow-50 text-yellow-600' :
                      pred.puntos_obtenidos === 1 ? 'bg-green-50 text-green-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {pred.puntos_obtenidos === 3 && '⭐ ¡Marcador exacto! +3 puntos'}
                      {pred.puntos_obtenidos === 1 && '✅ Resultado correcto +1 punto'}
                      {pred.puntos_obtenidos === 0 && '❌ Sin puntos esta vez'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Navegación y botón guardar */}
          {!faseCerrada && (
            <div className="sticky bottom-4">
              {errorGrupo && (
                <div className="bg-red-50 border-l-4 border-[#C8102E] text-red-700 rounded-xl px-4 py-3 text-sm font-medium mb-3">
                  {errorGrupo}
                </div>
              )}
              {mensajeGrupo && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl px-4 py-3 text-sm font-bold mb-3">
                  {mensajeGrupo}
                </div>
              )}

              <div className="flex gap-2">
                {grupoIdx > 0 && (
                  <button
                    onClick={() => setGrupoIdx(grupoIdx - 1)}
                    className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-3.5 rounded-2xl text-sm transition-colors"
                  >
                    ← {grupos[grupoIdx - 1]}
                  </button>
                )}

                <button
                  onClick={guardarGrupo}
                  disabled={guardando || !grupoLleno(grupoActual)}
                  className="flex-1 btn-mundial text-white font-black py-3.5 rounded-2xl text-base uppercase tracking-wide shadow-xl disabled:opacity-40"
                >
                  {guardando
                    ? 'Guardando...'
                    : grupoCompleto(grupoActual)
                      ? esUltimoGrupo ? '✓ Todo guardado' : `Siguiente → Grupo ${grupos[grupoIdx + 1]}`
                      : esUltimoGrupo ? 'Guardar Grupo ' + grupoActual : `Guardar y avanzar a Grupo ${grupos[grupoIdx + 1]}`
                  }
                </button>
              </div>

              {!grupoLleno(grupoActual) && (
                <p className="text-center text-xs text-gray-400 mt-2">
                  Debes predecir todos los partidos del Grupo {grupoActual} antes de continuar
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Vista de todos los grupos completados (modo repaso) */}
      {todosCompletos && (
        <div className="space-y-6 mt-2">
          {grupos.map(g => (
            <div key={g}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-black">✓</span>
                </div>
                <h3 className="font-black text-gray-700 text-sm uppercase tracking-wide">Grupo {g}</h3>
              </div>
              <div className="space-y-2">
                {(porGrupo[g] ?? []).map(partido => {
                  const pred = predMap[partido.id]
                  const tieneResultado = partido.goles_local_real !== null
                  return (
                    <div key={partido.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                      <p className="text-xs text-gray-400 mb-1.5">{formatFecha(partido.fecha)}</p>
                      <div className="flex items-center gap-2">
                        <span className="flex-1 text-right text-sm font-semibold text-gray-800">
                          {bandera(partido.equipo_local)} {partido.equipo_local}
                        </span>
                        {tieneResultado && pred ? (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black ${
                            pred.puntos_obtenidos === 3 ? 'bg-yellow-100 text-yellow-700' :
                            pred.puntos_obtenidos === 1 ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            <span>{pred.goles_local_predicho}–{pred.goles_visitante_predicho}</span>
                            <span className="ml-1 text-gray-400">|</span>
                            <span>{partido.goles_local_real}–{partido.goles_visitante_real}</span>
                          </div>
                        ) : pred ? (
                          <div className="bg-[#003DA5] text-white text-xs font-black px-2 py-0.5 rounded-lg">
                            {pred.goles_local_predicho}–{pred.goles_visitante_predicho}
                          </div>
                        ) : null}
                        <span className="flex-1 text-sm font-semibold text-gray-800">
                          {partido.equipo_visitante} {bandera(partido.equipo_visitante)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
