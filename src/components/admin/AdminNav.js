'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useState } from 'react'

export default function AdminNav({ user }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navLinks = [
    { href: '/admin', label: 'Panel' },
    { href: '/admin/packages', label: 'Kitaplar' },
    { href: '/admin/news', label: 'Haberler' },
    { href: '/admin/blogs', label: 'Gezgin Haberleri' },
    { href: '/admin/explore', label: 'Keşfet' },
    { href: '/admin/subscribers', label: 'Aboneler' },
    { href: '/admin/ad-requests', label: 'Reklam talepleri' },
    { href: '/admin/settings', label: 'Ayarlar' },
    { href: '/admin/images', label: 'Görseller' },
  ]

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/admin" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="GezginKitap"
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <span className="font-bold text-slate-800 text-base sm:text-xl truncate">
              GezginKitap
            </span>
            <span className="font-bold text-[var(--primary)] text-sm sm:text-base ml-1">Admin</span>
          </Link>

          {/* Masaüstü: yatay menü */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive(href)
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                  : 'text-slate-600 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5'
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm text-slate-500 truncate max-w-[140px] lg:max-w-[200px]" title={user?.email}>
              {user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-slate-600 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Çıkış
            </button>

            {/* Mobil: hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Menü"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg font-medium ${isActive(href)
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'text-slate-700 hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]'
                    }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
