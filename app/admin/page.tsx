import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ count: totalAlumnos }, { count: totalPredicciones }, { data: fases }, { data: partidos }] =
    await Promise.all([
      supabase.from('perfiles').select('*', { count: 'exact', head: true }).eq('rol', 'alumno'),
      supabase.from('predicciones').select('*', { count: 'exact', head: true }),
      supabase.from('fases').select('*').order('orden'),
      supabase.from('partidos').select('id, cerrado, goles_local_real').limit(200),
    ])

  const faseAbierta = fases?.find(f => f.estado === 'abierta')
  const partidosConResultado = partidos?.filter(p => p.goles_local_real !== null).length ?? 0

  const stats = [
    { label: 'Alumnos registrados', valor: totalAlumnos ?? 0, icon: '👥' },
    { label: 'Predicciones guardadas', valor: totalPredicciones ?? 0, icon: '📝' },
    { label: 'Partidos con resultado', valor: partidosConResultado, icon: '✅' },
  ]

  const accesos = [
    { href: '/admin/resultados', label: 'Capturar resultados', desc: 'Ingresa el marcador real de cada partido', icon: '⚽', color: 'bg-green-600' },
    { href: '/admin/fases', label: 'Gestionar fases', desc: 'Abre o cierra fases del torneo', icon: '🔄', color: 'bg-blue-600' },
    { href: '/admin/escuelas', label: 'Gestionar escuelas', desc: 'Agrega escuelas o sube sus logos', icon: '🏫', color: 'bg-purple-600' },
    { href: '/admin/alumnos', label: 'Ver alumnos', desc: 'Lista de todos los alumnos registrados', icon: '👥', color: 'bg-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-800 mb-2">Panel de administrador</h1>
      {faseAbierta && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-6 inline-block">
          🟢 Fase activa: <strong>{faseAbierta.nombre}</strong>
        </p>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-gray-800">{s.valor}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accesos.map(a => (
          <Link
            key={a.href}
            href={a.href}
            className={`${a.color} text-white rounded-2xl p-5 hover:opacity-90 transition-opacity block`}
          >
            <div className="text-3xl mb-2">{a.icon}</div>
            <div className="font-bold text-lg">{a.label}</div>
            <div className="text-sm opacity-80 mt-1">{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Estado de fases */}
      <div className="mt-8">
        <h2 className="text-base font-bold text-gray-700 mb-3">Estado de todas las fases</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left">Fase</th>
                <th className="py-2 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {(fases ?? []).map(f => (
                <tr key={f.id} className="border-t border-gray-100">
                  <td className="py-3 px-4 font-medium">{f.nombre}</td>
                  <td className="py-3 px-4 text-center">
                    {f.estado === 'abierta' && <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded-full">🟢 Abierta</span>}
                    {f.estado === 'cerrada' && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">🔒 Cerrada</span>}
                    {f.estado === 'pendiente' && <span className="bg-yellow-50 text-yellow-600 text-xs px-2 py-1 rounded-full">⏳ Pendiente</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
