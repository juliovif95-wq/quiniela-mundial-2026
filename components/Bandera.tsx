import { BANDERAS } from '@/lib/banderas'

type Props = { pais: string; size?: number; className?: string }

export default function Bandera({ pais, size = 24, className = '' }: Props) {
  const codigo = BANDERAS[pais]
  if (!codigo) return <span className="text-gray-400 text-xs">—</span>

  return (
    <img
      src={`https://flagcdn.com/${codigo}.svg`}
      alt={`Bandera de ${pais}`}
      width={Math.round(size * 1.5)}
      height={size}
      className={`inline-block align-middle ${className}`}
      style={{ objectFit: 'cover' }}
    />
  )
}
