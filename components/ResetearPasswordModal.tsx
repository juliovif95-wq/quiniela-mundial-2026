'use client'

import { useState } from 'react'
import { resetearPassword } from '@/app/admin/alumnos/actions'

interface Props {
  alumnoId: string
  nombreAlumno: string
}

export default function ResetearPasswordModal({ alumnoId, nombreAlumno }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null)

  function abrir() {
    setAbierto(true)
    setPassword('')
    setConfirmar('')
    setResultado(null)
  }

  function cerrar() {
    setAbierto(false)
    setPassword('')
    setConfirmar('')
    setResultado(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmar) {
      setResultado({ ok: false, mensaje: 'Las contraseñas no coinciden.' })
      return
    }
    setCargando(true)
    setResultado(null)
    const res = await resetearPassword(alumnoId, password)
    setCargando(false)
    if (res.error) {
      setResultado({ ok: false, mensaje: res.error })
    } else {
      setResultado({ ok: true, mensaje: '¡Contraseña cambiada con éxito!' })
      setTimeout(() => cerrar(), 1500)
    }
  }

  return (
    <>
      <button
        onClick={abrir}
        className="text-xs font-bold text-[#003DA5] hover:text-[#C8102E] transition-colors underline whitespace-nowrap"
      >
        Resetear contraseña
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={e => { if (e.target === e.currentTarget) cerrar() }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-black text-gray-800 mb-1">Resetear contraseña</h3>
            <p className="text-sm text-gray-500 mb-5">
              Alumno: <strong className="text-gray-700">{nombreAlumno}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  autoFocus
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#003DA5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#003DA5]"
                />
              </div>

              {resultado && (
                <div
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium border-l-4 ${
                    resultado.ok
                      ? 'bg-green-50 text-green-700 border-green-500'
                      : 'bg-red-50 text-red-700 border-[#C8102E]'
                  }`}
                >
                  {resultado.mensaje}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={cerrar}
                  className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 py-2.5 rounded-xl bg-[#003DA5] text-white text-sm font-black uppercase tracking-wide hover:bg-[#002070] transition-colors disabled:opacity-50"
                >
                  {cargando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
