import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type Props = { searchParams: Promise<{ escuela?: string; top?: string }> }

const MEDALLAS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default async function PantallaTop50({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles').select('rol').eq('id', user.id).single()
  if (!perfil || perfil.rol !== 'admin') redirect('/dashboard')

  let query = supabase
    .from('ranking_global')
    .select('*')
    .order('posicion_global')

  const escuelaId = params.escuela && params.escuela !== 'todas' ? params.escuela : null
  if (escuelaId) query = query.eq('escuela_id', escuelaId)

  const limite = Math.min(parseInt(params.top ?? '50'), 50)
  query = query.limit(limite)

  const { data: ranking } = await query

  let tituloEscuela = 'Todas las escuelas'
  if (escuelaId) {
    const { data: esc } = await supabase
      .from('escuelas').select('nombre').eq('id', escuelaId).single()
    tituloEscuela = esc?.nombre ?? 'Escuela'
  }

  const ahora = new Date().toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'America/Mazatlan',
  })

  const top3 = (ranking ?? []).filter(r => r.posicion_global <= 3)
  const resto = (ranking ?? []).filter(r => r.posicion_global > 3)

  return (
    <div className="min-h-screen bg-[#001845] flex flex-col items-center justify-start py-6 px-4">

      {/* Tarjeta principal — optimizada para captura */}
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="grad-mundial rounded-3xl p-6 mb-4 relative overflow-hidden shadow-2xl">
          {/* Decoración */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

          <div className="relative z-10 text-center">
            <p className="text-[#FFD700] text-xs font-black uppercase tracking-[0.3em] mb-1">⚽ FIFA World Cup</p>
            <h1 className="text-white text-3xl font-black uppercase tracking-wide leading-none">
              Quiniela
            </h1>
            <p className="text-[#FFD700] font-black text-xl tracking-widest">MUNDIAL 2026</p>

            <div className="mt-4 mb-2">
              <div className="inline-block bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-4 py-2">
                <p className="text-white font-black text-lg uppercase tracking-wide">
                  🏆 Top {limite} — {tituloEscuela === 'Todas las escuelas' ? 'Ranking General' : tituloEscuela}
                </p>
              </div>
            </div>
            <p className="text-blue-200 text-xs">Actualizado: {ahora}</p>
          </div>
        </div>

        {/* Top 3 podio */}
        {top3.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[2, 1, 3].map(pos => {
              const fila = top3.find(r => r.posicion_global === pos)
              if (!fila) return (
                <div key={pos} className={`rounded-2xl p-3 text-center bg-white/5 ${pos === 1 ? 'order-2' : pos === 2 ? 'order-1' : 'order-3'}`}>
                  <p className="text-white/20 text-2xl">{MEDALLAS[pos]}</p>
                </div>
              )
              const alturas: Record<number, string> = { 1: 'pt-4', 2: 'pt-2', 3: 'pt-2' }
              const bgs: Record<number, string> = {
                1: 'bg-gradient-to-b from-[#FFD700]/20 to-[#FFD700]/5 border-[#FFD700]/40',
                2: 'bg-white/10 border-white/20',
                3: 'bg-white/10 border-white/20',
              }
              return (
                <div
                  key={pos}
                  className={`rounded-2xl p-3 text-center border ${bgs[pos]} ${alturas[pos]} ${pos === 1 ? 'order-2' : pos === 2 ? 'order-1' : 'order-3'}`}
                >
                  <p className="text-3xl">{MEDALLAS[pos]}</p>
                  <p className="text-white font-black text-xs leading-tight mt-1 line-clamp-2">
                    {fila.nombre_completo}
                  </p>
                  <p className="text-blue-300 text-[10px] leading-tight mt-0.5 line-clamp-1">
                    {fila.nombre_escuela.replace('Centro Escolar ', '').replace('Escuela ', '')}
                  </p>
                  <p className={`font-black mt-1.5 ${pos === 1 ? 'text-[#FFD700] text-2xl' : 'text-white text-xl'}`}>
                    {fila.puntos_totales}
                    <span className="text-white/40 text-xs font-normal"> pts</span>
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Banda roja separadora */}
        <div className="h-1 bg-[#C8102E] rounded-full mb-4" />

        {/* Lista posiciones 4 en adelante */}
        {resto.length > 0 && (
          <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10">
            {resto.map((r, i) => (
              <div
                key={r.usuario_id}
                className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-white/5' : ''}`}
              >
                <span className="text-white/50 font-black text-sm w-6 text-center flex-shrink-0">
                  {r.posicion_global}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{r.nombre_completo}</p>
                  <p className="text-blue-300 text-xs truncate">
                    {r.nombre_escuela.replace('Centro Escolar ', '').replace('Escuela ', '')} · {r.grado}
                  </p>
                </div>
                <span className="text-[#FFD700] font-black text-base flex-shrink-0">
                  {r.puntos_totales}
                  <span className="text-white/30 text-xs font-normal"> pts</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {(ranking ?? []).length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40 text-lg">Aún no hay puntos registrados.</p>
          </div>
        )}

        {/* Pie de página */}
        <div className="mt-6 text-center">
          <p className="text-white/20 text-xs">quiniela-mundial-alpha.vercel.app</p>
        </div>
      </div>

      {/* Botón volver — solo visible en pantalla, no se captura */}
      <div className="mt-6 print:hidden">
        <a
          href="/admin/top50"
          className="text-blue-300 text-sm underline hover:text-white transition-colors"
        >
          ← Volver al panel
        </a>
      </div>
    </div>
  )
}
