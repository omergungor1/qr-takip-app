import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { getStorageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('news').select('title').eq('slug', slug).eq('is_active', true).single()
  return { title: data?.title ? `${data.title} | GezginKitap` : 'Haber | GezginKitap' }
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
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-3xl">
        <Breadcrumb
          items={[
            { label: 'Ana sayfa', href: '/' },
            { label: 'Haberler', href: '/haber' },
            { label: news.title },
          ]}
        />

        <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{news.title}</h1>
            {news.published_at && (
              <p className="text-slate-500 text-sm mb-6">
                {new Date(news.published_at).toLocaleDateString('tr-TR', { dateStyle: 'long' })}
              </p>
            )}
            {coverUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-slate-100">
                <Image src={coverUrl} alt={news.title} fill className="object-cover" priority />
              </div>
            )}
            <div
              className="news-content prose prose-slate max-w-none text-slate-800 [&_p]:text-slate-800 [&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900 [&_li]:text-slate-700 [&_a]:text-amber-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            <div className="mt-10 pt-8 border-t border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                GP
              </div>
              <div>
                <p className="font-semibold text-slate-800">GezginKitap Editör</p>
                <p className="text-sm text-slate-500">İçerik ekibi</p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8">
          <Link
            href="/haber"
            className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tüm haberler
          </Link>
        </div>
      </div>
    </div>
  )
}
