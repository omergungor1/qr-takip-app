'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const QR_SIZE = 160

export default function AdminPackagesClient({ packages: initialPackages, qrBaseUrl }) {
  const [packages, setPackages] = useState(initialPackages)
  const [showForm, setShowForm] = useState(false)
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [qrSlug, setQrSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [qrDataUrls, setQrDataUrls] = useState({})
  const generatedRef = useRef({})

  const supabase = createClient()
  const baseUrl = qrBaseUrl ? qrBaseUrl.replace(/\/$/, '') : (typeof window !== 'undefined' ? window.location.origin : '')

  useEffect(() => {
    let cancelled = false
    const toGen = packages.filter((p) => p.qr_slug && !generatedRef.current[p.qr_slug])
    if (!toGen.length) return
    const load = async () => {
      let toDataURL
      try {
        const mod = await import('qrcode')
        toDataURL = mod.default?.toDataURL ?? mod.toDataURL
      } catch (err) {
        if (!cancelled) setQrDataUrls((prev) => ({ ...prev, ...Object.fromEntries(toGen.map((p) => [p.qr_slug, null])) }))
        toGen.forEach((p) => { generatedRef.current[p.qr_slug] = true })
        return
      }
      if (!toDataURL || cancelled) return
      const next = {}
      for (const pkg of toGen) {
        if (cancelled) break
        try {
          const url = `${baseUrl}/qr/${pkg.qr_slug}`
          const dataUrl = await toDataURL(url, { width: QR_SIZE, margin: 1 })
          next[pkg.qr_slug] = dataUrl
          generatedRef.current[pkg.qr_slug] = true
        } catch (e) {
          next[pkg.qr_slug] = null
          generatedRef.current[pkg.qr_slug] = true
        }
      }
      if (!cancelled && Object.keys(next).length) setQrDataUrls((prev) => ({ ...prev, ...next }))
    }
    load()
    return () => { cancelled = true }
  }, [packages, baseUrl])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!code.trim() || !qrSlug.trim()) return
    setSaving(true)
    const slug = qrSlug.trim().toLowerCase().replace(/\s+/g, '-')
    const { data, error } = await supabase.from('packages').insert({
      code: code.trim(),
      title: title.trim() || null,
      description: description.trim() || null,
      qr_slug: slug,
      is_active: true,
    }).select().single()
    setSaving(false)
    if (error) {
      alert(error.message)
      return
    }
    setPackages((prev) => [data, ...prev])
    setShowForm(false)
    setCode('')
    setTitle('')
    setDescription('')
    setQrSlug('')
  }

  const toggleActive = async (pkg) => {
    const { error } = await supabase
      .from('packages')
      .update({ is_active: !pkg.is_active })
      .eq('id', pkg.id)
    if (error) return
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, is_active: !p.is_active } : p)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-amber-500 text-white px-4 py-2 font-medium"
        >
          {showForm ? 'İptal' : 'Yeni paket'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl p-6 shadow border border-slate-200 space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kod</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">QR Slug (URL’de kullanılacak)</label>
            <input value={qrSlug} onChange={(e) => setQrSlug(e.target.value)} placeholder="ornek-paket" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400" />
          </div>
          <button type="submit" disabled={saving} className="rounded-xl bg-slate-800 text-white px-4 py-2 font-medium disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      )}

      {!qrBaseUrl && (
        <p className="text-amber-700 bg-amber-50 rounded-lg p-3 text-sm">
          QR URL’si için <a href="/admin/settings" className="underline">Ayarlar</a> sayfasından domain girin.
        </p>
      )}

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {packages.map((pkg) => (
            <li key={pkg.id} className="p-5 sm:p-6 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 min-h-[140px]">
              {/* QR solda, büyük; hover'da indir */}
              <div className="flex-shrink-0">
                {qrDataUrls[pkg.qr_slug] ? (
                  <a
                    href={qrDataUrls[pkg.qr_slug]}
                    download={`qr-${pkg.qr_slug}.png`}
                    className="relative block w-[112px] h-[112px] rounded-xl border border-slate-200 overflow-hidden bg-white group"
                  >
                    <img
                      src={qrDataUrls[pkg.qr_slug]}
                      alt={`QR ${pkg.qr_slug}`}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="text-white text-xs font-medium">İndir</span>
                    </span>
                  </a>
                ) : (
                  <div className="w-[112px] h-[112px] rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                    Yükleniyor…
                  </div>
                )}
              </div>

              {/* Başlık ve slug */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-lg">{pkg.title || pkg.code}</p>
                <p className="text-sm text-slate-500 mt-0.5">Slug: {pkg.qr_slug}</p>
              </div>

              {/* Düzenle + Hareketler + Aktif/Pasif */}
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <Link
                  href={`/admin/packages/${pkg.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] border border-slate-200"
                >
                  Düzenle
                </Link>
                <Link
                  href={`/admin/packages/${pkg.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Hareketler
                </Link>
                <button
                  type="button"
                  onClick={() => toggleActive(pkg)}
                  title="Aktif-Pasif yapmak için tıkla"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl border transition-colors ${pkg.is_active ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${pkg.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                  {pkg.is_active ? 'Aktif' : 'Pasif'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
