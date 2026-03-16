'use client'

import { useRef } from 'react'
import Image from 'next/image'

export default function GallerySection({ scans }) {
  const scrollRef = useRef(null)

  const list = scans || []

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const step = 280
    scrollRef.current.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
          Son Fotoğraflar
        </h2>
        <p className="text-[var(--text-light)] mb-8">
          Son check-in fotoğrafları
        </p>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            aria-label="Sol"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
            aria-label="Sağ"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {list.length === 0 ? (
              <div className="w-full py-12 text-center text-slate-500 rounded-2xl bg-slate-50">
                Henüz paylaşım yok.
              </div>
            ) : (
              list.map((scan) => (
                <div
                  key={scan.id}
                  className="flex-shrink-0 w-[260px] sm:w-[280px] snap-start rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <p className="font-medium text-slate-800">{scan.province || '—'}</p>
                    <p className="text-sm text-slate-500">{scan.district || ''}</p>
                    {scan.message && (
                      <p className="text-sm text-slate-600 mt-2 line-clamp-3">{scan.message}</p>
                    )}
                  </div>
                  {scan.image_path ? (
                    <div className="relative w-full aspect-[4/3] bg-slate-100">
                      <Image
                        src={scan.image_path}
                        alt="Paylaşım"
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                      Görsel yok
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
