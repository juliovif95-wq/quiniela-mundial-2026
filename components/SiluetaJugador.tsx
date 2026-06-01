import type { CSSProperties } from 'react'

type Props = { className?: string; style?: CSSProperties; pose?: 'celebra' | 'chuta' | 'corre' | 'arquero' | 'salta' | 'cabeceo' }

/* Silhouettes are pure SVG paths - no external images, load instantly */

function Celebra({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 110 240" fill="currentColor" className={className} style={style} aria-hidden>
      {/* Cabeza */}
      <circle cx="55" cy="22" r="16" />
      {/* Cuello */}
      <rect x="49" y="36" width="12" height="8" rx="4" />
      {/* Torso */}
      <path d="M38 44 Q26 58 24 100 Q26 116 55 118 Q84 116 86 100 Q84 58 72 44 Q63 38 55 41 Q47 38 38 44Z" />
      {/* Brazo izquierdo levantado */}
      <path d="M36 56 C26 44 16 28 4 10 C2 6 9 2 12 6 C23 26 36 52 44 68Z" />
      {/* Mano izquierda (puño) */}
      <circle cx="5" cy="9" r="5" />
      {/* Brazo derecho levantado */}
      <path d="M74 56 C84 44 94 28 106 10 C108 6 101 2 98 6 C87 26 74 52 66 68Z" />
      {/* Mano derecha (puño) */}
      <circle cx="105" cy="9" r="5" />
      {/* Pierna izquierda */}
      <path d="M40 112 C36 142 30 172 25 206 C23 215 38 217 41 210 C44 176 48 145 51 116Z" />
      {/* Pie izquierdo */}
      <ellipse cx="24" cy="210" rx="14" ry="6" transform="rotate(-9 24 210)" />
      {/* Pierna derecha */}
      <path d="M70 112 C74 142 80 172 85 206 C87 215 72 217 69 210 C66 176 62 145 59 116Z" />
      {/* Pie derecho */}
      <ellipse cx="86" cy="210" rx="14" ry="6" transform="rotate(9 86 210)" />
    </svg>
  )
}

function Chuta({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 130 250" fill="currentColor" className={className} style={style} aria-hidden>
      {/* Cabeza (ligeramente inclinada) */}
      <circle cx="68" cy="20" r="16" />
      {/* Cuello */}
      <rect x="62" y="34" width="12" height="8" rx="4" />
      {/* Torso (inclinado hacia adelante) */}
      <path d="M50 42 Q38 56 36 94 Q38 110 68 113 Q96 110 98 94 Q96 60 82 44 Q76 37 68 40 Q60 37 50 42Z" />
      {/* Brazo izquierdo extendido hacia atrás */}
      <path d="M54 64 C44 54 28 38 12 24 C9 21 13 15 17 18 C32 34 48 58 60 74Z" />
      {/* Brazo derecho extendido hacia adelante para equilibrio */}
      <path d="M84 60 C92 52 102 46 112 54 C120 60 117 73 110 70 C100 62 92 62 88 72Z" />
      {/* Pierna izquierda de apoyo */}
      <path d="M44 108 C40 136 36 168 32 204 C30 213 44 215 47 208 C50 174 54 142 56 112Z" />
      {/* Pie izquierdo de apoyo */}
      <ellipse cx="31" cy="207" rx="14" ry="6" transform="rotate(-5 31 207)" />
      {/* Pierna derecha — en vuelo/pateando */}
      <path d="M74 110 C86 132 102 162 118 194 C122 202 109 208 105 201 C90 170 78 140 68 114Z" />
      {/* Pie derecho (en el golpe) */}
      <ellipse cx="116" cy="198" rx="15" ry="7" transform="rotate(38 116 198)" />
      {/* Balón al pie */}
      <circle cx="119" cy="222" r="11" />
      <line x1="110" y1="214" x2="128" y2="230" stroke="white" strokeWidth="1.5" />
      <line x1="119" y1="211" x2="119" y2="233" stroke="white" strokeWidth="1.5" />
      <line x1="108" y1="222" x2="130" y2="222" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

function Corre({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 240" fill="currentColor" className={className} style={style} aria-hidden>
      {/* Cabeza */}
      <circle cx="56" cy="20" r="15" />
      {/* Cuello */}
      <rect x="50" y="33" width="11" height="8" rx="4" />
      {/* Torso inclinado hacia adelante */}
      <path d="M40 40 Q30 54 32 92 Q36 108 60 112 Q84 108 86 92 Q86 60 74 42 Q66 36 58 39 Q48 36 40 40Z" />
      {/* Brazo izquierdo hacia atrás */}
      <path d="M42 58 C32 48 18 34 7 18 C5 14 11 10 14 14 C24 32 38 54 46 68Z" />
      {/* Brazo derecho hacia adelante y arriba */}
      <path d="M76 58 C84 48 94 42 103 50 C110 57 106 68 100 65 C90 58 84 59 80 68Z" />
      {/* Pierna izquierda extendida atrás */}
      <path d="M43 106 C35 133 26 164 18 200 C16 208 30 212 34 205 C39 170 44 138 50 110Z" />
      {/* Pie izquierdo (atrás) */}
      <ellipse cx="17" cy="205" rx="14" ry="5.5" transform="rotate(-14 17 205)" />
      {/* Pierna derecha levantada adelante */}
      <path d="M68 108 C76 132 86 160 98 192 C101 200 89 205 85 198 C73 168 64 138 60 112Z" />
      {/* Pie derecho (delante) */}
      <ellipse cx="95" cy="196" rx="14" ry="6" transform="rotate(22 95 196)" />
    </svg>
  )
}

function Arquero({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 240 200" fill="currentColor" className={className} style={style} aria-hidden>
      {/* Cabeza */}
      <circle cx="120" cy="22" r="17" />
      {/* Cuello */}
      <rect x="113" y="37" width="14" height="8" rx="4" />
      {/* Torso ligeramente agachado */}
      <path d="M100 46 Q86 60 88 96 Q92 112 120 115 Q148 112 152 96 Q152 64 138 48 Q130 42 120 44 Q108 42 100 46Z" />
      {/* Brazo izquierdo extendido completamente */}
      <path d="M96 68 C76 60 44 50 12 44 C7 43 6 50 11 52 C42 57 74 66 94 78Z" />
      {/* Mano izquierda */}
      <ellipse cx="8" cy="47" rx="7" ry="5" transform="rotate(-10 8 47)" />
      {/* Brazo derecho extendido */}
      <path d="M144 68 C164 60 196 50 228 44 C233 43 234 50 229 52 C198 57 166 66 146 78Z" />
      {/* Mano derecha */}
      <ellipse cx="232" cy="47" rx="7" ry="5" transform="rotate(10 232 47)" />
      {/* Pierna izquierda */}
      <path d="M102 110 C96 136 88 164 82 186 C80 188 92 188 95 185 C100 164 106 136 110 114Z" />
      {/* Pierna derecha */}
      <path d="M138 110 C144 136 152 164 158 186 C160 188 148 188 145 185 C140 164 134 136 130 114Z" />
    </svg>
  )
}

function Salta({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 130 220" fill="currentColor" className={className} style={style} aria-hidden>
      {/* Cabeza (ligeramente inclinada hacia arriba) */}
      <circle cx="62" cy="22" r="16" />
      {/* Cuello */}
      <rect x="56" y="36" width="12" height="7" rx="4" />
      {/* Torso */}
      <path d="M46 44 Q36 56 36 90 Q38 106 62 108 Q88 106 90 90 Q90 60 78 46 Q70 40 62 42 Q54 40 46 44Z" />
      {/* Brazo izquierdo extendido arriba */}
      <path d="M44 58 C34 46 20 30 6 14 C4 10 10 6 14 10 C26 28 40 54 50 70Z" />
      {/* Mano izquierda */}
      <circle cx="6" cy="13" r="5" />
      {/* Brazo derecho extendido arriba */}
      <path d="M80 58 C90 48 104 32 118 18 C120 14 114 10 110 14 C98 30 84 56 74 72Z" />
      {/* Mano derecha */}
      <circle cx="117" cy="17" r="5" />
      {/* Pierna izquierda doblada hacia adelante */}
      <path d="M44 104 C40 118 36 128 26 136 C20 140 30 150 36 146 C46 138 52 125 56 108Z" />
      {/* Pie izquierdo */}
      <ellipse cx="24" cy="140" rx="12" ry="5" transform="rotate(-25 24 140)" />
      {/* Pierna derecha doblada hacia atrás */}
      <path d="M80 104 C84 118 90 130 100 140 C106 146 114 136 108 130 C98 122 92 116 84 106Z" />
      {/* Pie derecho */}
      <ellipse cx="104" cy="143" rx="12" ry="5" transform="rotate(20 104 143)" />
    </svg>
  )
}

function Cabeceo({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 240" fill="currentColor" className={className} style={style} aria-hidden>
      {/* Cabeza (inclinada hacia adelante en cabeceo) */}
      <circle cx="70" cy="18" r="16" />
      {/* Cuello */}
      <rect x="64" y="32" width="12" height="8" rx="4" />
      {/* Torso inclinado */}
      <path d="M54 40 Q42 54 40 90 Q42 106 68 108 Q94 106 96 92 Q96 62 84 44 Q77 38 68 41 Q60 38 54 40Z" />
      {/* Brazo izquierdo hacia adelante */}
      <path d="M48 62 C36 54 22 44 10 36 C7 34 8 28 12 30 C24 38 40 58 50 74Z" />
      {/* Brazo derecho hacia atrás para equilibrio */}
      <path d="M88 58 C98 50 108 38 118 28 C120 25 115 20 112 23 C102 34 90 56 82 70Z" />
      {/* Pierna derecha de apoyo */}
      <path d="M74 104 C78 134 84 164 90 200 C92 208 78 210 75 203 C70 168 64 136 62 108Z" />
      {/* Pie derecho */}
      <ellipse cx="91" cy="204" rx="14" ry="6" transform="rotate(8 91 204)" />
      {/* Pierna izquierda extendida hacia atrás */}
      <path d="M50 108 C44 136 38 166 34 200 C32 208 46 210 49 204 C53 170 57 138 58 112Z" />
      {/* Pie izquierdo */}
      <ellipse cx="33" cy="204" rx="13" ry="6" transform="rotate(-6 33 204)" />
      {/* Balón arriba */}
      <circle cx="78" cy="4" r="9" />
      <line x1="72" y1="-1" x2="84" y2="9" stroke="white" strokeWidth="1.2" />
      <line x1="78" y1="-5" x2="78" y2="13" stroke="white" strokeWidth="1.2" />
    </svg>
  )
}

export default function SiluetaJugador({ className, style, pose = 'celebra' }: Props) {
  const props = { className, style }
  if (pose === 'chuta')   return <Chuta {...props} />
  if (pose === 'corre')   return <Corre {...props} />
  if (pose === 'arquero') return <Arquero {...props} />
  if (pose === 'salta')   return <Salta {...props} />
  if (pose === 'cabeceo') return <Cabeceo {...props} />
  return <Celebra {...props} />
}
