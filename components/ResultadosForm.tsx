'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Bandera from '@/components/Bandera'

type Fase = { id: string; nombre: string; estado: string }
type Partido = {
  id: string; fase_id: string; grupo: string; equipo_local: string
  equipo_visitante: string; fecha: string
  goles_local_real: number | null; goles_visitante_real: number | null
}
type Props = { fases: Fase[]; partidos: Partido[] }

const ORDEN_GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L']

function formatFecha(iso: string) {
  const d = new Date(iso)
  const fecha = d.toLocaleDateString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Mazatlan',
  })
  const hora = d.toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Mazatlan',
  })
  return `${fecha} · ${hora} hrs`
}

export default function ResultadosForm({ fases, partidos }: Props) {
  const [faseSeleccionada, setFaseSeleccionada] = useState(fases[0]?.id ?? '')
  const [resultados, setResultados] = useState<Record<string, { local: string; visitante: string }>>({})
  const [guardando, setGuardando] = useState<string | null>(null)
  const [mensajes, setMensajes] = useState<Record<string, string>>({})

  const partidosFase = partidos.filter(p => p.fase_id === faseSeleccionada)

  const porGrupo: Record<string, Partido[]> = {}
  partidosFase.forEach(p => {
    if (!porGrupo[p.grupo]) porGrupo[p.grupo] = []
    porGrupo[p.grupo].push(p)
  })
  const grupos = ORDEN_GRUPOS.filter(g => porGrupo[g])

  const [grupoIdx, setGrupoIdx] = useState(0)
  const grupoActual = grupos[grupoIdx] ?? grupos[0]
  const partidosGrupo = porGrupo[grupoActual] ?? []

  function grupoCompleto(g: string) {
    return (porGrupo[g] ?? []).every(p => p.goles_local_real !== null)
  }

  function setRes(id: string, campo: 'local' | 'visitante', valor: string) {
    setResultados(prev => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor.replace(/\D/g, '').slice(0, 2) }
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
    const { error } = await supabase.from('partidos').update({
      goles_local_real: parseInt(res.local),
      goles_visitante_real: parseInt(res.visitante),
      cerrado: true,
    }).eq('id', partido.id)

    if (error) {
      setMensajes(prev => ({ ...prev, [partido.id]: '❌ Error al guardar.' }))
      setGuardando(null)
      return
    }
    await supabase.rpc('actualizar_puntos_partido', { p_partido_id: partido.id })
    setMensajes(prev => ({ ...prev, [partido.id]: '✅ Guardado y puntos calculados.' }))
    setGuardando(null)
    window.location.reload()
  }

  return (
    <div>
      {/* Selector de fase */}
      <div className="flex gap-2 flex-wrap mb-6">
        {fases.map(f => (
          <button key={f.id} onClick={() => { setFaseSeleccionada(f.id); setGrupoIdx(0) }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all hover-lift ${
              faseSeleccionada === f.id
                ? 'bg-[#003DA5] text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#003DA5]'
            }`}>
            {f.nombre}
          </button>
        ))}
      </div>

      {grupos.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow">
          No hay partidos en esta fase todavía.
        </div>
      )}

      {grupos.length > 0 && (
        <>
          {/* Barra de progreso de grupos */}
          <div className="bg-white rounded-2xl p-4 shadow mb-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Grupos con resultados</p>
              <p className="text-xs text-gray-400">
                {grupos.filter(g => grupoCompleto(g)).length} / {grupos.length}
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {grupos.map((g, i) => {
                const completo = grupoCompleto(g)
                const esActual = i === grupoIdx
                return (
                  <button key={g} onClick={() => setGrupoIdx(i)}
                    className={`w-9 h-9 rounded-full text-xs font-black transition-all flex items-center justify-center hover-lift ${
                      completo
                        ? 'bg-green-500 text-white shadow'
                        : esActual
                          ? 'bg-[#003DA5] text-white shadow-lg ring-2 ring-[#003DA5]/30 scale-110'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {completo ? '✓' : g}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#003DA5] to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${(grupos.filter(g => grupoCompleto(g)).length / grupos.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Encabezado del grupo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center shadow">
              <span className="text-white font-black text-lg">{grupoActual}</span>
            </div>
            <div>
              <p className="font-black text-gray-800 text-lg">Grupo {grupoActual}</p>
              <p className="text-gray-400 text-xs">
                {partidosGrupo.filter(p => p.goles_local_real !== null).length} / {partidosGrupo.length} resultados ingresados
              </p>
            </div>
          </div>

          {/* Partidos del grupo */}
          <div className="space-y-3 mb-5">
            {partidosGrupo.map(partido => {
              const yaCapturado = partido.goles_local_real !== null
              const res = resultados[partido.id]

              return (
                <div key={partido.id} className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm ${
                  yaCapturado ? 'border-green-200' : 'border-gray-100'
                }`}>
                  <div className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
                    yaCapturado ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {formatFecha(partido.fecha)}
                  </div>

                  <div className="px-4 py-3 flex items-center gap-2">
                    <div className="flex-1 text-right flex items-center justify-end gap-1.5">
                      <span className="font-bold text-gray-800 text-sm">{partido.equipo_local}</span>
                      <Bandera pais={partido.equipo_local} size={16} />
                    </div>

                    {yaCapturado ? (
                      <div className="flex-shrink-0 flex items-center gap-1.5 bg-green-50 border-2 border-green-200 rounded-xl px-3 py-1.5">
                        <span className="text-2xl font-black text-green-700">{partido.goles_local_real}</span>
                        <span className="text-green-400 font-black">–</span>
                        <span className="text-2xl font-black text-green-700">{partido.goles_visitante_real}</span>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        <input type="number" min="0" max="99" placeholder="0"
                          value={res?.local ?? ''} onChange={e => setRes(partido.id, 'local', e.target.value)}
                          className="w-12 h-12 text-center text-xl font-black border-2 border-gray-200 rounded-xl focus:outline-none input-gol"
                        />
                        <span className="text-gray-300 font-black text-xl">–</span>
                        <input type="number" min="0" max="99" placeholder="0"
                          value={res?.visitante ?? ''} onChange={e => setRes(partido.id, 'visitante', e.target.value)}
                          className="w-12 h-12 text-center text-xl font-black border-2 border-gray-200 rounded-xl focus:outline-none input-gol"
                        />
                      </div>
                    )}

                    <div className="flex-1 flex items-center gap-1.5">
<Bandera pais={partido.equipo_visitante} size={16} />
                      <span className="font-bold text-gray-800 text-sm">{partido.equipo_visitante}</span>
                    </div>
                  </div>

                  {!yaCapturado && (
                    <div className="px-4 pb-3 flex items-center gap-3">
                      <button
                        onClick={() => guardarResultado(partido)}
                        disabled={guardando === partido.id}
                        className="btn-mundial text-white font-bold px-5 py-2 rounded-xl text-sm shadow disabled:opacity-50"
                      >
                        {guardando === partido.id ? 'Guardando...' : 'Guardar resultado'}
                      </button>
                      {mensajes[partido.id] && (
                        <span className="text-sm font-medium">{mensajes[partido.id]}</span>
                      )}
                    </div>
                  )}

                  {yaCapturado && (
                    <div className="px-4 pb-2">
                      <span className="text-xs text-green-600 font-bold">✅ Resultado registrado — puntos actualizados</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Navegación entre grupos */}
          <div className="flex gap-2">
            {grupoIdx > 0 && (
              <button onClick={() => setGrupoIdx(grupoIdx - 1)}
                className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-2xl text-sm transition-colors">
                ← {grupos[grupoIdx - 1]}
              </button>
            )}
            {grupoIdx < grupos.length - 1 && (
              <button onClick={() => setGrupoIdx(grupoIdx + 1)}
                className="flex-1 bg-[#111827] hover:bg-gray-800 text-white font-bold py-3 rounded-2xl text-sm transition-colors">
                Siguiente → Grupo {grupos[grupoIdx + 1]}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
