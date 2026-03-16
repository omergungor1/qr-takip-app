import { createClient } from '@/lib/supabase-server'
import { getStorageUrl } from '@/lib/utils'
import NewsCard from '@/components/NewsCard'

export const metadata = {
  title: 'Haberler | GezginKitap',
  description: 'GezginKitap projesi haberleri.',
}

export default async function HaberListPage() {
  const supabase = await createClient()
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const withCover = (news || []).map((n) => ({
    ...n,
    cover_image: n.cover_image ? getStorageUrl(n.cover_image) : getStorageUrl(`news/${n.id}.jpg`),
  }))

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Haberler</h1>
        <p className="text-slate-600 mb-8">Proje haberleri ve duyurular</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {withCover.map((n) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
        {(!news || news.length === 0) && (
          <p className="text-slate-500 text-center py-16">Henüz haber yok.</p>
        )}
      </div>
    </div>
  )
}
