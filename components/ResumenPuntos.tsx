type Props = { total: number }

export default function ResumenPuntos({ total }: Props) {
  return (
    <div className="bg-green-600 text-white rounded-2xl p-4 flex items-center gap-4 shadow">
      <div className="text-4xl">🌟</div>
      <div>
        <p className="text-green-100 text-sm">Mis puntos totales</p>
        <p className="text-4xl font-black">{total}</p>
      </div>
    </div>
  )
}
