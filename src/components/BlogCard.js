import Image from 'next/image'
import Link from 'next/link'

export default function BlogCard({ blog }) {
  const href = `/blog/${blog.slug}`
  const hasCover = blog.cover_image

  return (
    <article className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={href} className="block">
        <div className="relative w-full aspect-[16/10] bg-slate-200">
          {hasCover ? (
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Görsel yok</div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-slate-800 line-clamp-2">{blog.title}</h3>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {blog.content?.replace(/<[^>]+>/g, '').slice(0, 120) || ''}...
          </p>
          <span className="inline-block mt-3 text-amber-600 text-sm font-medium">Devamını oku →</span>
        </div>
      </Link>
    </article>
  )
}
