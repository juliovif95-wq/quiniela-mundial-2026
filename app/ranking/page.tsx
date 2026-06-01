import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavbarAlumno from '@/components/NavbarAlumno'
import SiluetaJugador from '@/components/SiluetaJugador'

export default async function RankingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre_completo, escuela_id, escuelas(nombre, logo_url)')
    .eq('id', user.id)
    .single()
  if (!perfil) redirect('/auth/login')

  const { data: ranking } = await supabase
    .from('ranking_por_escuela')
    .select('*')
    .eq('escuela_id', perfil.escuela_id)
    .order('posicion')

  // Obtener tipo_usuario de cada participante del ranking
  const { data: tiposUsuario } = await supabase
    .from('perfiles')
    .select('id, tipo_usuario')
    .in('id', (ranking ?? []).map(r => r.usuario_id))

  const tipoMap: Record<string, string> = Object.fromEntries(
    (tiposUsuario ?? []).map(p => [p.id, p.tipo_usuario ?? 'alumno'])
  )

  const miPosicion = ranking?.find(r => r.usuario_id === user.id)
  const escuela = (perfil.escuelas as unknown as { nombre: string; logo_url: string | null } | null)

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <NavbarAlumno
        nombre={perfil.nombre_completo}
        escuela={escuela?.nombre ?? ''}
        logoUrl={escuela?.logo_url ?? null}
      />

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Mi posición destacada */}
        {miPosicion && (
          <div className="rounded-3xl overflow-hidden shadow-xl mb-6 relative">
            <div className="grad-mundial p-5 relative overflow-hidden">
              <SiluetaJugador
                pose="celebra"
                className="absolute right-0 bottom-0 h-32 text-white opacity-10 translate-x-8"
              />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#FFD700] flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-3xl font-black text-[#002070]">
                    {miPosicion.posicion === 1 ? '🥇' : miPosicion.posicion === 2 ? '🥈' : miPosicion.posicion === 3 ? '🥉' : `#${miPosicion.posicion}`}
                  </span>
                </div>
                <div>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Mi posición en</p>
                  <p className="text-white font-black text-base leading-tight">{escuela?.nombre}</p>
                  <p className="text-[#FFD700] text-3xl font-black leading-none mt-1">
                    {miPosicion.puntos_totales} <span className="text-lg text-white/60">pts</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-[#C8102E]" />
          </div>
        )}

        {/* Encabezado tabla */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#FFD700] flex items-center justify-center shadow">
            <span className="text-lg">🏆</span>
          </div>
          <div>
            <h2 className="font-black text-gray-800 text-lg leading-none">Tabla de posiciones</h2>
            <p className="text-gray-400 text-xs">{escuela?.nombre}</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          {(ranking ?? []).length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <span className="text-5xl block mb-3">🏆</span>
              <p className="font-medium">Aún no hay puntos registrados.</p>
              <p className="text-sm">¡El torneo comenzará pronto!</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-[#002070] text-white px-4 py-3 flex items-center text-xs font-black uppercase tracking-wider">
                <span className="w-10">#</span>
                <span className="flex-1">Participante</span>
                <span className="hidden sm:block w-32 text-center">Grado</span>
                <span className="w-16 text-right">Pts</span>
              </div>

              {(ranking ?? []).map((r, i) => {
                const esYo = r.usuario_id === user.id
                const esMaestro = tipoMap[r.usuario_id] === 'maestro'
                const pos = r.posicion
                const medallas: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
                return (
                  <div
                    key={r.usuario_id}
                    className={`flex items-center px-4 py-3 border-b border-gray-50 transition-colors ${
                      esYo
                        ? 'bg-[#E8F0FE] border-l-4 border-l-[#003DA5]'
                        : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <span className={`w-10 text-base font-black ${pos <= 3 ? '' : 'text-gray-400 text-sm'}`}>
                      {medallas[pos] ?? pos}
                    </span>
                    <span className={`flex-1 text-sm font-bold leading-tight ${esYo ? 'text-[#003DA5]' : 'text-gray-800'}`}>
                      {r.nombre_completo}
                      {esYo && <span className="ml-2 text-xs bg-[#003DA5] text-white px-1.5 py-0.5 rounded-full font-bold">yo</span>}
                      {esMaestro && <span className="ml-1.5 badge-maestro">Maestro</span>}
                    </span>
                    <span className="hidden sm:block w-32 text-center text-xs text-gray-400">{r.grado}</span>
                    <span className={`w-16 text-right text-lg font-black ${esYo ? 'text-[#003DA5]' : 'text-gray-700'}`}>
                      {r.puntos_totales}
                    </span>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
