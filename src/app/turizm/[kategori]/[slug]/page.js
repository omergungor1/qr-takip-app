import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { TURIZM_CATEGORIES, getTurizmCategoryLabel, isValidTurizmCategory } from '@/lib/turizm-categories'
import { getMockTurizmBlogs, getMockBlogBySlug, buildMockArticleHtml } from '@/lib/mock-turizm-blogs'
import { getPublicSiteBase } from '@/lib/site-url'
import Breadcrumb from '@/components/Breadcrumb'
import BlogShareButtons from '@/components/BlogShareButtons'
import TurizmBlogCard from '@/components/TurizmBlogCard'

export function generateStaticParams() {
  const blogs = getMockTurizmBlogs()
  const out = []
  for (const c of TURIZM_CATEGORIES) {
    for (const b of blogs) {
      out.push({ kategori: c.id, slug: b.slug })
    }
  }
  return out
}

export async function generateMetadata({ params }) {
  const { kategori, slug } = await params
  if (!isValidTurizmCategory(kategori)) return { title: 'Bulunamadı' }
  const blog = getMockBlogBySlug(slug)
  if (!blog) return { title: 'Bulunamadı' }
  const catLabel = getTurizmCategoryLabel(kategori)
  const base = getPublicSiteBase()
  const path = `/turizm/${kategori}/${slug}`
  const pageUrl = base ? `${base}${path}` : undefined
  const imageUrl =
    blog.image?.startsWith('http') ? blog.image : base && blog.image ? `${base}${blog.image}` : blog.image || undefined

  return {
    title: blog.title,
    description: blog.description,
    ...(pageUrl ? { alternates: { canonical: pageUrl } } : {}),
    openGraph: {
      title: blog.title,
      description: blog.description,
      ...(pageUrl ? { url: pageUrl } : {}),
      type: 'article',
      publishedTime: blog.date,
      images: imageUrl ? [{ url: imageUrl, alt: blog.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: { index: true, follow: true },
    other: {
      'article:section': catLabel,
    },
  }
}

export default async function TurizmBlogDetailPage({ params }) {
  const { kategori, slug } = await params
  if (!isValidTurizmCategory(kategori)) notFound()

  const blog = getMockBlogBySlug(slug)
  if (!blog) notFound()

  const label = getTurizmCategoryLabel(kategori)
  const base = getPublicSiteBase()
  const path = `/turizm/${kategori}/${slug}`
  const shareUrl = base ? `${base}${path}` : undefined
  const html = buildMockArticleHtml(blog, label)
  const cover = blog.cover_image || blog.image

  const all = getMockTurizmBlogs()
  const related = all.filter((b) => b.slug !== slug).slice(0, 3)

  const absoluteCover = cover ? (cover.startsWith('http') ? cover : base ? `${base}${cover}` : undefined) : undefined
  const pageUrlForSchema = base ? `${base}${path}` : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.description,
    ...(absoluteCover ? { image: absoluteCover } : {}),
    datePublished: blog.date,
    author: {
      '@type': 'Organization',
      name: 'GezginKitap',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GezginKitap',
    },
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
              { label: 'Türkiye’yi Keşfet', href: '/turizm' },
              { label, href: `/turizm/${kategori}` },
              { label: blog.title },
            ]}
          />

          <article className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 sm:p-10 md:p-12">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Link
                  href={`/turizm/${kategori}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                >
                  {label}
                </Link>
                {blog.date && (
                  <time dateTime={blog.date} className="text-sm text-slate-500">
                    {new Date(blog.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-slate-900 leading-tight mb-6"
                style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}
              >
                {blog.title}
              </h1>

              {cover && (
                <div className="relative w-full aspect-[21/9] sm:aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-10 ring-1 ring-slate-200">
                  <Image src={cover} alt={blog.title} fill className="object-cover" priority sizes="(max-width: 896px) 100vw, 896px" />
                </div>
              )}

              <div
                className="blog-content prose prose-slate prose-lg max-w-none text-slate-800 [&_p]:text-slate-700 [&_li]:text-slate-700"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              <div className="mt-10 sm:mt-12">
                <BlogShareButtons url={shareUrl} title={blog.title} />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/30 flex items-center justify-center text-[var(--primary)] font-bold text-lg shrink-0">
                  GK
                </div>
                <div>
                  <p className="font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
                    GezginKitap Keşif Editörü
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Türkiye rotaları ve kültür içerikleri — turizm rehberi (örnek veri).</p>
                </div>
              </div>
            </div>
          </article>

          <section className="mt-12 sm:mt-16" aria-labelledby="related-heading">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 id="related-heading" className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
                  Diğer yazılar
                </h2>
                <p className="text-slate-600 text-sm mt-1">Aynı kategoride devam eden okumalar</p>
              </div>
              <Link
                href={`/turizm/${kategori}`}
                className="inline-flex items-center justify-center text-sm font-semibold text-[var(--primary)] hover:underline underline-offset-2 min-h-[44px]"
              >
                Tüm listeye dön
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((b) => (
                <TurizmBlogCard key={b.id} blog={b} kategori={kategori} />
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-2xl border border-dashed border-slate-200 bg-[var(--background)]/80 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
              Tüm kategorilere göz at
            </h2>
            <ul className="flex flex-wrap gap-2">
              {TURIZM_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/turizm/${c.id}`}
                    className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold border transition-colors min-h-[44px] items-center ${
                      c.id === kategori
                        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[var(--primary)]/35'
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
