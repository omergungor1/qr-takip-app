'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

export default function GalleryLightbox({ images, title }) {
  const items = useMemo(() => (images || []).filter(Boolean), [images])
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = (i) => {
    setIndex(i)
    setOpen(true)
  }

  const close = () => setOpen(false)

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, next, prev])

  if (!items.length) return null

  const active = items[index]

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex items-end justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
          Galeri
        </h2>
        <span className="text-xs text-slate-500">{items.length} görsel</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => openAt(i)}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 hover:ring-[var(--primary)]/40 transition"
            aria-label="Görseli büyüt"
          >
            <Image src={src} alt={title || ''} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0" onClick={close} aria-label="Kapat" />

          <div className="relative z-10 w-full max-w-5xl">
            <div className="relative w-full aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden bg-black">
              <Image src={active} alt={title || ''} fill className="object-contain" sizes="100vw" priority />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={prev}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 text-white border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/15"
              >
                ← Önceki
              </button>
              <span className="text-white/80 text-xs">
                {index + 1} / {items.length}
              </span>
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 text-white border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/15"
              >
                Sonraki →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

