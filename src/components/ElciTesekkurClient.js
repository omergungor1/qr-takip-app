'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { toPng } from 'html-to-image'
import { getPublicSiteBase } from '@/lib/site-url'

function buildShareText(bookTitle, registrationOrder, siteBase) {
  const home = siteBase || ''
  return `Gezgin Kitap Elçisi oldum! «${bookTitle}» yolculuğuna ${registrationOrder}. sıradan katkıda bulundum. Sen de bir kitabı yola çıkar: ${home || 'GezginKitap'}`
}

/** Sertifika köşe süsü (PNG çıktısına dahil) */
function CertFlourish({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 4h14v14H4V4zm4 4h6v6H8V8z"
        stroke="#8b6914"
        strokeWidth="1.25"
        fill="rgba(184,134,11,0.08)"
      />
      <path
        d="M22 4c0 6-4 10-10 10M4 22c6 0 10-4 10-10"
        stroke="#c9a227"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="11" cy="11" r="2" fill="#c9a227" opacity="0.35" />
      <path d="M18 18l6 6M20 14l10 10" stroke="#a67c00" strokeWidth="0.75" opacity="0.5" />
    </svg>
  )
}

export default function ElciTesekkurClient({
  slug,
  scanId,
  bookTitle,
  bookCode,
  registrationOrder,
  issuedDateFormatted,
}) {
  const certRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [shareErr, setShareErr] = useState('')
  const [sharePanelOpen, setSharePanelOpen] = useState(false)
  const [sharingImage, setSharingImage] = useState(false)

  const siteBase = getPublicSiteBase()
  const [origin, setOrigin] = useState('')
  useEffect(() => {
    setOrigin(typeof window !== 'undefined' ? window.location.origin : '')
  }, [])
  const effectiveBase = siteBase || origin
  const shareUrl = effectiveBase ? `${effectiveBase}/qr/${slug}/tesekkur?scan=${scanId}` : ''
  const shareText = buildShareText(bookTitle, registrationOrder, effectiveBase)
  const belgeNo = scanId.replace(/-/g, '').slice(0, 10).toUpperCase()

  useEffect(() => {
    const t = setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.55 },
        colors: ['#FF6B3D', '#FFB347', '#2F855A', '#F6E05E', '#C05621'],
        ticks: 280,
      })
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 65,
          origin: { x: 0 },
          colors: ['#FF6B3D', '#FFB347'],
        })
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 65,
          origin: { x: 1 },
          colors: ['#2F855A', '#FFB347'],
        })
      }, 280)
    }, 150)
    return () => clearTimeout(t)
  }, [])

  const capturePng = useCallback(async () => {
    if (!certRef.current) return null
    await document.fonts.ready.catch(() => { })
    return toPng(certRef.current, {
      cacheBust: true,
      pixelRatio: 2.75,
      backgroundColor: '#f5ebe0',
    })
  }, [])

  const handleDownload = async () => {
    setShareErr('')
    setDownloading(true)
    try {
      const dataUrl = await capturePng()
      if (!dataUrl) return
      const a = document.createElement('a')
      a.download = `gezgin-kitap-elci-sertifikasi-${bookCode || 'kitap'}.png`
      a.href = dataUrl
      a.click()
    } catch (e) {
      setShareErr('Görsel oluşturulurken bir sorun oluştu. Sayfayı yenileyip tekrar deneyin.')
    } finally {
      setDownloading(false)
    }
  }

  /** iOS/Android: sistem paylaşımında PNG + metin; kullanıcı listeden WhatsApp vb. seçer */
  const shareImageViaSystem = useCallback(async () => {
    setShareErr('')
    setSharingImage(true)
    try {
      const dataUrl = await capturePng()
      if (!dataUrl) return
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], 'gezgin-kitap-elci-sertifikasi.png', { type: 'image/png' })
      const text = `${shareText}${shareUrl ? `\n${shareUrl}` : ''}`

      if (typeof navigator.share !== 'function') {
        setShareErr('İndir ile kaydedip paylaşabilirsin.')
        return
      }
      const payload = {
        files: [file],
        text,
        title: 'Gezgin Kitap Elçisi',
      }
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share(payload)
        return
      }
      try {
        await navigator.share(payload)
        return
      } catch (inner) {
        if (inner?.name === 'AbortError') throw inner
        setShareErr('İndir ile kaydedip istediğin uygulamadan paylaş.')
      }
    } catch (e) {
      if (e?.name === 'AbortError') return
      setShareErr('İndir ile kaydedip paylaşmayı dene.')
    } finally {
      setSharingImage(false)
    }
  }, [capturePng, shareText, shareUrl])

  const handlePaylaşClick = () => {
    setShareErr('')
    setSharePanelOpen(true)
  }

  const certPaper = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    width: '100%',
    maxWidth: 420,
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--primary)]/14 via-[var(--background)] to-[var(--accent)]/12 px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute -top-24 right-0 w-72 h-72 rounded-full bg-[var(--secondary)]/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-[var(--primary)]/15 blur-3xl" aria-hidden />

      <div className="relative z-10 max-w-lg mx-auto">
        <header className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-3"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Teşekkürler, Gezgin Kitap Elçisi!
          </h1>
          <p className="text-[var(--text-light)] text-sm sm:text-base leading-relaxed">
            Kaydın yolculuğa işlendi. Bu kitabın hikâyesinde <strong className="text-[var(--foreground)]">senin de imzan var</strong>
            — zincirin önemli bir halkası oldun. Aşağıdaki sertifikayı paylaşarak başkalarını da harekete geçirebilirsin.
          </p>
        </header>

        {/* Dışa aktarılan alan: süslü çerçeve + logo */}
        <div
          ref={certRef}
          style={{
            ...certPaper,
            background: 'linear-gradient(145deg, #fdf8f0 0%, #f0e6d8 45%, #faf5eb 100%)',
            padding: 14,
            borderRadius: 4,
            border: '4px solid #a67c00',
            boxShadow: 'inset 0 0 0 2px #e8d5a3, inset 0 0 0 6px #8b6914, 0 12px 40px rgba(45,55,72,0.15)',
          }}
        >
          <div
            style={{
              position: 'relative',
              border: '2px double rgba(139,105,20,0.65)',
              borderRadius: 2,
              padding: '22px 18px 20px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,248,242,0.35) 100%)',
              minHeight: 320,
            }}
          >
            <CertFlourish className="absolute top-1 left-1 pointer-events-none" />
            <CertFlourish className="absolute top-1 right-1 pointer-events-none" style={{ transform: 'scaleX(-1)' }} />
            <CertFlourish className="absolute bottom-1 left-1 pointer-events-none" style={{ transform: 'scaleY(-1)' }} />
            <CertFlourish
              className="absolute bottom-1 right-1 pointer-events-none"
              style={{ transform: 'scale(-1, -1)' }}
            />

            <div
              style={{
                textAlign: 'center',
                borderBottom: '1px solid rgba(184,134,11,0.45)',
                paddingBottom: 14,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  margin: '0 auto 10px',
                  borderRadius: '50%',
                  border: '4px double #b8860b',
                  background: 'linear-gradient(160deg, #fff 0%, #fff8f0 100%)',
                  boxShadow: '0 4px 14px rgba(139,105,20,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                }}
              >
                <img
                  src="/logo.png"
                  alt=""
                  width={72}
                  height={72}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p style={{ fontSize: 10, letterSpacing: '0.42em', color: '#6b4f2a', textTransform: 'uppercase', marginBottom: 6 }}>
                Gezgin Kitap
              </p>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#2c1810',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                Elçi Sertifikası
              </p>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#5c4a3d', lineHeight: 1.5, marginBottom: 12, padding: '0 4px' }}>
              Tebrikler — Gezgin Kitap Elçisi oldun!
            </p>

            <p
              style={{
                textAlign: 'center',
                fontSize: 19,
                fontWeight: 700,
                color: '#1a1528',
                lineHeight: 1.35,
                marginBottom: 16,
                padding: '0 6px',
              }}
            >
              « {bookTitle} »
            </p>

            <div style={{ fontSize: 13, color: '#3d342c', lineHeight: 1.65, textAlign: 'center', marginBottom: 18 }}>
              <p style={{ marginBottom: 10 }}>
                Türkiye genelinde kitapların yolculuğuna katkı sağlayan değerli okuyucumuz; bu eserin yolculuğuna{' '}
                <strong style={{ color: '#8b4513' }}>{registrationOrder}. sıradan</strong> eklenen kayıt olarak{' '}
                <strong>«Gezgin Kitap Elçisi»</strong> unvanını hak etmişsiniz.
              </p>
              <p style={{ fontSize: 12, color: '#5c534a' }}>
                Katkınız, okuma kültürünün yayılmasındaki zincirin vazgeçilmez bir parçasıdır.
              </p>
            </div>

            <div
              style={{
                borderTop: '1px solid rgba(184,134,11,0.35)',
                paddingTop: 12,
                fontSize: 12,
                color: '#4a4038',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#6b5d4f' }}>Kayıt sırası</span>
                <span style={{ fontWeight: 600 }}>{registrationOrder}. yol arkadaşı</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#6b5d4f' }}>Tarih</span>
                <span style={{ fontWeight: 600 }}>{issuedDateFormatted}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ color: '#6b5d4f' }}>Belge no</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '-0.02em' }}>{belgeNo}</span>
              </div>
            </div>

            <p
              style={{
                textAlign: 'center',
                fontSize: 11,
                color: '#7a6c5f',
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px dashed rgba(184,134,11,0.35)',
              }}
            >
              Teşekkürlerimizle — <span style={{ fontWeight: 700, color: '#8b4513' }}>GezginKitap</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-light)] mt-4 max-w-sm mx-auto">
          İndir veya Paylaş — açılan menüden uygulamanı seç.
        </p>

        {shareErr && (
          <p className="text-center text-amber-800 text-sm mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            {shareErr}
          </p>
        )}

        <div className="mt-8 space-y-4">
          <div className="flex flex-row gap-2 sm:gap-3 justify-center max-w-md mx-auto w-full">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex flex-1 min-w-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white font-semibold py-3 px-3 sm:px-6 text-sm shadow-sm hover:opacity-95 disabled:opacity-60"
              style={{ color: '#ffffff' }}
            >
              {downloading ? '…' : 'İndir'}
            </button>
            <button
              type="button"
              onClick={handlePaylaşClick}
              className="inline-flex flex-1 min-w-0 items-center justify-center gap-2 rounded-xl border-2 border-[var(--primary)] font-semibold py-3 px-3 sm:px-6 text-sm hover:bg-[var(--primary)]/5"
              style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            >
              Paylaş
            </button>
          </div>

          {sharePanelOpen && (
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={shareImageViaSystem}
                  disabled={sharingImage}
                  className="flex items-center justify-center rounded-xl text-xs font-semibold py-2.5 disabled:opacity-60"
                  style={{ backgroundColor: '#25D366', color: '#ffffff' }}
                >
                  {sharingImage ? '…' : 'WhatsApp'}
                </button>
                <button
                  type="button"
                  onClick={shareImageViaSystem}
                  disabled={sharingImage}
                  className="flex items-center justify-center rounded-xl text-xs font-semibold py-2.5 disabled:opacity-60"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                >
                  {sharingImage ? '…' : 'X'}
                </button>
                <button
                  type="button"
                  onClick={shareImageViaSystem}
                  disabled={sharingImage}
                  className="flex items-center justify-center rounded-xl text-xs font-semibold py-2.5 disabled:opacity-60"
                  style={{ backgroundColor: '#1877F2', color: '#ffffff' }}
                >
                  {sharingImage ? '…' : 'Facebook'}
                </button>
                <button
                  type="button"
                  onClick={shareImageViaSystem}
                  disabled={sharingImage}
                  className="flex items-center justify-center rounded-xl text-xs font-semibold py-2.5 disabled:opacity-60"
                  style={{ backgroundColor: '#0A66C2', color: '#ffffff' }}
                >
                  {sharingImage ? '…' : 'LinkedIn'}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-row gap-2 sm:gap-3 max-w-md mx-auto w-full pt-2">
            <Link
              href={bookCode ? `/book/${bookCode}` : '/'}
              className="group inline-flex flex-1 min-w-0 items-center justify-center gap-2 rounded-xl border-2 border-[var(--primary)]/35 bg-gradient-to-br from-white via-white to-[var(--primary)]/[0.08] py-3 px-3 text-sm font-semibold text-[var(--foreground)] shadow-[0_2px_12px_rgba(255,107,61,0.12)] transition-all hover:border-[var(--primary)]/55 hover:shadow-[0_4px_18px_rgba(255,107,61,0.18)]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/12 text-[var(--primary)] ring-1 ring-[var(--primary)]/20 group-hover:bg-[var(--primary)]/18">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              <span className="truncate">Pasaport</span>
            </Link>
            <Link
              href="/"
              className="inline-flex flex-1 min-w-0 items-center justify-center rounded-xl bg-[var(--accent)] py-3 px-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
            >
              Anasayfa
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
