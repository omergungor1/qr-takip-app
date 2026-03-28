import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[min(70vh,640px)] py-14 sm:py-20 px-4 overflow-hidden bg-gradient-to-br from-[var(--primary)]/12 via-[var(--background)] to-[var(--accent)]/10"
      aria-labelledby="not-found-heading"
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--secondary)]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-[var(--primary)]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 animate-mascot-shrug" aria-hidden>
          <Image
            src="/logo.png"
            alt="GezginKitap maskotu"
            fill
            className="object-contain drop-shadow-md"
            sizes="(max-width: 640px) 128px, 160px"
            priority
          />
        </div>
        <p className="text-sm font-bold text-[var(--primary)] tracking-[0.2em] uppercase mb-2">
          404
        </p>
        <h1
          id="not-found-heading"
          className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-3 leading-tight"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Bu sayfa yolda kayboldu!
        </h1>
        <p className="text-[var(--text-light)] text-base leading-relaxed mb-8">
          Gezgin kitap başka bir rotaya sapmış olabilir; adres yanlış yazılmış ya da sayfa taşınmış.
          Merak etme — ana sayfadan yolculuğa devam edebilirsin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-white text-sm font-semibold px-6 py-3 hover:opacity-95 transition-opacity shadow-sm"
          >
            Ana sayfaya dön
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-xl border-2 border-[var(--foreground)]/15 bg-white/80 text-[var(--foreground)] text-sm font-semibold px-6 py-3 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-colors"
          >
            Blogu keşfet
          </Link>
        </div>
      </div>
    </section>
  )
}
