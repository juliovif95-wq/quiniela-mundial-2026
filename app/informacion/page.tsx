export default function InformacionPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{background: "linear-gradient(135deg, #0D2D6B 0%, #0a1e4a 50%, #061230 100%)"}}>
      <div className="absolute inset-0 flex flex-wrap content-start gap-8 p-8 opacity-10 pointer-events-none">
        {["mx","us","br","ar","fr","de","es","pt","jp","kr","nl","ca","uy","co","gh","sa","ma","tr"].map((c, i) => (
          <img key={i} src={`/banderas/${c}.svg`} alt="" width={48} height={32} />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl gap-6">
        <div className="text-8xl drop-shadow-2xl">⚽</div>
        <span className="bg-green-600 text-white text-sm font-bold tracking-widest uppercase px-5 py-2 rounded-full">
          🌎 Exclusivo Escuelas Privadas
        </span>
        <h1 className="text-white font-black uppercase leading-none" style={{fontSize: "clamp(2.5rem, 8vw, 5rem)", textShadow: "4px 4px 0 rgba(0,0,0,0.4)"}}>
          MUNDIALITO<br />
          <span className="text-yellow-400">ESCOLAR</span><br />
          2026
        </h1>
        <p className="text-white/80 text-lg font-semibold">
          🏆 Quiniela de Predicciones del Mundial FIFA 2026
        </p>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 font-black text-base px-8 py-3 rounded-xl shadow-lg">
          ✅ 100% GRATUITO para alumnos de escuelas participantes
        </div>
        <div className="grid grid-cols-2 gap-4 w-full mt-2">
          {[
            { icon: "⚽", title: "Predice Resultados", desc: "Elige los marcadores antes de cada partido del Mundial" },
            { icon: "📊", title: "Acumula Puntos", desc: "Cada acierto suma puntos y sube tu posición en el ranking" },
            { icon: "👩‍🏫", title: "Rankings en Tiempo Real", desc: "Maestros y directivos siguen los resultados en vivo" },
            { icon: "🥇", title: "¡Top 3 Ganan Premios!", desc: "Premios increíbles para los mejores pronosticadores" },
          ].map((card, i) => (
            <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-4 text-left backdrop-blur-sm">
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="text-blue-300 font-black text-sm uppercase tracking-wide mb-1">{card.title}</div>
              <div className="text-white/70 text-xs leading-relaxed">{card.desc}</div>
            </div>
          ))}
        </div>
        <a
          href="https://mundialenmicolegio.com/auth/registro"
          className="mt-2 w-full max-w-sm bg-gradient-to-r from-sky-500 to-blue-700 hover:from-sky-400 hover:to-blue-600 text-white font-black uppercase tracking-widest text-lg py-5 rounded-2xl shadow-xl transition-all hover:scale-105 text-center"
        >
          🚀 REGÍSTRATE AHORA →
        </a>
        <p className="text-white/40 text-sm tracking-widest">mundialenmicolegio.com</p>
      </div>
    </main>
  );
}
