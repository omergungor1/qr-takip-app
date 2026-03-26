import Link from 'next/link'
import { TURIZM_CATEGORIES } from '@/lib/turizm-categories'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata = {
  title: 'Türkiye’yi Keşfet',
  description:
    'Kültür, turizm ve gastronomi rehberi: kategorilere göre blog yazıları ve rota fikirleri. GezginKitap ile Türkiye’yi keşfedin.',
}

const cardIntro = {
  gormelisin: 'Manzara, tarih ve mimari duraklar — gözünüze hitap eden rotalar.',
  almalisin: 'Yöresel ürünler, el işçiliği ve hatıra seçenekleri.',
  tatmalisin: 'Lezzet durakları ve yerel mutfak deneyimleri.',
  gitmelisin: 'Konum ve rota odaklı öneriler — yola çıkmaya değer yerler.',
  kalmalisin: 'Konaklama ve sakin mola önerileri; şehirden uzaklaşmak için.',
}

const cardTheme = {
  gormelisin: {
    ring: 'from-violet-500/20 via-fuchsia-400/10 to-transparent',
    badge: 'bg-violet-100 text-violet-700',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  almalisin: {
    ring: 'from-amber-500/20 via-orange-400/10 to-transparent',
    badge: 'bg-amber-100 text-amber-700',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  tatmalisin: {
    ring: 'from-rose-500/20 via-red-400/10 to-transparent',
    badge: 'bg-rose-100 text-rose-700',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  gitmelisin: {
    ring: 'from-sky-500/20 via-cyan-400/10 to-transparent',
    badge: 'bg-sky-100 text-sky-700',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  kalmalisin: {
    ring: 'from-emerald-500/20 via-green-400/10 to-transparent',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
}

export default function KesfetHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 sm:py-14 max-w-5xl">
        <Breadcrumb
          items={[
            { label: 'Ana sayfa', href: '/' },
            { label: 'Keşfet' },
          ]}
        />

        <header className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">Rehber</p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}
          >
            Türkiye’yi Keşfet
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Beş kategori altında toplanan yazılarla rotanızı zenginleştirin.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {TURIZM_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/kesfet/${c.id}`}
              className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:border-[var(--primary)]/35 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cardTheme[c.id].ring}`} aria-hidden />
              <span className="absolute top-5 right-5 text-slate-300 group-hover:text-[var(--primary)] transition-colors text-2xl z-10" aria-hidden>
                →
              </span>
              <div className="relative z-10 inline-flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${cardTheme[c.id].badge}`}>
                  {cardTheme[c.id].icon}
                </span>
                <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${cardTheme[c.id].badge}`}>
                  Keşfet
                </span>
              </div>
              <h2
                className="relative z-10 text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors pr-8"
                style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}
              >
                {c.label}
              </h2>
              <p className="relative z-10 mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">{cardIntro[c.id]}</p>
              <span className="relative z-10 inline-flex items-center gap-1 mt-5 text-sm font-semibold text-[var(--primary)]">
                Yazıları görüntüle
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

