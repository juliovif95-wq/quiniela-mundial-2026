import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavbarAdmin from '@/components/NavbarAdmin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, nombre_completo')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.rol !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarAdmin nombre={perfil.nombre_completo} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
