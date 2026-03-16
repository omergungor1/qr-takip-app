import Link from 'next/link'

export default function HeroSection({ stats }) {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--background)] to-[var(--accent)]/10 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
          Kitaplar Türkiye&apos;yi Geziyor
        </h1>
        <p className="text-lg sm:text-xl text-[var(--text-light)] max-w-2xl mx-auto mb-8">
          Bir kitabı bul, check-in yap ve başka bir şehre bırak. Türkiye&apos;nin en ilginç kitap yolculuğunu birlikte yazıyoruz.
        </p>
        <Link
          href="/harita"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-white font-semibold px-8 py-4 shadow-lg hover:opacity-90 transition-opacity"
        >
          Haritayı Keşfet
        </Link>
      </div>
    </section>
  )
}
