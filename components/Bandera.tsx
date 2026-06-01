import { BANDERAS } from '@/lib/banderas'

type Props = { pais: string; size?: number; className?: string }

export default function Bandera({ pais, size = 24, className = '' }: Props) {
  const emoji = BANDERAS[pais]
  if (!emoji) return <span className="text-gray-400 text-xs">—</span>

  return (
    <span
      role="img"
      aria-label={`Bandera de ${pais}`}
      className={`inline-block leading-none select-none ${className}`}
      style={{ fontSize: `${Math.round(size * 1.3)}px`, lineHeight: 1 }}
    >
      {emoji}
    </span>
  )
}
