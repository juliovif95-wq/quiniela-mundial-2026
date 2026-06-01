import Image from 'next/image'
import { BANDERAS } from '@/lib/banderas'

type Props = { pais: string; size?: number; className?: string }

export default function Bandera({ pais, size = 24, className = '' }: Props) {
  const codigo = BANDERAS[pais]
  if (!codigo) return <span className="text-gray-400 text-xs">—</span>

  const w = Math.round(size * 1.5)
  const h = size

  return (
    <Image
      src={`https://flagcdn.com/${codigo}.svg`}
      alt={`Bandera de ${pais}`}
      width={w}
      height={h}
      className={`inline-block align-middle ${className}`}
    />
  )
}
