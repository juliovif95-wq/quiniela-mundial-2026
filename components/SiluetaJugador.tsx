type Props = { className?: string; pose?: 'celebra' | 'chuta' | 'corre' | 'arquero' }

/* Silhouettes are pure SVG paths - no external images, load instantly */

function Celebra({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 230" fill="currentColor" className={className} aria-hidden>
      <circle cx="50" cy="21" r="15" />
      <path d="M35 38 Q25 52 22 93 Q25 106 50 109 Q75 106 78 93 Q75 52 65 38 Q55 33 50 36 Q45 33 35 38Z" />
      <path d="M37 54 C30 44 18 28 7 10 C5 6 11 3 14 7 C23 25 34 50 43 63Z" />
      <path d="M63 54 C70 44 82 28 93 10 C95 6 89 3 86 7 C77 25 66 50 57 63Z" />
      <path d="M38 104 C34 132 29 162 25 196 C23 204 36 206 39 199 C41 166 45 135 48 108Z" />
      <ellipse cx="25" cy="200" rx="13" ry="6" transform="rotate(-8 25 200)" />
      <path d="M62 104 C66 132 71 162 75 196 C77 204 64 206 61 199 C59 166 55 135 52 108Z" />
      <ellipse cx="75" cy="200" rx="13" ry="6" transform="rotate(8 75 200)" />
    </svg>
  )
}

function Chuta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 240" fill="currentColor" className={className} aria-hidden>
      <circle cx="65" cy="20" r="16" />
      <path d="M48 36 Q36 50 34 90 Q36 105 65 108 Q90 105 92 88 Q88 55 76 38 Q70 32 65 35 Q57 32 48 36Z" />
      <path d="M54 60 C45 50 30 35 15 22 C12 19 16 14 20 17 C32 30 47 55 57 70Z" />
      <path d="M76 60 C82 52 90 45 100 52 C108 58 105 70 98 68 C90 60 82 60 78 68Z" />
      <path d="M42 102 C38 130 34 162 30 196 C28 204 41 206 44 200 C46 168 50 136 53 108Z" />
      <ellipse cx="29" cy="202" rx="14" ry="6" transform="rotate(-6 29 202)" />
      <path d="M68 105 C78 125 92 155 105 185 C108 193 96 198 92 192 C80 163 70 132 63 108Z" />
      <ellipse cx="102" cy="190" rx="14" ry="7" transform="rotate(35 102 190)" />
    </svg>
  )
}

function Corre({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 230" fill="currentColor" className={className} aria-hidden>
      <circle cx="52" cy="20" r="15" />
      <path d="M36 36 Q28 50 30 88 Q35 105 58 108 Q80 105 82 88 Q82 58 72 38 Q64 32 55 35 Q44 33 36 36Z" />
      <path d="M38 55 C28 45 14 32 5 15 C3 11 9 7 13 11 C22 28 35 50 44 65Z" />
      <path d="M72 55 C78 46 88 40 96 48 C102 55 98 66 92 62 C84 55 78 56 74 64Z" />
      <path d="M40 103 C32 130 24 162 18 196 C16 204 28 207 32 200 C36 167 42 135 48 108Z" />
      <ellipse cx="17" cy="201" rx="13" ry="6" transform="rotate(-12 17 201)" />
      <path d="M65 105 C72 128 80 158 92 188 C95 196 83 200 79 194 C68 165 60 134 57 108Z" />
      <ellipse cx="89" cy="192" rx="14" ry="6" transform="rotate(20 89 192)" />
    </svg>
  )
}

function Arquero({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 180" fill="currentColor" className={className} aria-hidden>
      <circle cx="110" cy="22" r="16" />
      <path d="M92 38 Q80 52 82 90 Q86 105 110 108 Q134 105 138 90 Q138 58 126 40 Q118 33 110 36 Q100 33 92 38Z" />
      <path d="M88 62 C70 55 40 45 10 40 C5 39 4 46 9 48 C38 52 68 60 86 72Z" />
      <path d="M132 62 C150 55 180 45 210 40 C215 39 216 46 211 48 C182 52 152 60 134 72Z" />
      <path d="M94 103 C88 128 82 158 76 178 C74 180 85 180 88 177 C92 158 97 128 100 108Z" />
      <path d="M126 103 C132 128 138 158 144 178 C146 180 135 180 132 177 C128 158 123 128 120 108Z" />
    </svg>
  )
}

export default function SiluetaJugador({ className, pose = 'celebra' }: Props) {
  if (pose === 'chuta') return <Chuta className={className} />
  if (pose === 'corre') return <Corre className={className} />
  if (pose === 'arquero') return <Arquero className={className} />
  return <Celebra className={className} />
}
