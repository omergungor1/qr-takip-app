import Link from 'next/link'

export const metadata = {
  title: 'Talebiniz alındı | GezginKitap',
  description: 'Reklam talebiniz başarıyla iletildi.',
}

export default function ReklamTesekkurPage() {
  return (
    <div className="py-16 sm:py-24 bg-[var(--background)] min-h-[60vh] flex flex-col">
      <div className="container mx-auto px-4 max-w-lg text-center flex-1 flex flex-col justify-center">
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-8 sm:p-10 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Talebiniz alındı
          </h1>
          <p className="text-slate-700 leading-relaxed mb-2">
            Reklam talebiniz başarıyla kaydedildi. İlginiz için teşekkür ederiz.
          </p>
          <p className="text-slate-600 text-sm">
            Uygun zamanda sizinle iletişime geçeceğiz.
          </p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex justify-center rounded-lg bg-[var(--primary)] text-white font-semibold px-6 py-3 hover:opacity-95 transition-opacity"
          >
            Ana sayfa
          </Link>
          <Link
            href="/reklam-ver"
            className="inline-flex justify-center text-[var(--primary)] font-medium hover:underline underline-offset-2"
          >
            Yeni talep
          </Link>
        </div>
      </div>
    </div>
  )
}
