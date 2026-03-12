import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { getStorageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('news').select('title').eq('slug', slug).eq('is_active', true).single()
  return { title: data?.title ? `${data.title} | Gezgin Paket` : 'Haber | Gezgin Paket' }
}

export default async function NewsSlugPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .single()
  if (error || !news) notFound()

  const coverUrl = news.cover_image ? getStorageUrl(news.cover_image) : null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-slate-800">Gezgin Paket</Link>
        </div>
      </header>
      <article className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{news.title}</h1>
        {news.published_at && (
          <p className="text-slate-500 text-sm mb-4">{new Date(news.published_at).toLocaleDateString('tr-TR', { dateStyle: 'long' })}</p>
        )}
        {coverUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
            <Image src={coverUrl} alt={news.title} fill className="object-cover" priority />
          </div>
        )}
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
        <Link href="/" className="inline-block mt-8 text-amber-600 font-medium">← Ana sayfa</Link>
      </article>
    </div>
  )
}
