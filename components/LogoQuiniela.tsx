type Props = { className?: string }

export default function LogoQuiniela({ className }: Props) {
  return (
    <svg
      viewBox="0 0 200 245"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Quiniela Mundial 2026"
    >
      <defs>
        <clipPath id="lq-shield-clip">
          <path d="M100 8 L184 33 L184 150 Q181 220 100 238 Q19 220 16 150 L16 33 Z" />
        </clipPath>
        <clipPath id="lq-ball-clip">
          <circle cx="100" cy="140" r="34" />
        </clipPath>
        <linearGradient id="lq-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001855" />
          <stop offset="100%" stopColor="#003DA5" />
        </linearGradient>
      </defs>

      {/* Sombra del escudo */}
      <path
        d="M100 12 L186 36 L186 152 Q183 224 100 242 Q17 224 14 152 L14 36 Z"
        fill="rgba(0,0,0,0.35)"
        transform="translate(2,3)"
      />

      {/* Cuerpo del escudo — azul */}
      <path
        d="M100 8 L184 33 L184 150 Q181 220 100 238 Q19 220 16 150 L16 33 Z"
        fill="url(#lq-blue-grad)"
      />

      {/* Banda roja superior */}
      <rect x="0" y="0" width="200" height="80" fill="#C8102E" clipPath="url(#lq-shield-clip)" />

      {/* Línea dorada diagonal que separa rojo del azul */}
      <line
        x1="14" y1="80" x2="186" y2="72"
        stroke="#FFD700" strokeWidth="2.2"
        clipPath="url(#lq-shield-clip)"
      />

      {/* Estrella izquierda */}
      <text x="62" y="54" textAnchor="middle" fill="#FFD700" fontSize="18" fontFamily="serif">★</text>
      {/* Estrella central (más grande) */}
      <text x="100" y="60" textAnchor="middle" fill="#FFD700" fontSize="26" fontFamily="serif">★</text>
      {/* Estrella derecha */}
      <text x="138" y="54" textAnchor="middle" fill="#FFD700" fontSize="18" fontFamily="serif">★</text>

      {/* Balón — fondo blanco */}
      <circle cx="100" cy="140" r="34" fill="white" />

      {/* Parches del balón (patrón de fútbol simplificado) */}
      <g clipPath="url(#lq-ball-clip)">
        {/* Pentágono central */}
        <polygon points="100,112 116,121 111,138 89,138 84,121" fill="#002070" />
        {/* Parche arriba */}
        <polygon points="84,108 116,108 116,121 100,112 84,121" fill="#002070" opacity="0.45" />
        {/* Parche izquierdo */}
        <polygon points="66,122 84,121 89,138 80,150 66,142" fill="#002070" />
        {/* Parche derecho */}
        <polygon points="134,122 116,121 111,138 120,150 134,142" fill="#002070" />
        {/* Parche abajo-izquierdo */}
        <polygon points="80,150 89,138 100,144 97,163 82,164" fill="#002070" />
        {/* Parche abajo-derecho */}
        <polygon points="120,150 111,138 100,144 103,163 118,164" fill="#002070" />
      </g>

      {/* Contorno del balón */}
      <circle cx="100" cy="140" r="34" stroke="#002070" strokeWidth="1.5" fill="none" />

      {/* Texto QUINIELA — fuente deportiva */}
      <text
        x="100" y="194"
        textAnchor="middle"
        className="font-display"
        fill="#FFD700"
        fontSize="24"
        fontWeight="700"
        letterSpacing="2"
      >
        QUINIELA
      </text>

      {/* Texto MUNDIAL 2026 */}
      <text
        x="100" y="214"
        textAnchor="middle"
        fill="rgba(255,255,255,0.92)"
        fontSize="10"
        letterSpacing="4"
        fontFamily="Arial, sans-serif"
      >
        MUNDIAL 2026
      </text>

      {/* Banderas / países sede */}
      <text
        x="100" y="230"
        textAnchor="middle"
        fill="rgba(255,255,255,0.45)"
        fontSize="9.5"
        letterSpacing="2"
      >
        🇺🇸  🇨🇦  🇲🇽
      </text>

      {/* Borde dorado del escudo */}
      <path
        d="M100 8 L184 33 L184 150 Q181 220 100 238 Q19 220 16 150 L16 33 Z"
        stroke="#FFD700"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Borde interior sutil */}
      <path
        d="M100 16 L176 39 L176 150 Q173 214 100 230 Q27 214 24 150 L24 39 Z"
        stroke="rgba(255,215,0,0.22)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  )
}
