'use client'

import Link from 'next/link'
import { TURIZM_CATEGORIES } from '@/lib/turizm-categories'

const ICONS = {
  gormelisin: (
    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  almalisin: (
    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  tatmalisin: (
    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  gitmelisin: (
    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  kalmalisin: (
    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  tanismalisin: (
    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
}

const CATEGORIES = TURIZM_CATEGORIES.map((c) => ({
  ...c,
  href: `/kesfet/${c.id}`,
  icon: ICONS[c.id],
}))

export default function TurizmKategoriButtons() {
  return (
    <section className="pt-2 sm:pt-3 pb-6 sm:pb-8 bg-[var(--background)] border-t border-slate-100" aria-labelledby="turizm-kategori-baslik">
      <div className="container mx-auto px-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center mb-6">
          <aside className="order-2 lg:order-1 w-full max-w-xl mx-auto lg:max-w-none rounded-xl border-2 border-dashed border-[var(--foreground)]/15 bg-[var(--background)]/70 px-4 py-3 text-center">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-light)]/80">Reklam alanı</span>
            <span className="block text-xs sm:text-sm text-[var(--text-light)] mt-1">Sol banner (728x90 / 320x100)</span>
          </aside>

          <div className="order-1 lg:order-2 text-center px-1 sm:px-4">
            <h2 id="turizm-kategori-baslik" className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
              Türkiye&apos;yi Keşfet
            </h2>
            <p className="text-[var(--text-light)] text-sm sm:text-base max-w-lg mx-auto">
              Kültür, turizm ve gastronomi rehberi
            </p>
          </div>

          <aside className="order-3 w-full max-w-xl mx-auto lg:max-w-none rounded-xl border-2 border-dashed border-[var(--foreground)]/15 bg-[var(--background)]/70 px-4 py-3 text-center">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-light)]/80">Reklam alanı</span>
            <span className="block text-xs sm:text-sm text-[var(--text-light)] mt-1">Sağ banner (728x90 / 320x100)</span>
          </aside>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {/* mx-auto flex w-fit max-w-5xl flex-wrap justify-start gap-3 sm:gap-4 */}
          {CATEGORIES.map((item) => {
            const content = (
              <>
                <span className="text-[var(--primary)] shrink-0" aria-hidden>
                  {item.icon}
                </span>
                <span className="font-semibold text-[var(--foreground)] text-sm sm:text-base">{item.label}</span>
              </>
            )
            const baseClass =
              'inline-flex w-[calc(50%-0.375rem)] sm:w-[190px] items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border-2 transition-all duration-200 min-w-0 min-h-[44px]'
            const activeClass =
              'border-[var(--primary)]/30 bg-white hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:shadow-md text-[var(--foreground)]'

            return (
              <Link
                key={item.id}
                href={item.href}
                title={`${item.label} yazıları`}
                className={`${baseClass} ${activeClass}`}
                target="_blank"
              >
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
