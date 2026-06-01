'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SiluetaJugador from '@/components/SiluetaJugador'

export default function LoginPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    const supabase = createClient()
    const email = `${usuario.toLowerCase().trim()}@quiniela.local`
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Usuario o contraseña incorrectos. Intenta de nuevo.')
      setCargando(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: '#03071A' }}>

      {/* ── Fondo: efecto estadio nocturno ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(0,80,200,0.35) 0%, transparent 65%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 80% 110%, rgba(180,0,30,0.18) 0%, transparent 60%)',
      }} />
      {/* Líneas de luz del estadio */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute top-0 origin-top opacity-[0.04]" style={{
            left: `${10 + i * 16}%`,
            width: '2px',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)',
            transform: `rotate(${-8 + i * 3}deg)`,
          }} />
        ))}
      </div>
      {/* Patrón hexagonal tenue */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 52px',
      }} />

      {/* ── Silueta grande — DERECHA ── */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none hidden lg:block">
        <SiluetaJugador
          pose="celebra"
          className="h-[90vh] max-h-[780px]"
          style={{ color: '#1a3a7a', filter: 'drop-shadow(0 0 60px rgba(0,80,200,0.25))' }}
        />
      </div>
      {/* Halo detrás de la silueta */}
      <div className="absolute right-0 bottom-0 w-[45vw] h-[85vh] pointer-events-none hidden lg:block" style={{
        background: 'radial-gradient(ellipse 70% 80% at 80% 90%, rgba(0,60,165,0.15) 0%, transparent 70%)',
      }} />

      {/* ── Silueta pequeña — móvil ── */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none lg:hidden opacity-10">
        <SiluetaJugador pose="celebra" className="h-[55vh]" style={{ color: '#2255cc' }} />
      </div>

      {/* ══════════════════════════════════════════
          PORTERÍAS + BALONES ANIMADOS
      ══════════════════════════════════════════ */}

      {/* — Portería 1: esquina superior izquierda — */}
      <svg viewBox="0 0 120 80" className="porteria-gol-1 absolute top-[4%] left-[2%] w-28 h-auto opacity-20" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
        <line x1="10" y1="75" x2="10" y2="5"/>
        <line x1="10" y1="5"  x2="110" y2="5"/>
        <line x1="110" y1="5" x2="110" y2="75"/>
        <line x1="10" y1="75" x2="110" y2="75" strokeOpacity="0.3"/>
        {/* Red */}
        {[20,30,40,50,60,70,80,90,100].map(x => (
          <line key={x} x1={x} y1="5" x2={x} y2="75" strokeWidth="1" strokeOpacity="0.25"/>
        ))}
        {[15,25,35,45,55,65].map(y => (
          <line key={y} x1="10" y1={y} x2="110" y2={y} strokeWidth="1" strokeOpacity="0.25"/>
        ))}
      </svg>

      {/* Balón 1 — sale desde abajo-derecha de la portería 1, entra en la red */}
      <div className="absolute pointer-events-none" style={{ top: '52%', left: '4%' }}>
        <svg viewBox="0 0 28 28" className="balon-tiro-1 w-7 h-7 opacity-70" fill="white">
          <circle cx="14" cy="14" r="12" fill="none" stroke="white" strokeWidth="1.5"/>
          <polygon points="14,3 18,9 10,9"   fill="white"/>
          <polygon points="23,7 18,9 23,15"  fill="white"/>
          <polygon points="23,15 18,19 14,25" fill="white"/>
          <polygon points="14,25 10,19 5,15"  fill="white"/>
          <polygon points="5,15 5,7 10,9"    fill="white"/>
        </svg>
      </div>

      {/* — Portería 2: esquina superior derecha — */}
      <svg viewBox="0 0 120 80" className="porteria-gol-2 absolute top-[4%] right-[2%] w-28 h-auto opacity-20" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
        <line x1="10" y1="75" x2="10" y2="5"/>
        <line x1="10" y1="5"  x2="110" y2="5"/>
        <line x1="110" y1="5" x2="110" y2="75"/>
        <line x1="10" y1="75" x2="110" y2="75" strokeOpacity="0.3"/>
        {[20,30,40,50,60,70,80,90,100].map(x => (
          <line key={x} x1={x} y1="5" x2={x} y2="75" strokeWidth="1" strokeOpacity="0.25"/>
        ))}
        {[15,25,35,45,55,65].map(y => (
          <line key={y} x1="10" y1={y} x2="110" y2={y} strokeWidth="1" strokeOpacity="0.25"/>
        ))}
      </svg>

      {/* Balón 2 — viene de la izquierda hacia portería 2 */}
      <div className="absolute pointer-events-none" style={{ top: '48%', right: '4%' }}>
        <svg viewBox="0 0 28 28" className="balon-tiro-2 w-8 h-8 opacity-65" fill="white">
          <circle cx="14" cy="14" r="12" fill="none" stroke="white" strokeWidth="1.5"/>
          <polygon points="14,3 18,9 10,9"   fill="white"/>
          <polygon points="23,7 18,9 23,15"  fill="white"/>
          <polygon points="23,15 18,19 14,25" fill="white"/>
          <polygon points="14,25 10,19 5,15"  fill="white"/>
          <polygon points="5,15 5,7 10,9"    fill="white"/>
        </svg>
      </div>

      {/* — Portería 3: abajo izquierda — */}
      <svg viewBox="0 0 100 66" className="porteria-gol-3 absolute bottom-[6%] left-[5%] w-24 h-auto opacity-15" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
        <line x1="8"  y1="62" x2="8"  y2="4"/>
        <line x1="8"  y1="4"  x2="92" y2="4"/>
        <line x1="92" y1="4"  x2="92" y2="62"/>
        <line x1="8"  y1="62" x2="92" y2="62" strokeOpacity="0.3"/>
        {[18,28,38,48,58,68,78].map(x => (
          <line key={x} x1={x} y1="4" x2={x} y2="62" strokeWidth="1" strokeOpacity="0.2"/>
        ))}
        {[14,24,34,44,54].map(y => (
          <line key={y} x1="8" y1={y} x2="92" y2={y} strokeWidth="1" strokeOpacity="0.2"/>
        ))}
      </svg>

      {/* Balón 3 — tiro desde abajo-derecha hacia portería 3 */}
      <div className="absolute pointer-events-none" style={{ bottom: '22%', left: '7%' }}>
        <svg viewBox="0 0 24 24" className="balon-tiro-3 w-6 h-6 opacity-60" fill="white">
          <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="1.5"/>
          <polygon points="12,3 15,8 9,8"   fill="white"/>
          <polygon points="19,6 15,8 19,13" fill="white"/>
          <polygon points="19,13 15,16 12,21" fill="white"/>
          <polygon points="12,21 9,16 5,13"  fill="white"/>
          <polygon points="5,13 5,6 9,8"    fill="white"/>
        </svg>
      </div>

      {/* Balón 4 — rebote curvo, zona central */}
      <div className="absolute pointer-events-none" style={{ bottom: '30%', left: '38%' }}>
        <svg viewBox="0 0 22 22" className="balon-tiro-4 w-5 h-5 opacity-50" fill="white">
          <circle cx="11" cy="11" r="9" fill="none" stroke="white" strokeWidth="1.5"/>
          <polygon points="11,2 14,7 8,7"    fill="white"/>
          <polygon points="18,5 14,7 18,12"  fill="white"/>
          <polygon points="18,12 14,15 11,20" fill="white"/>
          <polygon points="11,20 8,15 4,12"   fill="white"/>
          <polygon points="4,12 4,5 8,7"      fill="white"/>
        </svg>
      </div>

      {/* ── Trofeos decorativos estáticos ── */}
      <svg viewBox="0 0 32 32" className="absolute top-[3%] left-[28%] w-7 h-7 opacity-25 animate-pulse-soft" fill="#FFD700" style={{ animationDelay: '1.1s' }}>
        <path d="M10 2h12v2H10zM8 4h16v8c0 4.4-3.6 8-8 8s-8-3.6-8-8V4z"/>
        <path d="M4 6H8v6c0 1.1.2 2.1.5 3H4a2 2 0 01-2-2V8a2 2 0 012-2zM28 6h-4v6c0 1.1-.2 2.1-.5 3H28a2 2 0 002-2V8a2 2 0 00-2-2z" opacity="0.7"/>
        <rect x="13" y="20" width="6" height="5" rx="1"/><rect x="9" y="25" width="14" height="3" rx="1.5"/>
      </svg>
      <svg viewBox="0 0 32 32" className="absolute top-[30%] right-[26%] w-8 h-8 opacity-12 animate-pulse-soft" fill="#FFD700" style={{ animationDelay: '1.8s' }}>
        <path d="M10 2h12v2H10zM8 4h16v8c0 4.4-3.6 8-8 8s-8-3.6-8-8V4z"/>
        <path d="M4 6H8v6c0 1.1.2 2.1.5 3H4a2 2 0 01-2-2V8a2 2 0 012-2zM28 6h-4v6c0 1.1-.2 2.1-.5 3H28a2 2 0 002-2V8a2 2 0 00-2-2z" opacity="0.7"/>
        <rect x="13" y="20" width="6" height="5" rx="1"/><rect x="9" y="25" width="14" height="3" rx="1.5"/>
      </svg>
      <svg viewBox="0 0 32 32" className="absolute bottom-[20%] right-[10%] w-8 h-8 opacity-12 animate-pulse-soft" fill="#FFD700" style={{ animationDelay: '0.5s' }}>
        <path d="M10 2h12v2H10zM8 4h16v8c0 4.4-3.6 8-8 8s-8-3.6-8-8V4z"/>
        <path d="M4 6H8v6c0 1.1.2 2.1.5 3H4a2 2 0 01-2-2V8a2 2 0 012-2zM28 6h-4v6c0 1.1-.2 2.1-.5 3H28a2 2 0 002-2V8a2 2 0 00-2-2z" opacity="0.7"/>
        <rect x="13" y="20" width="6" height="5" rx="1"/><rect x="9" y="25" width="14" height="3" rx="1.5"/>
      </svg>

      {/* ── Estrellas ── */}
      <div className="absolute top-[8%] right-[38%] text-[#FFD700] text-2xl opacity-20 animate-pulse-soft" style={{ animationDelay: '0.9s' }}>★</div>
      <div className="absolute top-[5%] right-[18%] text-[#FFD700] text-sm opacity-20 animate-pulse-soft" style={{ animationDelay: '1.6s' }}>★</div>
      <div className="absolute bottom-[12%] right-[32%] text-[#FFD700] text-base opacity-15 animate-pulse-soft" style={{ animationDelay: '2s' }}>★</div>

      {/* ── Banda superior dorada ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{
        background: 'linear-gradient(90deg, transparent, #FFD700 20%, #FFF5A0 50%, #FFD700 80%, transparent)',
      }} />

      {/* ── Contenido principal ── */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto px-5 py-8 lg:ml-[8vw] lg:mr-auto animate-fade-in-up">

        {/* Emblema / título */}
        <div className="text-center mb-8">
          {/* Trofeo decorativo */}
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#FFD700]/40" style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.15), rgba(0,40,120,0.3))',
              boxShadow: '0 0 30px rgba(255,215,0,0.15)',
            }}>
              {/* Trofeo SVG */}
              <svg viewBox="0 0 32 32" className="w-7 h-7" fill="#FFD700">
                <path d="M10 2h12v2H10zM8 4h16v8c0 4.4-3.6 8-8 8s-8-3.6-8-8V4z" opacity="0.9"/>
                <path d="M4 6H8v6c0 1.1.2 2.1.5 3H4a2 2 0 01-2-2V8a2 2 0 012-2zM28 6h-4v6c0 1.1-.2 2.1-.5 3H28a2 2 0 002-2V8a2 2 0 00-2-2z" opacity="0.7"/>
                <rect x="13" y="20" width="6" height="5" rx="1" opacity="0.9"/>
                <rect x="9" y="25" width="14" height="3" rx="1.5" opacity="0.9"/>
              </svg>
            </div>
          </div>
          <p className="text-[#FFD700] text-xs font-bold tracking-[0.35em] uppercase mb-2 opacity-80">
            ⚽ FIFA World Cup 2026 ⚽
          </p>
          <h1 className="font-display text-white uppercase leading-none" style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            textShadow: '0 0 40px rgba(0,100,255,0.4), 0 2px 0 rgba(0,0,0,0.5)',
          }}>
            Mi Escuela Juega
          </h1>
          <h1 className="font-display uppercase leading-none" style={{
            fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)',
            fontWeight: 900,
            letterSpacing: '0.06em',
            background: 'linear-gradient(90deg, #FFD700, #FFF5A0, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.5))',
          }}>
            El Mundial 2026
          </h1>
        </div>

        {/* ── Tarjeta del formulario ── */}
        <div className="rounded-2xl overflow-hidden" style={{
          background: 'rgba(5, 15, 45, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          {/* Barra roja superior */}
          <div className="h-[3px]" style={{
            background: 'linear-gradient(90deg, transparent, #C8102E 20%, #FF2040 50%, #C8102E 80%, transparent)',
          }} />

          <div className="p-7 space-y-5">
            <div>
              <p className="text-white/50 text-xs text-center tracking-widest uppercase mb-5">
                Ingresa tus datos para participar
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Campo Usuario */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#7A9EE0' }}>
                    Usuario
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={usuario}
                      onChange={e => setUsuario(e.target.value)}
                      placeholder="Tu nombre de usuario"
                      required
                      className="input-login-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-white/25 outline-none"
                    />
                  </div>
                </div>

                {/* Campo Contraseña */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#7A9EE0' }}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="input-login-dark w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-white/25 outline-none"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2" style={{
                    background: 'rgba(200,16,46,0.12)',
                    border: '1px solid rgba(200,16,46,0.4)',
                    color: '#FF6B7A',
                  }}>
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Botón principal */}
                <button
                  type="submit"
                  disabled={cargando}
                  className="btn-entrar-juego w-full font-display font-black uppercase tracking-widest text-white py-4 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando
                    ? <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Entrando...
                      </span>
                    : '⚽ Entrar al Juego'
                  }
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <span className="text-white/20 text-xs">•</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Registro */}
            <p className="text-center text-white/40 text-sm">
              ¿Aún no tienes cuenta?{' '}
              <Link
                href="/auth/registro"
                className="font-bold transition-colors"
                style={{ color: '#4A90D9' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FFD700')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4A90D9')}
              >
                Regístrate gratis →
              </Link>
            </p>
          </div>
        </div>

        {/* ── Cuadro WhatsApp ── */}
        <a
          href="https://wa.me/526673183438?text=Hola%2C%20olvidé%20mi%20contraseña%20de%20la%20Quiniela%20Mundial%202026"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group"
          style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(37,211,102,0.15)',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.35)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(37,211,102,0.15)')}
        >
          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(37,211,102,0.12)' }}>
            <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span style={{ color: '#25D366' }} className="font-semibold">¿Olvidaste tu contraseña?</span>
            {' '}Escríbenos por WhatsApp y te ayudamos.
          </p>
          <svg className="w-3.5 h-3.5 shrink-0 ml-auto opacity-30 group-hover:opacity-60 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="#25D366" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </a>

      </div>

      {/* ── Banda inferior dorada ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{
        background: 'linear-gradient(90deg, transparent, #FFD700 20%, #FFF5A0 50%, #FFD700 80%, transparent)',
      }} />
    </div>
  )
}
