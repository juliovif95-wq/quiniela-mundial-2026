import { createClient } from '@/lib/supabase/server'
import Bandera from '@/components/Bandera'

const ESCUELA_ID = '98db5899-60b6-4c14-b922-6e42f34aad0a'
const ESCUELA_NOMBRE = 'Centro Escolar Mar de Cortés'

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

export default async function ResultadosPublicosPage() {
  const supabase = await createClient()

  const [{ data: partidos }, { data: ranking }, { data: perfiles }] = await Promise.all([
    supabase
      .from('partidos')
      .select('id, equipo_local, equipo_visitante, fecha, goles_local_real, goles_visitante_real, fases(nombre)')
      .not('goles_local_real', 'is', null)
      .order('fecha', { ascending: false }),

    supabase
      .from('ranking_por_escuela')
      .select('usuario_id, nombre_completo, grado, puntos_totales, posicion')
      .eq('escuela_id', ESCUELA_ID)
      .order('posicion'),

    supabase
      .from('perfiles')
      .select('id, tipo_usuario')
      .eq('escuela_id', ESCUELA_ID),
  ])

  const tipoMap: Record<string, string> = Object.fromEntries(
    (perfiles ?? []).map(p => [p.id, p.tipo_usuario ?? 'alumno'])
  )

  const medallas: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <main
      className="min-h-screen px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0D2D6B 0%, #0a1e4a 50%, #061230 100%)' }}
    >
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center pt-2 pb-4">
          <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">FIFA World Cup</p>
          <h1 className="text-white font-black uppercase leading-none text-4xl sm:text-5xl"
            style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}>
            MUNDIAL <span className="text-yellow-400">2026</span>
          </h1>
          <p className="text-white/50 text-xs mt-2 tracking-widest">mundialenmicolegio.com</p>
        </div>

        {/* Sección: Ranking */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#FFD700] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-lg">🏆</span>
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-none uppercase tracking-wide">Ranking</h2>
              <p className="text-white/40 text-xs">{ESCUELA_NOMBRE}</p>
            </div>
          </div>

          {(ranking ?? []).length === 0 ? (
            <div className="bg-white/10 rounded-2xl p-8 text-center text-white/50">
              <p className="text-4xl mb-3">🏆</p>
              <p className="font-bold">Aún no hay puntos registrados.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              {/* Header tabla */}
              <div className="bg-[#002070] text-white px-4 py-3 flex items-center text-xs font-black uppercase tracking-wider">
                <span className="w-10">#</span>
                <span className="flex-1">Participante</span>
                <span className="hidden sm:block w-24 text-center">Grado</span>
                <span className="w-14 text-right">Pts</span>
              </div>

              {(ranking ?? []).map((r, i) => {
                const pos = Number(r.posicion)
                const esMaestro = tipoMap[r.usuario_id] === 'maestro'
                return (
                  <div
                    key={r.usuario_id}
                    className={`flex items-center px-4 py-3 border-b border-gray-50 ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <span className={`w-10 text-base font-black ${pos <= 3 ? '' : 'text-gray-400 text-sm'}`}>
                      {medallas[pos] ?? pos}
                    </span>
                    <span className="flex-1 text-sm font-bold text-gray-800 leading-tight">
                      {r.nombre_completo}
                      {esMaestro && (
                        <span className="ml-1.5 badge-maestro">Maestro</span>
                      )}
                    </span>
                    <span className="hidden sm:block w-24 text-center text-xs text-gray-400">{r.grado}</span>
                    <span className="w-14 text-right text-lg font-black text-gray-700">{r.puntos_totales}</span>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Divisor */}
        <div className="h-px bg-white/10" />

        {/* Sección: Resultados */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#C8102E] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-none uppercase tracking-wide">Resultados</h2>
              <p className="text-white/40 text-xs">{(partidos ?? []).length} partidos jugados</p>
            </div>
          </div>

          {(partidos ?? []).length === 0 ? (
            <div className="bg-white/10 rounded-2xl p-8 text-center text-white/50">
              <p className="text-4xl mb-3">⏳</p>
              <p className="font-bold">Aún no hay resultados capturados.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(partidos ?? []).map(partido => {
                const fase = (partido.fases as unknown as { nombre: string } | null)?.nombre ?? ''
                const golL = partido.goles_local_real!
                const golV = partido.goles_visitante_real!
                const localGana = golL > golV
                const visitanteGana = golV > golL

                return (
                  <div key={partido.id} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    {/* Encabezado: fase y fecha */}
                    <div className="px-4 py-1.5 bg-white/5 flex items-center justify-between">
                      <span className="text-blue-300 text-xs font-bold uppercase tracking-wide">{fase}</span>
                      <span className="text-white/40 text-xs">{formatFecha(partido.fecha)}</span>
                    </div>

                    {/* Equipos y marcador */}
                    <div className="px-4 py-3 flex items-center gap-2">
                      {/* Local */}
                      <div className="flex-1 flex items-center justify-end gap-2">
                        <span className={`text-sm font-black leading-tight text-right ${localGana ? 'text-white' : 'text-white/60'}`}>
                          {partido.equipo_local}
                        </span>
                        <Bandera pais={partido.equipo_local} size={18} />
                      </div>

                      {/* Marcador */}
                      <div className="flex-shrink-0 flex items-center gap-1 bg-white/15 rounded-xl px-3 py-1.5">
                        <span className={`text-2xl font-black ${localGana ? 'text-yellow-400' : 'text-white'}`}>{golL}</span>
                        <span className="text-white/40 font-black mx-0.5">–</span>
                        <span className={`text-2xl font-black ${visitanteGana ? 'text-yellow-400' : 'text-white'}`}>{golV}</span>
                      </div>

                      {/* Visitante */}
                      <div className="flex-1 flex items-center gap-2">
                        <Bandera pais={partido.equipo_visitante} size={18} />
                        <span className={`text-sm font-black leading-tight ${visitanteGana ? 'text-white' : 'text-white/60'}`}>
                          {partido.equipo_visitante}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-white/30 text-xs tracking-widest">mundialenmicolegio.com · 2026</p>
        </div>

      </div>
    </main>
  )
}
