import { createClient } from '@/lib/supabase/server'
import EscuelasForm from '@/components/EscuelasForm'

export default async function EscuelasPage() {
  const supabase = await createClient()
  const { data: escuelas } = await supabase
    .from('escuelas')
    .select('id, nombre, logo_url')
    .order('nombre')

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-800 mb-1">Gestionar escuelas</h1>
      <p className="text-sm text-gray-500 mb-6">
        Agrega las escuelas participantes y sube su logo.
      </p>
      <EscuelasForm escuelas={escuelas ?? []} />
    </div>
  )
}
