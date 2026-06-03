const FECHAS_LIMITE = [
  { fecha: new Date('2026-06-10T07:00:00Z'), etiqueta: 'Antes del 10 jun', fase: 'Fase de Grupos' },
  { fecha: new Date('2026-06-28T07:00:00Z'), etiqueta: '27 jun', fase: 'Ronda de 16avos' },
  { fecha: new Date('2026-07-04T07:00:00Z'), etiqueta: '3 jul', fase: 'Octavos de final' },
  { fecha: new Date('2026-07-09T07:00:00Z'), etiqueta: '8 jul', fase: 'Cuartos de final' },
  { fecha: new Date('2026-07-13T07:00:00Z'), etiqueta: '12 jul', fase: 'Semifinales' },
  { fecha: new Date('2026-07-18T07:00:00Z'), etiqueta: '17 jul', fase: 'Final' },
]

export default function BannerFechasLimite() {
  const ahora = new Date()
  const proximaIndex = FECHAS_LIMITE.findIndex((f) => f.fecha > ahora)

  // Si ya pasaron todas las fechas, no mostrar nada
  if (proximaIndex === -1) return null

  return (
    <div className="mt-4 mb-2 rounded-xl border border-slate-600 bg-slate-800/70 overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <span className="text-base">📅</span>
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Fechas límite para registrar predicciones
        </p>
      </div>

      <ul className="pb-3 px-2">
        {FECHAS_LIMITE.map((item, i) => {
          const pasada = i < proximaIndex
          const proxima = i === proximaIndex

          if (proxima) {
            return (
              <li
                key={i}
                className="flex items-center gap-3 mx-2 mb-1 px-3 py-2 rounded-lg bg-amber-400/15 border-l-4 border-amber-400"
              >
                <span className="text-amber-400 text-sm font-bold shrink-0">→</span>
                <span className="text-amber-300 text-sm font-bold w-24 shrink-0">{item.etiqueta}</span>
                <span className="text-white text-sm font-semibold">{item.fase}</span>
                <span className="ml-auto text-amber-400 text-xs font-bold uppercase tracking-wide">Próxima</span>
              </li>
            )
          }

          if (pasada) {
            return (
              <li key={i} className="flex items-center gap-3 px-5 py-1">
                <span className="text-slate-600 text-xs shrink-0">✓</span>
                <span className="text-slate-600 text-sm line-through w-24 shrink-0">{item.etiqueta}</span>
                <span className="text-slate-600 text-sm line-through">{item.fase}</span>
              </li>
            )
          }

          return (
            <li key={i} className="flex items-center gap-3 px-5 py-1">
              <span className="text-slate-500 text-xs shrink-0">·</span>
              <span className="text-slate-400 text-sm w-24 shrink-0">{item.etiqueta}</span>
              <span className="text-slate-400 text-sm">{item.fase}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
