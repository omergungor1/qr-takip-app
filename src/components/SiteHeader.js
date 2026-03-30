'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/yol-arkadaslarim', label: 'Yol Arkadaşlarım' },
  { href: '/blog', label: 'Blog' },
  { href: '/haber', label: 'Haberler' },
  { href: '/hakkimizda', label: 'Proje Hakkında' },
]

const externalLinks = [
  { href: 'https://www.turizmatlasitv.com/', label: 'Turizm Atlası', description: "Türkiye'nin kültür ve turizm haberleri burada" },
  { href: 'https://www.gastronomiatlasi.com/', label: 'Gastronomi Atlası', description: "Türkiye'nin mekan ve otelleri" },
]

const gezginYazilariCard = {
  href: '/gezgin-yazilari',
  label: 'Gezi-Görü-Anlatı',
  description: 'Yolculuk ve okuma üzerine yazılar',
}

const linkClass = 'block px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:bg-[#FF6B3D]/10 rounded-xl transition-colors'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between min-h-14 sm:min-h-16 py-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0" onClick={() => setMenuOpen(false)}>
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
            {/* Harici linkler: masaüstünde logo yanında, açıklama metinli butonlar */}
            <div className="hidden sm:flex items-stretch gap-2">
              {externalLinks.map(({ href, label, description }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-center text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-colors min-w-0 max-w-[200px] sm:max-w-[220px]"
                >
                  <span className="font-semibold text-[var(--foreground)] text-sm leading-tight">{label}</span>
                  <span className="text-xs text-slate-500 leading-tight mt-0.5 line-clamp-2">{description}</span>
                </a>
              ))}
              <Link
                href={gezginYazilariCard.href}
                className="flex flex-col justify-center text-left px-3 py-2 rounded-xl border border-slate-200 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-colors min-w-0 max-w-[200px] sm:max-w-[220px]"
              >
                <span className="font-semibold text-[var(--foreground)] text-sm leading-tight">{gezginYazilariCard.label}</span>
                <span className="text-xs text-slate-500 leading-tight mt-0.5 line-clamp-2">{gezginYazilariCard.description}</span>
              </Link>
            </div>
          </div>

          {/* Masaüstü: yatay menü */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-4">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="px-2 py-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] rounded-xl hover:bg-[#FF6B3D]/10 transition-colors">
                {label}
              </Link>
            ))}
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

      {/* Mobil: açılır menü — max-height + overflow-y-auto ile tüm linkler görünür, gerekirse kaydırılır */}
      <div
        className={`md:hidden transition-all duration-200 ease-out ${menuOpen
          ? 'max-h-[min(88vh,720px)] overflow-y-auto opacity-100'
          : 'max-h-0 overflow-hidden opacity-0'
          }`}
      >
        <nav className="container mx-auto px-4 pb-6 pt-1 bg-white border-t border-slate-100">
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
            <div className="border-t border-slate-100 pt-2 mt-1">
              <p className="px-4 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">İlgili siteler</p>
              {externalLinks.map(({ href, label, description }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-xl hover:bg-[#FF6B3D]/10 transition-colors text-left"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="font-semibold text-[var(--foreground)] text-sm block">{label}</span>
                  <span className="text-xs text-slate-500 mt-0.5 block">{description}</span>
                </a>
              ))}
              <Link
                href={gezginYazilariCard.href}
                className="block px-4 py-3 rounded-xl hover:bg-[#FF6B3D]/10 transition-colors text-left"
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-semibold text-[var(--foreground)] text-sm block">{gezginYazilariCard.label}</span>
                <span className="text-xs text-slate-500 mt-0.5 block">{gezginYazilariCard.description}</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
