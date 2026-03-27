import Link from 'next/link'

export const metadata = {
  title: 'Bağış | GezginKitap',
  description: 'GezginKitap projesine bağış. Sayfa yapım aşamasındadır.',
}

export default function BagisPage() {
  return (
    <div className="py-12 sm:py-16 bg-[var(--background)] min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wide px-3 py-1 mb-4">
            Yakında
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Bağış
          </h1>
          <p className="text-[var(--text-light)] text-lg">
            Bağış sayfamız şu anda <strong className="text-[var(--foreground)]">yapım aşamasındadır</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm p-6 sm:p-8 space-y-6">
          <p className="text-slate-700 leading-relaxed">
            GezginKitap&apos;ı sürdürmek ve kitapların yolculuğunu büyütmek için ileride güvenli ödeme altyapısı
            üzerinden bağış kabul edeceğiz.
          </p>
          <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" aria-hidden />
              <span>Platform ve harita altyapısının sürdürülmesi</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--secondary)]" aria-hidden />
              <span>Yeni kitap rotaları ve içerik üretimi</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
              <span>Topluluk etkinlikleri ve duyurular</span>
            </li>
          </ul>
          <p className="text-sm text-slate-500 border-t border-slate-100 pt-6">
            Şimdilik sorularınız için{' '}
            <a href="mailto:gezginkitaptv@gmail.com" className="text-[var(--primary)] font-medium underline underline-offset-2">
              gezginkitaptv@gmail.com
            </a>{' '}
            adresinden yazabilirsiniz.
          </p>
        </div>

        <p className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--primary)] font-medium hover:underline underline-offset-2"
          >
            ← Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  )
}
