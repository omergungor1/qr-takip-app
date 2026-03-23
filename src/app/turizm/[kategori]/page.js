import { notFound } from 'next/navigation'
import Link from 'next/link'
import { TURIZM_CATEGORIES, getTurizmCategoryLabel, isValidTurizmCategory } from '@/lib/turizm-categories'
import { createClient } from '@/lib/supabase-server'
import { mapExploreRow } from '@/lib/explore-content'
import Breadcrumb from '@/components/Breadcrumb'
import TurizmBlogCard from '@/components/TurizmBlogCard'

export function generateStaticParams() {
  return TURIZM_CATEGORIES.map((c) => ({ kategori: c.id }))
}

export async function generateMetadata({ params }) {
  const { kategori } = await params
  if (!isValidTurizmCategory(kategori)) return { title: 'Bulunamadı' }
  const label = getTurizmCategoryLabel(kategori)
  return {
    title: `${label} — Turizm yazıları`,
    description: `${label} kategorisinde Türkiye rotaları, kültür ve seyahat önerileri. GezginKitap keşif rehberi.`,
    openGraph: {
      title: `${label} | Türkiye’yi Keşfet`,
      description: `${label} ile ilgili blog yazıları ve rota fikirleri.`,
    },
  }
}

export default async function TurizmKategoriListPage({ params }) {
  const { kategori } = await params
  if (!isValidTurizmCategory(kategori)) notFound()

  const label = getTurizmCategoryLabel(kategori)
  const supabase = await createClient()
  const { data } = await supabase
    .from('explore_contents')
    .select('*')
    .eq('category', kategori)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
  const blogs = (data || []).map(mapExploreRow)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <Breadcrumb
          items={[
            { label: 'Ana sayfa', href: '/' },
            { label: 'Türkiye’yi Keşfet', href: '/turizm' },
            { label },
          ]}
        />

        <div className="max-w-3xl mb-10 sm:mb-12">
          <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-2">{label}</p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}
          >
            {label}: keşif yazıları
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Bu kategoride yayınlanan keşif içeriklerini burada bulabilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {TURIZM_CATEGORIES.filter((c) => c.id !== kategori).map((c) => (
              <Link
                key={c.id}
                href={`/turizm/${c.id}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog) => (
            <TurizmBlogCard key={blog.id} blog={blog} kategori={kategori} />
          ))}
        </div>
        {blogs.length === 0 && (
          <p className="text-slate-500 text-center py-10">Bu kategoride henüz yayınlanmış içerik yok.</p>
        )}
      </div>
    </div>
  )
}
