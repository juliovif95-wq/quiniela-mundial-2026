import { createClient } from '@/lib/supabase/server'
import ResetearPasswordModal from '@/components/ResetearPasswordModal'

export default async function AlumnosPage() {
  const supabase = await createClient()

  const { data: alumnos } = await supabase
    .from('perfiles')
    .select('id, nombre_completo, grado, usuario, celular, created_at, escuelas(nombre)')
    .eq('rol', 'alumno')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-800 mb-1">Alumnos registrados</h1>
      <p className="text-sm text-gray-500 mb-6">
        Total: <strong>{alumnos?.length ?? 0}</strong> alumnos
      </p>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Usuario</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Grado</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Escuela</th>
                <th className="py-3 px-4 text-left hidden lg:table-cell">Celular</th>
                <th className="py-3 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(alumnos ?? []).map((a, i) => (
                <tr key={a.id} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-3 px-4 font-medium text-gray-800">{a.nombre_completo}</td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-xs">{a.usuario}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{a.grado}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                    {(a.escuelas as unknown as { nombre: string } | null)?.nombre ?? '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden lg:table-cell">{a.celular}</td>
                  <td className="py-3 px-4">
                    <ResetearPasswordModal alumnoId={a.id} nombreAlumno={a.nombre_completo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(alumnos ?? []).length === 0 && (
            <p className="text-center text-gray-400 py-12">No hay alumnos registrados aún.</p>
          )}
        </div>
      </div>
    </div>
  )
}
