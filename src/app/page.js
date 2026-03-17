import { createClient } from '@/lib/supabase-server'
import MapSection from '@/components/MapSection'
import IntroSection from '@/components/IntroSection'
import StatsSection from '@/components/StatsSection'
import TurizmKategoriButtons from '@/components/TurizmKategoriButtons'
import InfoCardsSection from '@/components/InfoCardsSection'
import GallerySection from '@/components/GallerySection'
import BlogCard from '@/components/BlogCard'
import NewsCard from '@/components/NewsCard'
import HomeClient from '@/components/HomeClient'
import HeroSection from '@/components/HeroSection'
import WantedBooksSection from '@/components/WantedBooksSection'
import { getStorageUrl, totalKmFromScans } from '@/lib/utils'

export const metadata = {
  title: 'GezginKitap',
  description: "Kitaplar Türkiye'yi geziyor. Bir kitabı bul, check-in yap ve başka bir şehre bırak.",
}

async function getData() {
  const supabase = await createClient()

  const [packagesRes, newsRes, blogsRes, scansRes] = await Promise.all([
    supabase.from('packages').select('*, package_scans(*)').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('news').select('*').eq('is_active', true).not('published_at', 'is', null).order('published_at', { ascending: false }).limit(6),
    supabase.from('blogs').select('*').eq('is_active', true).not('published_at', 'is', null).order('published_at', { ascending: false }).limit(6),
    supabase.from('package_scans').select('*').order('created_at', { ascending: false }).limit(500),
  ])

  const packages = packagesRes.data || []
  const news = (newsRes.data || []).map((n) => ({ ...n, cover_image: n.cover_image ? getStorageUrl(n.cover_image) : getStorageUrl(`news/${n.id}.jpg`) }))
  const blogs = (blogsRes.data || []).map((b) => ({ ...b, cover_image: b.cover_image ? getStorageUrl(b.cover_image) : getStorageUrl(`blogs/${b.id}.jpg`) }))
  const allScans = scansRes.data || []
  const scans = allScans.slice(0, 50).map((s) => ({ ...s, image_path: s.image_path ? getStorageUrl(s.image_path) : null }))

  const cities = new Set(allScans.map((s) => s.province).filter(Boolean))
  const totalKm = totalKmFromScans(allScans)
  const stats = {
    totalPackages: packages.length,
    citiesVisited: cities.size,
    totalKm,
    totalScans: allScans.length,
  }

  const packagesWithScans = packages.map((p) => ({
    ...p,
    package_scans: (p.package_scans || []).map((s) => ({
      ...s,
      image_path: s.image_path ? getStorageUrl(s.image_path) : null,
    })),
  }))

  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  const wantedBooks = packagesWithScans.filter((p) => {
    const lastScan = (p.package_scans || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    return !lastScan || new Date(lastScan.created_at) < fourteenDaysAgo
  })

  return {
    packages: packagesWithScans,
    news,
    blogs,
    scans,
    stats,
    wantedBooks,
  }
}

export default async function Home() {
  const { packages, news, blogs, scans, stats, wantedBooks } = await getData()

  return (
    <>
      <HeroSection stats={stats} />
      <section className="flex-1">
        <section className="py-6 sm:py-8 bg-[var(--background)]" id="map">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2 text-center">
              Kitapların Konumları
            </h2>
            <p className="text-[var(--text-light)] text-center mb-6 max-w-2xl mx-auto">
              Haritada kitapların son konumlarını ve gezindiği rotayı görün. Bir kitaba tıklayarak pasaport sayfasına gidebilirsiniz.
            </p>
            <HomeClient
              packages={packages}
              news={news}
              blogs={blogs}
              scans={scans}
              stats={stats}
            />
          </div>
        </section>
        <TurizmKategoriButtons />
        <StatsSection stats={stats} />
        <InfoCardsSection />
        <GallerySection scans={scans} />
        <WantedBooksSection wantedBooks={wantedBooks} />
        <IntroSection />

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-8">Gezgin Blogları</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            {blogs.length === 0 && (
              <p className="text-slate-500 text-center py-8">Henüz blog yazısı yok.</p>
            )}
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-[var(--background)]">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-8">Haberler</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
            {news.length === 0 && (
              <p className="text-slate-500 text-center py-8">Henüz haber yok.</p>
            )}
          </div>
        </section>
      </section>
    </>
  )
}
