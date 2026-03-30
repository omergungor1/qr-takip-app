export default function HeroSection({ stats }) {
  return (
    <section className="relative pt-4 pb-3 sm:pt-6 sm:pb-4 bg-[var(--background)] overflow-hidden border-b border-[var(--foreground)]/10 -mb-2 sm:-mb-3">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--primary)]/10 via-[var(--background)] to-[var(--background)]" aria-hidden />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-4 sm:gap-5 lg:gap-8 lg:grid-cols-2 lg:items-stretch max-w-6xl mx-auto">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h1
              className="text-lg sm:text-2xl md:text-2xl font-bold text-[var(--foreground)] mb-2 leading-snug max-w-xl lg:max-w-none mx-auto lg:mx-0"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Gezgin Kitaplar Türkiye&apos;yi Geziyor
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-light)] max-w-xl mx-auto lg:mx-0 mb-2 sm:mb-3 leading-relaxed">
              Beni al! Oku, gittiğin yere götür ve gezebileceğim temiz bir yere bırak..!
            </p>
          </div>
          <aside
            className="flex relative w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none aspect-[4/1] min-h-[56px] rounded-2xl border-2 border-dashed border-[var(--foreground)]/15 bg-white/50 flex-col items-center justify-center p-3 sm:p-5 text-center lg:aspect-auto lg:min-h-[128px] lg:self-stretch"
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
