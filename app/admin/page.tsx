import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const [
    { count: totalAlumnos },
    { count: totalPredicciones },
    { data: fases },
    { data: partidos },
  ] = await Promise.all([
    supabase.from('perfiles').select('*', { count: 'exact', head: true }).eq('rol', 'alumno'),
    supabase.from('predicciones').select('*', { count: 'exact', head: true }),
    supabase.from('fases').select('*').order('orden'),
    supabase.from('partidos').select('id, goles_local_real').limit(200),
  ])

  const faseAbierta = fases?.find(f => f.estado === 'abierta')
  const partidosConResultado = partidos?.filter(p => p.goles_local_real !== null).length ?? 0

  const stats = [
    { label: 'Alumnos', valor: totalAlumnos ?? 0, icon: '👥', color: 'bg-[#003DA5]' },
    { label: 'Predicciones', valor: totalPredicciones ?? 0, icon: '📝', color: 'bg-[#C8102E]' },
    { label: 'Resultados', valor: partidosConResultado, icon: '✅', color: 'bg-green-600' },
  ]

  const accesos = [
    { href: '/admin/resultados', label: 'Capturar resultados', desc: 'Ingresa el marcador real de cada partido', icon: '⚽', color: 'from-[#003DA5] to-[#0050CC]' },
    { href: '/admin/fases', label: 'Gestionar fases', desc: 'Abre o cierra fases del torneo', icon: '🔄', color: 'from-[#1e3a5f] to-[#003DA5]' },
    { href: '/admin/escuelas', label: 'Gestionar escuelas', desc: 'Agrega escuelas y sube logos', icon: '🏫', color: 'from-[#4a1942] to-[#6B21A8]' },
    { href: '/admin/alumnos', label: 'Ver alumnos', desc: 'Lista de todos los alumnos', icon: '👥', color: 'from-[#1a3a2a] to-[#166534]' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-wide">Panel Admin</h1>
        {faseAbierta && (
          <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1.5 rounded-full border border-green-200">
            🟢 {faseAbierta.nombre}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-6">Quiniela Mundial 2026 — Vista general</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`${s.color} text-white rounded-2xl p-4 shadow-md hover-lift`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-black">{s.valor}</div>
            <div className="text-xs font-bold opacity-80 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {accesos.map(a => (
          <Link
            key={a.href}
            href={a.href}
            className={`bg-gradient-to-br ${a.color} text-white rounded-2xl p-5 hover-lift block shadow-lg`}
          >
            <div className="text-3xl mb-2">{a.icon}</div>
            <div className="font-black text-base uppercase tracking-wide">{a.label}</div>
            <div className="text-sm opacity-70 mt-1">{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Estado de fases */}
      <div>
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3">Estado del torneo</h2>
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          {(fases ?? []).map((f, i) => (
            <div key={f.id} className={`flex items-center justify-between px-5 py-3.5 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm font-bold w-5">{f.orden}</span>
                <span className="font-bold text-gray-700">{f.nombre}</span>
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${
                f.estado === 'abierta' ? 'bg-green-100 text-green-700' :
                f.estado === 'cerrada' ? 'bg-gray-100 text-gray-500' :
                'bg-yellow-50 text-yellow-600'
              }`}>
                {f.estado === 'abierta' ? '🟢 Abierta' : f.estado === 'cerrada' ? '🔒 Cerrada' : '⏳ Pendiente'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
