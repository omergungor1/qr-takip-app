import { notFound } from 'next/navigation'
import { getStorageUrl } from '@/lib/utils'
import { contentToHtml } from '@/lib/markdown'
import { getBlogPostBySlug } from '@/lib/blog-post'
import BlogPostArticle from '@/components/BlogPostArticle'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const row = await getBlogPostBySlug(slug)
  const title = row?.blog?.title
  return { title: title ? `${title} | Gezi-Görü-Anlatı | GezginKitap` : 'Gezi-Görü-Anlatı | GezginKitap' }
}

export default async function GezginBloglariSlugPage({ params }) {
  const { slug } = await params
  const row = await getBlogPostBySlug(slug)
  if (!row) notFound()

  const { blog, gezgin } = row
  const coverUrl = blog.cover_image ? getStorageUrl(blog.cover_image) : null
  const html = await contentToHtml(blog.content)

  return (
    <BlogPostArticle
      blog={blog}
      html={html}
      coverUrl={coverUrl}
      gezgin={gezgin}
      breadcrumbItems={[
        { label: 'Ana sayfa', href: '/' },
        { label: 'Gezi-Görü-Anlatı', href: '/gezgin-yazilari' },
        { label: blog.title },
      ]}
      backLink={{ href: '/gezgin-yazilari', label: 'Tüm gezgin yazıları' }}
    />
  )
}
