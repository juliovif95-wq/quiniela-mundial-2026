import Image from 'next/image'

// ISO 3166-1 alpha-2 codes — usados con flagcdn.com (funciona en PC, Mac, iOS, Android)
const ISO: Record<string, string> = {
  'México': 'mx', 'Sudáfrica': 'za', 'Corea del Sur': 'kr', 'República Checa': 'cz',
  'Canadá': 'ca', 'Bosnia y Herzegovina': 'ba', 'Catar': 'qa', 'Suiza': 'ch',
  'Brasil': 'br', 'Marruecos': 'ma', 'Haití': 'ht', 'Escocia': 'gb-sct',
  'Estados Unidos': 'us', 'Paraguay': 'py', 'Australia': 'au', 'Turquía': 'tr',
  'Alemania': 'de', 'Curazao': 'cw', 'Costa de Marfil': 'ci', 'Ecuador': 'ec',
  'Países Bajos': 'nl', 'Japón': 'jp', 'Suecia': 'se', 'Túnez': 'tn',
  'Bélgica': 'be', 'Egipto': 'eg', 'Irán': 'ir', 'Nueva Zelanda': 'nz',
  'España': 'es', 'Cabo Verde': 'cv', 'Arabia Saudita': 'sa', 'Uruguay': 'uy',
  'Francia': 'fr', 'Senegal': 'sn', 'Irak': 'iq', 'Noruega': 'no',
  'Argentina': 'ar', 'Argelia': 'dz', 'Austria': 'at', 'Jordania': 'jo',
  'Portugal': 'pt', 'Congo RD': 'cd', 'Uzbekistán': 'uz', 'Colombia': 'co',
  'Inglaterra': 'gb-eng', 'Croacia': 'hr', 'Ghana': 'gh', 'Panamá': 'pa',
}

type Props = { pais: string; size?: number; className?: string }

export default function Bandera({ pais, size = 24, className = '' }: Props) {
  const code = ISO[pais]
  if (!code) return <span className="text-gray-400 text-xs">—</span>

  return (
    <Image
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={`Bandera de ${pais}`}
      width={Math.round(size * 1.5)}
      height={size}
      className={`inline-block rounded-sm shadow-sm object-cover ${className}`}
      style={{ width: Math.round(size * 1.5), height: size }}
    />
  )
}
