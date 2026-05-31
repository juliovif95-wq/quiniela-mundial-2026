import { createClient } from '@/lib/supabase/server'
import FasesForm from '@/components/FasesForm'

export default async function FasesPage() {
  const supabase = await createClient()
  const { data: fases } = await supabase.from('fases').select('*').order('orden')

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-800 mb-1">Gestionar fases</h1>
      <p className="text-sm text-gray-500 mb-6">
        Solo puede haber <strong>una fase abierta a la vez</strong>. Cuando abres una nueva fase, los alumnos pueden ingresar predicciones para esa fase.
      </p>
      <FasesForm fases={fases ?? []} />
    </div>
  )
}
