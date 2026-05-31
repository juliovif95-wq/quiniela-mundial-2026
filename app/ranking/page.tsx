import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavbarAlumno from '@/components/NavbarAlumno'

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

  const miPosicion = ranking?.find(r => r.usuario_id === user.id)
  const escuela = (perfil.escuelas as unknown as { nombre: string; logo_url: string | null } | null)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAlumno
        nombre={perfil.nombre_completo}
        escuela={escuela?.nombre ?? ''}
      />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Mi posición */}
        {miPosicion && (
          <div className="bg-green-600 text-white rounded-2xl p-4 mb-6 shadow flex items-center gap-4">
            <div className="text-5xl font-black">#{miPosicion.posicion}</div>
            <div>
              <p className="text-green-100 text-sm">Mi posición en</p>
              <p className="font-bold">{escuela?.nombre}</p>
              <p className="text-2xl font-black">{miPosicion.puntos_totales} pts</p>
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-800 mb-3">
          🏆 Tabla de posiciones — {escuela?.nombre}
        </h2>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {(ranking ?? []).length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aún no hay puntos registrados.
            </p>
          ) : (
            <table className="w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-bold">#</th>
                  <th className="py-3 px-4 text-left text-sm font-bold">Alumno</th>
                  <th className="py-3 px-4 text-left text-sm font-bold hidden sm:table-cell">Grado</th>
                  <th className="py-3 px-4 text-right text-sm font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {(ranking ?? []).map((r, i) => {
                  const esYo = r.usuario_id === user.id
                  const medalias: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }
                  return (
                    <tr
                      key={r.usuario_id}
                      className={`border-t border-gray-100 ${esYo ? 'bg-green-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="py-3 px-4 font-bold text-gray-600">
                        {medalias[r.posicion] ?? r.posicion}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium text-sm ${esYo ? 'text-green-700 font-bold' : 'text-gray-800'}`}>
                          {r.nombre_completo}
                          {esYo && <span className="ml-1 text-xs text-green-600">(yo)</span>}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 hidden sm:table-cell">
                        {r.grado}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-green-700">
                        {r.puntos_totales}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
