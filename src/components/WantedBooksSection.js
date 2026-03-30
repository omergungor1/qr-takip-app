import Link from 'next/link'
import Image from 'next/image'

export default function WantedBooksSection({ wantedBooks }) {
  if (!wantedBooks?.length) return null

  return (
    <section className="py-12 sm:py-16 bg-[var(--background)] border-y border-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/10 via-[var(--background)] to-[var(--primary)]/8" aria-hidden />
      <div className="container mx-auto px-4">
        <div className="relative z-10 max-w-5xl mx-auto">
          <header className="text-center mb-8 sm:mb-10">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 animate-mascot-shrug" aria-hidden>
              <Image
                src="/logo.png"
                alt="GezginKitap"
                fill
                className="object-contain drop-shadow-sm"
                sizes="80px"
              />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Aranıyor: Gezgin Kitaplar
            </h2>
            <p className="text-[var(--text-light)] mb-3 max-w-2xl mx-auto leading-relaxed">
              Bu kitaplardan <strong className="text-[var(--foreground)]">iki haftadır</strong> haber alamıyoruz.
              Eğer karşına çıkarsa, QR&apos;ını okutup küçük bir not bırakman yeterli.
            </p>
            <p className="text-sm text-[var(--text-light)] max-w-2xl mx-auto">
              Bulan gezginlere bazen küçük sürprizlerimiz oluyor. Sen de hikâyenin kahramanı ol.
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 justify-items-center">
          {wantedBooks.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/book/${pkg.code}`}
              className="group w-full rounded-2xl bg-white/90 border border-[var(--accent)]/25 px-4 py-4 shadow-sm hover:shadow-md hover:border-[var(--accent)]/45 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] ring-1 ring-[var(--accent)]/15 group-hover:bg-[var(--accent)]/15">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-[var(--foreground)] leading-tight truncate">{pkg.title || `${pkg.code} nolu kitap`}</p>
                  <p className="text-xs text-[var(--text-light)] mt-1">Kod: {pkg.code}</p>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
