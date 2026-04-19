import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'

function gezginSubtitle(text) {
  if (!text || !String(text).trim()) return null
  const s = String(text).replace(/\s+/g, ' ').trim()
  return s.length > 160 ? `${s.slice(0, 160)}…` : s
}

export default function BlogPostArticle({ blog, html, coverUrl, gezgin, breadcrumbItems, backLink }) {
  const sub = gezgin?.name ? gezginSubtitle(gezgin.description) : null

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-3xl">
        <Breadcrumb items={breadcrumbItems} />

        <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{blog.title}</h1>
            {blog.published_at && (
              <p className="text-slate-500 text-sm mb-6">
                {new Date(blog.published_at).toLocaleDateString('tr-TR', { dateStyle: 'long' })}
              </p>
            )}
            {coverUrl && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-slate-100">
                <Image src={coverUrl} alt={blog.title} fill className="object-cover" priority />
              </div>
            )}
            <div
              className="blog-content prose prose-slate max-w-none text-slate-800 [&_p]:text-slate-800 [&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900 [&_li]:text-slate-700 [&_a]:text-amber-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <div className="mt-10 pt-8 border-t border-slate-200 flex items-center gap-3">
              {gezgin?.name ? (
                <>
                  <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-slate-200 ring-2 ring-amber-100 shadow-sm">
                    {gezgin.avatarUrl ? (
                      <Image src={gezgin.avatarUrl} alt="" width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-lg font-semibold">
                        {gezgin.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">{gezgin.name}</p>
                    {sub ? <p className="text-sm text-slate-500 mt-0.5 line-clamp-3">{sub}</p> : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg shrink-0">
                    GP
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">GezginKitap Editör</p>
                    <p className="text-sm text-slate-500">İçerik ekibi</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </article>

        <div className="mt-8">
          <Link href={backLink.href} className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLink.label}
          </Link>
        </div>
      </div>
    </div>
  )
}
