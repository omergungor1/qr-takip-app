export const metadata = {
  title: 'Gezi-Görü-Anlatı | GezginKitap',
  description: 'GezginKitap gezgin yazıları ve içerikleri.',
}

export default function GezginYazilariPage() {
  return (
    <div className="py-12 sm:py-16 bg-[var(--background)] min-h-[50vh]">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
          Gezi-Görü-Anlatı
        </h1>
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm px-6 py-10 sm:py-12">
          <p className="text-[var(--text-light)] text-base sm:text-lg leading-relaxed">
            Henüz gezgin yazısı eklenmedi. Yakında burada yeni içerikler paylaşılacak.
          </p>
        </div>
      </div>
    </div>
  )
}
