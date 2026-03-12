import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { getStorageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blogs').select('title').eq('slug', slug).eq('is_active', true).single()
  return { title: data?.title ? `${data.title} | Gezgin Paket` : 'Blog | Gezgin Paket' }
}

export default async function BlogSlugPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .single()
  if (error || !blog) notFound()

  const coverUrl = blog.cover_image ? getStorageUrl(blog.cover_image) : null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-slate-800">Gezgin Paket</Link>
        </div>
      </header>
      <article className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{blog.title}</h1>
        {coverUrl && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
            <Image src={coverUrl} alt={blog.title} fill className="object-cover" priority />
          </div>
        )}
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
        <Link href="/" className="inline-block mt-8 text-amber-600 font-medium">← Ana sayfa</Link>
      </article>
    </div>
  )
}
