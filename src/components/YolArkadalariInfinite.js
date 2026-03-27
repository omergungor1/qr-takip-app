'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

function ScanCard({ scan }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="p-4 flex-1">
        <p className="font-medium text-slate-800">{scan.province || '—'}</p>
        <p className="text-sm text-slate-500">{scan.district || ''}</p>
        {scan.message && (
          <p className="text-sm text-slate-600 mt-2 line-clamp-4">{scan.message}</p>
        )}
      </div>
      {scan.image_path ? (
        <div className="relative w-full aspect-[4/3] bg-slate-100 mt-auto">
          <Image
            src={scan.image_path}
            alt="Paylaşım"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-400 text-sm mt-auto">
          Görsel yok
        </div>
      )}
    </article>
  )
}

export default function YolArkadalariInfinite() {
  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const offsetRef = useRef(0)
  const hasMoreRef = useRef(true)
  const loadingRef = useRef(false)
  const sentinelRef = useRef(null)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return
    loadingRef.current = true
    setLoading(true)
    setError('')
    try {
      const o = offsetRef.current
      const res = await fetch(`/api/public/gallery-scans?offset=${o}&limit=10`)
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'Yüklenemedi.')
        return
      }
      const newItems = json.items || []
      offsetRef.current = json.nextOffset ?? o + newItems.length
      hasMoreRef.current = Boolean(json.hasMore)
      setHasMore(hasMoreRef.current)
      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.id))
        const merged = newItems.filter((x) => !seen.has(x.id))
        return [...prev, ...merged]
      })
    } catch {
      setError('Bağlantı hatası.')
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  const bootRef = useRef(false)
  useEffect(() => {
    if (bootRef.current) return
    bootRef.current = true
    loadMore()
  }, [loadMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { root: null, rootMargin: '180px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loadMore])

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
          Yol Arkadaşlarım
        </h1>
        <p className="text-[var(--text-light)] mb-8 max-w-2xl">
          Her kitap bir yolcu, her okur bir yol arkadaşı.
        </p>

        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm px-4 py-3" role="alert">
            {error}
          </p>
        )}

        {items.length === 0 && !loading && !error && (
          <div className="py-16 text-center text-slate-500 rounded-2xl bg-slate-50 border border-slate-100">
            Henüz paylaşım yok.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>

        <div ref={sentinelRef} className="h-8 w-full shrink-0" aria-hidden />

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-slate-500">
            <span
              className="inline-block h-9 w-9 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"
              aria-hidden
            />
            <span className="text-sm font-medium">Yükleniyor…</span>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <p className="text-center text-sm text-slate-400 py-6">Tüm paylaşımlar yüklendi.</p>
        )}
      </div>
    </section>
  )
}
