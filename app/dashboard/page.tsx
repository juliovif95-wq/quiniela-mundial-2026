import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PrediccionesForm from '@/components/PrediccionesForm'
import ResumenPuntos from '@/components/ResumenPuntos'
import BannerFechasLimite from '@/components/BannerFechasLimite'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Todas las fases actualmente abiertas
  const { data: fases } = await supabase
    .from('fases')
    .select('*')
    .eq('estado', 'abierta')
    .order('orden')

  // Puntos totales del alumno
  const { data: puntos } = await supabase
    .from('predicciones')
    .select('puntos_obtenidos')
    .eq('usuario_id', user.id)

  const totalPuntos = (puntos ?? []).reduce((sum, p) => sum + (p.puntos_obtenidos ?? 0), 0)

  if (!fases || fases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🏆</div>
        <p className="text-gray-600 text-lg font-medium">
          No hay una fase abierta en este momento.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          El administrador abrirá la siguiente fase pronto.
        </p>
        <ResumenPuntos total={totalPuntos} />
      </div>
    )
  }

  // Partidos de todas las fases abiertas
  const { data: partidos } = await supabase
    .from('partidos')
    .select('*')
    .in('fase_id', fases.map(f => f.id))
    .order('fecha')

  // Predicciones ya guardadas del alumno para esos partidos
  const { data: predicciones } = await supabase
    .from('predicciones')
    .select('*')
    .eq('usuario_id', user.id)
    .in('partido_id', (partidos ?? []).map(p => p.id))

  return (
    <div>
      <ResumenPuntos total={totalPuntos} />
      <BannerFechasLimite />

      {fases.map(fase => {
        const partidosFase = (partidos ?? []).filter(p => p.fase_id === fase.id)
        const partidosFaseIds = new Set(partidosFase.map(p => p.id))
        const prediccionesFase = (predicciones ?? []).filter(p => partidosFaseIds.has(p.partido_id))
        const faseCerrada = fase.estado === 'cerrada'

        return (
          <div key={fase.id} className="mt-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                {faseCerrada ? '🔒 Cerrada' : '🟢 Abierta'}
              </span>
              <h2 className="text-lg font-bold text-gray-800">{fase.nombre}</h2>
            </div>
            {!faseCerrada && (
              <p className="text-sm text-gray-500">
                Ingresa el marcador que crees que va a quedar en cada partido antes de que empiece la fase.
              </p>
            )}
            {faseCerrada && (
              <p className="text-sm text-gray-500">
                La fase ya comenzó. Tus predicciones están guardadas.
              </p>
            )}

            <PrediccionesForm
              partidos={partidosFase}
              prediccionesGuardadas={prediccionesFase}
              usuarioId={user.id}
              faseCerrada={faseCerrada}
              faseNombre={fase.nombre}
            />
          </div>
        )
      })}
    </div>
  )
}
