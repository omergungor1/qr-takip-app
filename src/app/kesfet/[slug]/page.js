import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { TURIZM_CATEGORIES, getTurizmCategoryLabel, isValidTurizmCategory } from '@/lib/turizm-categories'
import { createClient } from '@/lib/supabase-server'
import { mapExploreRow } from '@/lib/explore-content'
import { getPublicSiteBase } from '@/lib/site-url'
import Breadcrumb from '@/components/Breadcrumb'
import BlogShareButtons from '@/components/BlogShareButtons'
import TurizmBlogCard from '@/components/TurizmBlogCard'

function getVideoEmbedUrl(rawUrl) {
  if (!rawUrl) return null
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace(/^www\./, '')

    if (host.includes('youtu.be') || host.includes('youtube.com')) {
      let videoId = null
      if (host.includes('youtu.be')) {
        videoId = url.pathname.split('/').filter(Boolean)[0]
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.split('/')[2]
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/')[2]
      } else {
        videoId = url.searchParams.get('v')
      }
      if (!videoId) return null
      return `https://www.youtube-nocookie.com/embed/${videoId}`
    }

    if (host.includes('vimeo.com') || host.includes('player.vimeo.com')) {
      const parts = url.pathname.split('/').filter(Boolean)
      const numericPart = [...parts].reverse().find((p) => /^\d+$/.test(p))
      if (!numericPart) return null
      return `https://player.vimeo.com/video/${numericPart}`
    }

    return null
  } catch {
    return null
  }
}

async function getCategoryBlogs(slug) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('explore_contents')
    .select('*')
    .eq('category', slug)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })
  return (data || []).map(mapExploreRow)
}

async function getBlogBySlug(slug) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('explore_contents')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data ? mapExploreRow(data) : null
}

export async function generateMetadata({ params }) {
  const { slug } = await params

  if (isValidTurizmCategory(slug)) {
    const label = getTurizmCategoryLabel(slug)
    return {
      title: `${label} — Keşfet yazıları`,
      description: `${label} kategorisinde Türkiye rotaları, kültür ve seyahat önerileri. GezginKitap keşif rehberi.`,
      openGraph: {
        title: `${label} | Türkiye’yi Keşfet`,
        description: `${label} ile ilgili blog yazıları ve rota fikirleri.`,
      },
    }
  }

  const blog = await getBlogBySlug(slug)
  if (!blog) return { title: 'Bulunamadı' }

  const catLabel = getTurizmCategoryLabel(blog.category)
  const base = getPublicSiteBase()
  const path = `/kesfet/${slug}`
  const pageUrl = base ? `${base}${path}` : undefined
  const imageUrl =
    blog.cover_url?.startsWith('http') ? blog.cover_url : base && blog.cover_url ? `${base}${blog.cover_url}` : blog.cover_url || undefined

  return {
    title: blog.title,
    description: blog.description || undefined,
    ...(pageUrl ? { alternates: { canonical: pageUrl } } : {}),
    openGraph: {
      title: blog.title,
      description: blog.description,
      ...(pageUrl ? { url: pageUrl } : {}),
      type: 'article',
      publishedTime: blog.published_at || undefined,
      images: imageUrl ? [{ url: imageUrl, alt: blog.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: { index: true, follow: true },
    other: { 'article:section': catLabel },
  }
}

export default async function KesfetSlugPage({ params }) {
  const { slug } = await params

  if (isValidTurizmCategory(slug)) {
    const label = getTurizmCategoryLabel(slug)
    const blogs = await getCategoryBlogs(slug)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <Breadcrumb
            items={[
              { label: 'Ana sayfa', href: '/' },
              { label: 'Keşfet', href: '/kesfet' },
              { label },
            ]}
          />

          <div className="max-w-3xl mb-10 sm:mb-12">
            <p className="text-sm font-semibold text-[var(--primary)] uppercase tracking-widest mb-2">{label}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
              {label}: keşif yazıları
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">Bu kategoride yayınlanan keşif içeriklerini burada bulabilirsiniz.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TURIZM_CATEGORIES.filter((c) => c.id !== slug).map((c) => (
                <Link
                  key={c.id}
                  href={`/kesfet/${c.id}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.map((blog) => (
              <TurizmBlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          {blogs.length === 0 && <p className="text-slate-500 text-center py-10">Bu kategoride henüz yayınlanmış içerik yok.</p>}
        </div>
      </div>
    )
  }

  const blog = await getBlogBySlug(slug)
  if (!blog) notFound()

  const label = getTurizmCategoryLabel(blog.category)
  const base = getPublicSiteBase()
  const path = `/kesfet/${slug}`
  const shareUrl = base ? `${base}${path}` : undefined
  const html = blog.content || `<p>${blog.description || ''}</p>`
  const cover = blog.cover_url
  const videoEmbedUrl = getVideoEmbedUrl(blog.video_url)

  const supabase = await createClient()
  const { data: relatedRows } = await supabase
    .from('explore_contents')
    .select('*')
    .eq('category', blog.category)
    .eq('status', 'published')
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3)
  const related = (relatedRows || []).map(mapExploreRow)

  const absoluteCover = cover ? (cover.startsWith('http') ? cover : base ? `${base}${cover}` : undefined) : undefined
  const pageUrlForSchema = base ? `${base}${path}` : undefined
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.description || '',
    ...(absoluteCover ? { image: absoluteCover } : {}),
    datePublished: blog.published_at || undefined,
    author: { '@type': 'Organization', name: 'GezginKitap' },
    publisher: { '@type': 'Organization', name: 'GezginKitap' },
    ...(pageUrlForSchema ? { mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrlForSchema } } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-6 sm:py-10 max-w-4xl">
          <Breadcrumb
            items={[
              { label: 'Ana sayfa', href: '/' },
              { label: 'Keşfet', href: '/kesfet' },
              { label, href: `/kesfet/${blog.category}` },
              { label: blog.title },
            ]}
          />

          <article className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 sm:p-10 md:p-12">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link href={`/kesfet/${blog.category}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors">
                  {label}
                </Link>
                {blog.published_at && (
                  <time dateTime={blog.published_at} className="text-sm text-slate-500">
                    {new Date(blog.published_at).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-slate-900 leading-tight mb-6" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
                {blog.title}
              </h1>
              {blog.description && <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">{blog.description}</p>}

              {cover && (
                <div className="relative w-full aspect-[21/9] sm:aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-10 ring-1 ring-slate-200">
                  <Image src={cover} alt={blog.title} fill className="object-cover" priority sizes="(max-width: 896px) 100vw, 896px" />
                </div>
              )}
              {videoEmbedUrl && (
                <div className="mb-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>Video</h2>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-slate-200">
                    <iframe
                      src={videoEmbedUrl}
                      title={`${blog.title} video`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="blog-content prose prose-slate prose-lg max-w-none text-slate-800 [&_p]:text-slate-700 [&_li]:text-slate-700" dangerouslySetInnerHTML={{ __html: html }} />
              <div className="mt-10 sm:mt-12">
                <BlogShareButtons url={shareUrl} title={blog.title} />
              </div>
            </div>
          </article>

          <section className="mt-12 sm:mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>Diğer yazılar</h2>
                <p className="text-slate-600 text-sm mt-1">Aynı kategoride devam eden okumalar</p>
              </div>
              <Link href={`/kesfet/${blog.category}`} className="inline-flex items-center justify-center text-sm font-semibold text-[var(--primary)] hover:underline underline-offset-2 min-h-[44px]">
                Tüm listeye dön
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((b) => (
                <TurizmBlogCard key={b.id} blog={b} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

