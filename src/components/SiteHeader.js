'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/harita', label: 'Harita' },
  { href: '/blog', label: 'Blog' },
  { href: '/haber', label: 'Haberler' },
  { href: '/hakkimizda', label: 'Proje Hakkında' },
]

const linkClass = 'block px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[#FF6B3D]/10 rounded-xl transition-colors'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0" onClick={() => setMenuOpen(false)}>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="GezginKitap"
                fill
                className="object-contain"
                priority
                sizes="40px"
              />
            </div>
            <span className="font-bold text-[var(--foreground)] text-lg sm:text-xl truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
              GezginKitap
            </span>
          </Link>

          {/* Masaüstü: yatay menü */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-4">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="px-2 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] rounded-xl hover:bg-[#FF6B3D]/10 transition-colors">
                {label}
              </Link>
            ))}
            <Link
              href="/harita"
              className="ml-2 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold px-4 py-2.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              Kitap Bul
            </Link>
          </nav>

          {/* Mobil: hamburger butonu */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          >
            <span className="sr-only">{menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobil: açılır menü */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container mx-auto px-4 pb-4 pt-1 bg-white border-t border-slate-100">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/harita"
              className="block px-4 py-3 text-sm font-semibold rounded-xl bg-[var(--primary)] text-white text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Kitap Bul
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
