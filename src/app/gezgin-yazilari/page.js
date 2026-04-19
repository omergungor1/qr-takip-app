import { createClient } from '@/lib/supabase-server'
import { getStorageUrl } from '@/lib/utils'
import BlogCard from '@/components/BlogCard'

export const metadata = {
  title: 'Gezi-Görü-Anlatı | GezginKitap',
  description: 'GezginKitap gezgin yazıları ve içerikleri.',
}

export default async function GezginYazilariPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*, gezginler ( id, name, description, cover_image )')
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const withCover = (blogs || []).map((b) => {
    const rawG = b.gezginler
    const g = Array.isArray(rawG) ? rawG[0] : rawG
    const { gezginler: _drop, ...blogRow } = b
    return {
      ...blogRow,
      cover_image: blogRow.cover_image ? getStorageUrl(blogRow.cover_image) : getStorageUrl(`blogs/${blogRow.id}.jpg`),
      gezginForCard:
        g && g.name
          ? {
              name: g.name,
              description: g.description,
              avatarUrl: g.cover_image ? getStorageUrl(g.cover_image) : null,
            }
          : null,
    }
  })

  return (
    <div className="py-12 sm:py-16 bg-[var(--background)] min-h-[50vh]">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center max-w-2xl mx-auto mb-10">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Gezi-Görü-Anlatı
          </h1>
          <p className="text-[var(--text-light)] text-base sm:text-lg leading-relaxed">
            Gezginlerimizin yol üstü notları ve yazıları.
          </p>
        </header>

        {withCover.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {withCover.map(({ gezginForCard, ...blog }) => (
              <BlogCard key={blog.id} blog={blog} gezgin={gezginForCard} articleBasePath="/gezgin-bloglari" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm px-6 py-10 sm:py-12 max-w-2xl mx-auto text-center">
            <p className="text-[var(--text-light)] text-base sm:text-lg leading-relaxed">
              Henüz yayınlanmış gezgin yazısı yok. Yakında burada yeni içerikler paylaşılacak.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
