import { createClient } from '@/lib/supabase-server'
import MapSection from '@/components/MapSection'
import PackageModal from '@/components/PackageModal'
import IntroSection from '@/components/IntroSection'
import StatsSection from '@/components/StatsSection'
import GallerySection from '@/components/GallerySection'
import BlogCard from '@/components/BlogCard'
import NewsCard from '@/components/NewsCard'
import HomeClient from '@/components/HomeClient'
import { getStorageUrl } from '@/lib/utils'

export const metadata = {
  title: 'Gezgin Paket',
  description: 'QR kod ile takip edilen gezgin paketlerin Türkiye yolculuğunu haritada takip edin.',
}

async function getData() {
  const supabase = await createClient()

  const [packagesRes, newsRes, blogsRes, scansRes] = await Promise.all([
    supabase.from('packages').select('*, package_scans(*)').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('news').select('*').eq('is_active', true).not('published_at', 'is', null).order('published_at', { ascending: false }).limit(6),
    supabase.from('blogs').select('*').eq('is_active', true).not('published_at', 'is', null).order('published_at', { ascending: false }).limit(6),
    supabase.from('package_scans').select('*').order('created_at', { ascending: false }).limit(50),
  ])

  const packages = packagesRes.data || []
  const news = (newsRes.data || []).map((n) => ({ ...n, cover_image: n.cover_image ? getStorageUrl(n.cover_image) : getStorageUrl(`news/${n.id}.jpg`) }))
  const blogs = (blogsRes.data || []).map((b) => ({ ...b, cover_image: b.cover_image ? getStorageUrl(b.cover_image) : getStorageUrl(`blogs/${b.id}.jpg`) }))
  const scans = (scansRes.data || []).map((s) => ({ ...s, image_path: s.image_path ? getStorageUrl(s.image_path) : null }))

  const cities = new Set(scans.map((s) => s.province).filter(Boolean))
  const totalKm = 0 // demo: statik veya hesaplanabilir
  const stats = {
    totalPackages: packages.length,
    citiesVisited: cities.size,
    totalKm,
    totalScans: scans.length,
  }

  const packagesWithScans = packages.map((p) => ({
    ...p,
    package_scans: (p.package_scans || []).map((s) => ({
      ...s,
      image_path: s.image_path ? getStorageUrl(s.image_path) : null,
    })),
  }))

  return {
    packages: packagesWithScans,
    news,
    blogs,
    scans,
    stats,
  }
}

export default async function Home() {
  const { packages, news, blogs, scans, stats } = await getData()

  return (
    <>
      <section className="flex-1">
        <section className="py-6 sm:py-8 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 text-center">
              Türkiye Haritası ve Paket Konumları
            </h2>
            <p className="text-slate-600 text-center mb-6 max-w-2xl mx-auto">
              Haritada paketlerin anlık konumlarını görün. Bir pakete tıklayarak yolculuk geçmişini inceleyebilirsiniz.
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

        <IntroSection />
        <StatsSection />

        <GallerySection scans={scans} />

        <section className="py-12 sm:py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">Blog</h2>
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

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">Haberler</h2>
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
