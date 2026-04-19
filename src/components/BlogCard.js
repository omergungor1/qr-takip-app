import Image from 'next/image'
import Link from 'next/link'

function gezginDescriptionSnippet(text, max = 100) {
  if (!text || !String(text).trim()) return ''
  const s = String(text).replace(/\s+/g, ' ').trim()
  return s.length > max ? `${s.slice(0, max)}…` : s
}

export default function BlogCard({ blog, gezgin, articleBasePath = '/blog' }) {
  const base = String(articleBasePath || '/blog').replace(/\/$/, '')
  const href = `${base}/${blog.slug}`
  const hasCover = blog.cover_image
  const gezginDesc = gezgin?.name ? gezginDescriptionSnippet(gezgin.description) : ''

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
          {gezgin?.name ? (
            <div className="flex gap-3 items-start mb-3 pb-3 border-b border-slate-100">
              <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white shadow-sm">
                {gezgin.avatarUrl ? (
                  <Image
                    src={gezgin.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm font-semibold">
                    {gezgin.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 text-sm leading-snug">{gezgin.name}</p>
                {gezginDesc ? (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">{gezginDesc}</p>
                ) : null}
              </div>
            </div>
          ) : null}
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
