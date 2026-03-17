'use client'

const CATEGORIES = [
  {
    id: 'gormelisin',
    label: 'Görmelisin',
    href: 'https://www.turizmatlasitv.com/kategori/gormelisin',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    id: 'almalisin',
    label: 'Almalısın',
    href: 'https://www.turizmatlasitv.com/kategori/tatmalisin',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    id: 'tatmalisin',
    label: 'Tatmalısın',
    href: 'https://www.turizmatlasitv.com/kategori/tatmalisin',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: 'gitmeli',
    label: 'Gitmeli',
    href: null,
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    disabled: true,
    title: 'Yakında',
  },
  {
    id: 'kalmalisin',
    label: 'Kalmalısın',
    href: 'https://www.turizmatlasitv.com/kategori/kalmalisin',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
]

export default function TurizmKategoriButtons() {
  return (
    <section className="py-8 sm:py-10 bg-[var(--background)] border-t border-slate-100">
      <div className="container mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-[var(--foreground)] mb-2">
          Türkiye&apos;yi Keşfet
        </h2>
        <p className="text-[var(--text-light)] text-center text-sm sm:text-base mb-6 max-w-lg mx-auto">
          Kültür, turizm ve gastronomi rehberi
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {CATEGORIES.map((item) => {
            const content = (
              <>
                <span className="text-[var(--primary)] shrink-0" aria-hidden>{item.icon}</span>
                <span className="font-semibold text-[var(--foreground)] text-sm sm:text-base">{item.label}</span>
              </>
            )
            const baseClass = 'inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border-2 transition-all duration-200 min-w-0'
            const activeClass = 'border-[var(--primary)]/30 bg-white hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:shadow-md text-[var(--foreground)]'
            const disabledClass = 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'

            if (item.disabled || !item.href) {
              return (
                <span
                  key={item.id}
                  title={item.title || item.label}
                  className={`${baseClass} ${disabledClass}`}
                  aria-disabled="true"
                >
                  {content}
                </span>
              )
            }
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.label}
                className={`${baseClass} ${activeClass}`}
              >
                {content}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
