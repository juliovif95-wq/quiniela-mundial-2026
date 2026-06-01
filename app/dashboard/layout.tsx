import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavbarAlumno from '@/components/NavbarAlumno'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre_completo, rol, escuelas(nombre, logo_url)')
    .eq('id', user.id)
    .single()

  if (!perfil) redirect('/auth/login')
  if (perfil.rol === 'admin') redirect('/admin')

  const escuelaData = perfil.escuelas as unknown as { nombre: string; logo_url: string | null } | null

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarAlumno
        nombre={perfil.nombre_completo}
        escuela={escuelaData?.nombre ?? ''}
        logoUrl={escuelaData?.logo_url ?? null}
      />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
