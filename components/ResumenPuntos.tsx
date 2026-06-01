type Props = { total: number }

export default function ResumenPuntos({ total }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <div className="grad-mundial-suave p-4 flex items-center gap-4 relative overflow-hidden">
        {/* Decoración geométrica */}
        <div className="absolute right-0 top-0 bottom-0 w-24 opacity-10">
          <div className="absolute inset-0 bg-white/20 skew-x-[-15deg] translate-x-4" />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#FFD700] flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-2xl">🌟</span>
        </div>

        <div className="relative z-10">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Mis puntos totales</p>
          <p className="text-5xl font-black text-white leading-none">{total}</p>
        </div>

        <div className="ml-auto relative z-10 text-right">
          <p className="text-blue-200 text-xs">pts</p>
          <p className="text-white/60 text-xs font-medium">Mundial 2026</p>
        </div>
      </div>
      <div className="h-1 bg-[#C8102E]" />
    </div>
  )
}
