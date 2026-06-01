import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Bandera from '@/components/Bandera'

type Fila = {
  usuario_id: string
  nombre_completo: string
  grado: string
  escuela_id: string
  nombre_escuela: string
  puntos_totales: number
  posicion_global: number
}

type Props = { searchParams: Promise<{ escuela?: string; top?: string }> }

export default async function Top50Page({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: escuelas } = await supabase
    .from('escuelas')
    .select('id, nombre')
    .order('nombre')

  let query = supabase
    .from('ranking_global')
    .select('*')
    .order('posicion_global')

  if (params.escuela && params.escuela !== 'todas') {
    query = query.eq('escuela_id', params.escuela)
  }

  const limite = parseInt(params.top ?? '50')
  query = query.limit(limite)

  const { data: ranking } = await query

  const escuelaSeleccionada = escuelas?.find(e => e.id === params.escuela)
  const tituloEscuela = escuelaSeleccionada?.nombre ?? 'Todas las escuelas'

  const tops = [10, 20, 50]
  const escuelaActual = params.escuela ?? 'todas'
  const limiteActual = params.top ?? '50'

  function buildUrl(e: string, t: string) {
    const p = new URLSearchParams({ escuela: e, top: t })
    return `/admin/top50?${p.toString()}`
  }

  const shareUrl = `/admin/top50/pantalla?escuela=${escuelaActual}&top=${limiteActual}`

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
            🏆 Top {limiteActual} alumnos
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Ranking de mejores predicciones — {tituloEscuela}
          </p>
        </div>
        <Link
          href={shareUrl}
          target="_blank"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C8102E] to-[#E01535] text-white font-black px-5 py-3 rounded-2xl shadow-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wide"
        >
          📸 Vista para compartir
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-4">
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Escuela</p>
          <div className="flex gap-2 flex-wrap">
            <Link
              href={buildUrl('todas', limiteActual)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                escuelaActual === 'todas'
                  ? 'bg-[#003DA5] text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todas
            </Link>
            {(escuelas ?? []).map(e => (
              <Link
                key={e.id}
                href={buildUrl(e.id, limiteActual)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all max-w-[180px] truncate ${
                  escuelaActual === e.id
                    ? 'bg-[#003DA5] text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {e.nombre}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Mostrar</p>
          <div className="flex gap-2">
            {tops.map(t => (
              <Link
                key={t}
                href={buildUrl(escuelaActual, String(t))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  limiteActual === String(t)
                    ? 'bg-[#C8102E] text-white shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Top {t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        {/* Top 3 destacado */}
        {(ranking ?? []).length > 0 && (
          <div className="grad-mundial p-4 grid grid-cols-3 gap-3">
            {[1, 2, 3].map(pos => {
              const fila = (ranking ?? []).find(r => r.posicion_global === pos) as Fila | undefined
              const medalias: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
              const tamaños: Record<number, string> = { 1: 'text-4xl', 2: 'text-3xl', 3: 'text-2xl' }
              if (!fila) return (
                <div key={pos} className="bg-white/10 rounded-2xl p-3 text-center">
                  <div className="text-2xl opacity-40">{medalias[pos]}</div>
                  <p className="text-white/30 text-xs mt-1">Sin datos</p>
                </div>
              )
              return (
                <div
                  key={pos}
                  className={`bg-white/15 backdrop-blur rounded-2xl p-3 text-center border border-white/20 ${pos === 1 ? 'ring-2 ring-[#FFD700]' : ''}`}
                >
                  <div className={`${tamaños[pos]}`}>{medalias[pos]}</div>
                  <p className={`text-white font-black leading-tight mt-1 ${pos === 1 ? 'text-sm' : 'text-xs'}`}>
                    {fila.nombre_completo.split(' ')[0]}
                  </p>
                  <p className="text-blue-200 text-xs truncate">{fila.nombre_escuela.replace('Centro Escolar ', '').replace('Escuela ', '')}</p>
                  <p className={`font-black text-[#FFD700] mt-1 ${pos === 1 ? 'text-2xl' : 'text-lg'}`}>
                    {fila.puntos_totales}
                    <span className="text-white/50 text-xs font-normal ml-0.5">pts</span>
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Tabla posiciones 4 en adelante */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider w-12">#</th>
                <th className="py-3 px-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Alumno</th>
                <th className="py-3 px-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden md:table-cell">Grado</th>
                <th className="py-3 px-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider hidden lg:table-cell">Escuela</th>
                <th className="py-3 px-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody>
              {(ranking ?? [])
                .filter(r => r.posicion_global > 3)
                .map((r, i) => (
                  <tr key={r.usuario_id} className={`border-t border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="py-3 px-4 font-black text-gray-400 text-sm">{r.posicion_global}</td>
                    <td className="py-3 px-4 font-semibold text-gray-800">{r.nombre_completo}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">{r.grado}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell truncate max-w-[160px]">{r.nombre_escuela}</td>
                    <td className="py-3 px-4 text-right font-black text-[#003DA5] text-base">{r.puntos_totales}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {(ranking ?? []).length === 0 && (
            <div className="py-16 text-center">
              <span className="text-4xl block mb-3">🏆</span>
              <p className="text-gray-400 font-medium">Aún no hay puntos registrados.</p>
              <p className="text-gray-300 text-sm">El ranking se actualiza cuando el admin captura resultados.</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-gray-300 text-xs mt-4">
        Los puntos se actualizan cada vez que se captura un resultado en el panel de administrador.
      </p>
    </div>
  )
}
