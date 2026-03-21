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
  gitmeli: 'Konum ve rota odaklı öneriler — yola çıkmaya değer yerler.',
  kalmalisin: 'Konaklama ve sakin mola önerileri; şehirden uzaklaşmak için.',
}

export default function TurizmHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 sm:py-14 max-w-5xl">
        <Breadcrumb
          items={[
            { label: 'Ana sayfa', href: '/' },
            { label: 'Türkiye’yi Keşfet' },
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
            Beş kategori altında toplanan yazılarla rotanızı zenginleştirin. Şimdilik tüm kategoriler aynı örnek içerik listesini gösterir; ileride her kategori için ayrı içerikler bağlanacaktır.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {TURIZM_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/turizm/${c.id}`}
              className="group relative rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-[var(--primary)]/35 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <span className="absolute top-5 right-5 text-slate-300 group-hover:text-[var(--primary)] transition-colors text-2xl" aria-hidden>
                →
              </span>
              <h2
                className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors pr-8"
                style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}
              >
                {c.label}
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">{cardIntro[c.id]}</p>
              <span className="inline-block mt-5 text-sm font-semibold text-[var(--primary)]">Yazıları görüntüle</span>
            </Link>
          ))}
        </div>

        <section className="mt-14 sm:mt-20 rounded-2xl bg-slate-900 text-white p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
            GezginKitap ile bağlantılı okuma
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Kitapları şehirden şehire taşırken bu rehberdeki duraklarda mola verebilir, pasaport sayfalarınızı yeni şehirlerle doldurabilirsiniz. Proje blogu için{' '}
            <Link href="/blog" className="text-[var(--secondary)] font-semibold underline underline-offset-2 hover:text-white">
              Blog
            </Link>{' '}
            sayfasını ziyaret edin.
          </p>
        </section>
      </div>
    </div>
  )
}
