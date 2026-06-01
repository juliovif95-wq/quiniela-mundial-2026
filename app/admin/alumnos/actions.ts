'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function resetearPassword(
  alumnoId: string,
  nuevaPassword: string
): Promise<{ error?: string; success?: boolean }> {
  if (nuevaPassword.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado.' }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') return { error: 'Sin permisos.' }

  const adminClient = await createAdminClient()
  const { error } = await adminClient.auth.admin.updateUserById(alumnoId, {
    password: nuevaPassword,
  })

  if (error) return { error: 'No se pudo cambiar la contraseña. Intenta de nuevo.' }

  return { success: true }
}
