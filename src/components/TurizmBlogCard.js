import Image from 'next/image'
import Link from 'next/link'

export default function TurizmBlogCard({ blog, kategori }) {
  const href = `/turizm/${kategori}/${blog.slug}`
  const cover = blog.cover_image || blog.image

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-[var(--primary)]/25 transition-all duration-300">
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-2xl">
        <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Görsel yok</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-80 pointer-events-none" aria-hidden />
        </div>
        <div className="p-4 sm:p-5">
          {blog.date && (
            <time dateTime={blog.date} className="text-xs font-medium text-[var(--primary)] uppercase tracking-wide">
              {new Date(blog.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          )}
          <h3 className="font-bold text-slate-900 text-lg sm:text-xl mt-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
            {blog.title}
          </h3>
          <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">{blog.description}</p>
          <span className="inline-flex items-center gap-1 mt-4 text-[var(--primary)] text-sm font-semibold">
            Yazıyı oku
            <span aria-hidden className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </div>
      </Link>
    </article>
  )
}
