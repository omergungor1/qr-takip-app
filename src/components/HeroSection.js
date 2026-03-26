import Link from 'next/link'

export default function HeroSection({ stats }) {
  return (
    <section className="relative py-5 sm:py-8 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--background)] to-[var(--accent)]/10 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-5 sm:gap-6 lg:gap-10 lg:grid-cols-2 lg:items-stretch max-w-6xl mx-auto">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h1
              className="text-lg sm:text-2xl md:text-2xl font-bold text-[var(--foreground)] mb-2 leading-snug max-w-xl lg:max-w-none mx-auto lg:mx-0"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Kitaplar Türkiye&apos;yi Geziyor
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-light)] max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed">
              Bir kitabı bul, Qr kodunu okut ve başka bir şehre götür bırak. Türkiye&apos;nin en ilginç kitap
              yolculuğunu birlikte yazıyoruz.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/harita"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-white font-semibold px-5 py-2.5 text-sm sm:text-base shadow-lg hover:opacity-90 transition-opacity"
              >
                Keşfet
              </Link>
            </div>
          </div>
          <aside
            className="hidden sm:flex relative w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none aspect-[4/1] min-h-[64px] rounded-2xl border-2 border-dashed border-[var(--foreground)]/15 bg-[var(--background)]/60 flex-col items-center justify-center p-3 sm:p-6 text-center lg:aspect-auto lg:min-h-[140px] lg:self-stretch"
            aria-label="Reklam alanı"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-light)]/80 mb-1">
              Reklam alanı
            </span>
            <span className="text-sm text-[var(--text-light)]">728 × 90 veya benzeri banner</span>
          </aside>
        </div>
      </div>
    </section>
  )
}
