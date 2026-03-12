import Image from 'next/image'
import Link from 'next/link'

export default function NewsCard({ news }) {
  const href = `/haber/${news.slug}`
  const hasCover = news.cover_image

  return (
    <article className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <Link href={href} className="block">
        <div className="relative w-full aspect-[16/10] bg-slate-200">
          {hasCover ? (
            <Image
              src={news.cover_image}
              alt={news.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Görsel yok</div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-slate-800 line-clamp-2">{news.title}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {news.published_at
              ? new Date(news.published_at).toLocaleDateString('tr-TR', { dateStyle: 'medium' })
              : ''}
          </p>
          <span className="inline-block mt-3 text-amber-600 text-sm font-medium">Oku →</span>
        </div>
      </Link>
    </article>
  )
}
