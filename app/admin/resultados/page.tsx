import { createClient } from '@/lib/supabase/server'
import ResultadosForm from '@/components/ResultadosForm'

export default async function ResultadosPage() {
  const supabase = await createClient()

  const { data: fases } = await supabase
    .from('fases')
    .select('*')
    .in('estado', ['abierta', 'cerrada'])
    .order('orden')

  const { data: partidos } = await supabase
    .from('partidos')
    .select('*')
    .order('fecha')

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-800 mb-1">Capturar resultados</h1>
      <p className="text-sm text-gray-500 mb-6">
        Cuando un partido termina, ingresa el marcador real aquí. Los puntos se calcularán automáticamente.
      </p>

      <ResultadosForm fases={fases ?? []} partidos={partidos ?? []} />
    </div>
  )
}
