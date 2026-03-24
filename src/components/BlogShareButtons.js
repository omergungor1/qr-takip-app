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

  const baseBtnClass =
    'inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 min-h-[44px] shadow-sm hover:shadow'
  const btnClass = {
    native:
      `${baseBtnClass} border-slate-200 bg-white text-slate-700 hover:border-[var(--primary)]/45 hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]`,
    copy:
      `${baseBtnClass} border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100`,
    wa:
      `${baseBtnClass} border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100`,
    x:
      `${baseBtnClass} border-slate-300 bg-slate-900 text-white hover:bg-slate-800`,
    fb:
      `${baseBtnClass} border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100`,
    linkedin:
      `${baseBtnClass} border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100`,
  }

  if (!href) {
    return <div className="rounded-2xl border border-slate-200 bg-slate-50 h-28 animate-pulse" aria-hidden />
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/70 to-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-slate-800" style={{ fontFamily: 'var(--font-heading), ui-sans-serif, system-ui, sans-serif' }}>
          Paylaş
        </p>
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Sosyal</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button type="button" onClick={shareNative} className={btnClass.native}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Sistem
          </button>
        )}
        <button type="button" onClick={copyLink} className={btnClass.copy}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 10h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          {copied ? 'Kopyalandı' : 'Link'}
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className={btnClass.wa}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.52 3.48A11.84 11.84 0 0012.08 0C5.56 0 .25 5.3.25 11.82c0 2.08.54 4.11 1.56 5.89L0 24l6.46-1.7a11.8 11.8 0 005.62 1.43h.01c6.52 0 11.83-5.3 11.83-11.82 0-3.15-1.23-6.1-3.4-8.43zM12.09 21.7h-.01a9.8 9.8 0 01-5-1.37l-.36-.22-3.83 1 1.02-3.73-.24-.39a9.77 9.77 0 01-1.5-5.2c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.09 1.02 6.94 2.88a9.74 9.74 0 012.87 6.94c0 5.4-4.4 9.8-9.81 9.8zm5.38-7.35c-.3-.15-1.8-.88-2.07-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.04-.18-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.24-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.52.07-.8.37s-1.04 1.01-1.04 2.46 1.06 2.85 1.2 3.05c.15.2 2.08 3.17 5.04 4.44.7.3 1.26.49 1.69.62.71.23 1.35.2 1.86.12.57-.08 1.8-.74 2.06-1.46.25-.73.25-1.36.17-1.49-.08-.12-.28-.2-.58-.35z" />
          </svg>
          WhatsApp
        </a>
        <a href={x} target="_blank" rel="noopener noreferrer" className={btnClass.x}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.26l-4.9-6.48L6.4 22H3.3l7.24-8.27L.8 2h6.4l4.43 5.86L18.9 2zm-1.1 18h1.72L6.26 3.9H4.42L17.8 20z" />
          </svg>
          X
        </a>
        <a href={fb} target="_blank" rel="noopener noreferrer" className={btnClass.fb}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.48 0-1.94.92-1.94 1.86v2.23h3.3l-.53 3.49h-2.77V24C19.61 23.1 24 18.1 24 12.07z" />
          </svg>
          Facebook
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={btnClass.linkedin}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43v6.31zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77A1.77 1.77 0 000 1.77v20.46C0 23.2.8 24 1.77 24h20.46A1.77 1.77 0 0024 22.23V1.77A1.77 1.77 0 0022.23 0z" />
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  )
}
