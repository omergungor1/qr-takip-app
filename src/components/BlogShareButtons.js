'use client'

import { useCallback, useLayoutEffect, useState } from 'react'

export default function BlogShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false)
  const [href, setHref] = useState(() => (url && /^https?:\/\//.test(url) ? url : ''))

  useLayoutEffect(() => {
    if (url && /^https?:\/\//.test(url)) {
      setHref(url)
      return
    }
    if (typeof window !== 'undefined') setHref(window.location.href)
  }, [url])

  const encodedUrl = encodeURIComponent(href || '')
  const encodedTitle = encodeURIComponent(title)

  const shareNative = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share && href) {
      try {
        await navigator.share({ title, url: href })
      } catch {
        /* iptal veya hata — sessiz */
      }
    }
  }, [title, href])

  const copyLink = useCallback(async () => {
    if (!href) return
    try {
      await navigator.clipboard.writeText(href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* yok say */
    }
  }, [href])

  const wa = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  const x = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  const btnClass =
    'inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 hover:text-[var(--primary)] transition-colors min-h-[44px]'

  if (!href) {
    return <div className="rounded-2xl border border-slate-200 bg-slate-50 h-28 animate-pulse" aria-hidden />
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-4 sm:p-5">
      <p className="text-sm font-bold text-slate-800 mb-3" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
        Paylaş
      </p>
      <div className="flex flex-wrap gap-2">
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button type="button" onClick={shareNative} className={btnClass}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Sistem
          </button>
        )}
        <button type="button" onClick={copyLink} className={btnClass}>
          {copied ? 'Kopyalandı' : 'Linki kopyala'}
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className={btnClass}>
          WhatsApp
        </a>
        <a href={x} target="_blank" rel="noopener noreferrer" className={btnClass}>
          X
        </a>
        <a href={fb} target="_blank" rel="noopener noreferrer" className={btnClass}>
          Facebook
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={btnClass}>
          LinkedIn
        </a>
      </div>
    </div>
  )
}
