import { createClient } from '@/lib/supabase-server'
import { getStorageUrl } from '@/lib/utils'
import BlogCard from '@/components/BlogCard'

export const metadata = {
  title: 'Blog | GezginKitap',
  description: 'GezginKitap projesi blog yazıları.',
}

export default async function BlogListPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const withCover = (blogs || []).map((b) => ({
    ...b,
    cover_image: b.cover_image ? getStorageUrl(b.cover_image) : getStorageUrl(`blogs/${b.id}.jpg`),
  }))

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Gezgin Blogları</h1>
        <p className="text-slate-600 mb-8">Gezginlerimizden gelen blog yazıları...</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {withCover.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
        {(!blogs || blogs.length === 0) && (
          <p className="text-slate-500 text-center py-16">Henüz gezgin blog yazısı yok.</p>
        )}
      </div>
    </div>
  )
}
