'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import turkiyeIlIlce from '../../data/turkiye-il-ilce'

const STORAGE_PATH = 'scan-images'

const SHARING_CONSENT_TEXT = "Paylaştığınız fotoğraf, isim ve mesajlar KVKK yönetmeliği çerçevesinde web sitemizde ve gezgin kitapla ilgili tüm mecralarda yayınlanabilir."

export default function ScanForm({ package: pkg }) {
  const router = useRouter()
  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreeKvkk, setAgreeKvkk] = useState(false)
  const [agreeSharing, setAgreeSharing] = useState(false)
  const provinces = turkiyeIlIlce.provinces || []
  const districts = (turkiyeIlIlce.districts || []).filter((d) => String(d.province_id) === String(provinceId))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const province = provinces.find((p) => String(p.id) === String(provinceId))
    const district = districts.find((d) => String(d.id) === String(districtId))
    if (!province) {
      setError('Önce ilini seçelim — böylece kitabın nerede olduğunu bilelim.')
      return
    }
    if (!district) {
      setError('İlçeyi de seç; konum tam olarak böyle kaydolur.')
      return
    }
    if (!message.trim()) {
      setError('Kitaba mutlaka kısa bir not bırak; yolculuk böyle anlam kazanır.')
      return
    }
    const latitude = district.lat != null ? Number(district.lat) : Number(province.lat)
    const longitude = district.lng != null ? Number(district.lng) : Number(province.lng)

    setLoading(true)
    const supabase = createClient()
    let imagePath = null

    if (file) {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${STORAGE_PATH}/${pkg.id}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
      if (!uploadError) imagePath = path
    }

    const { data: inserted, error: insertError } = await supabase
      .from('package_scans')
      .insert({
        package_id: pkg.id,
        latitude,
        longitude,
        province: province.name,
        district: district?.name || null,
        message: message.trim(),
        image_path: imagePath,
      })
      .select('id')
      .single()

    setLoading(false)
    if (insertError) {
      setError(insertError.message || 'Kayıt başarısız.')
      return
    }
    if (!inserted?.id || !pkg.qr_slug) {
      setError('Yönlendirme yapılamadı. Lütfen tekrar dene.')
      return
    }
    router.push(`/qr/${pkg.qr_slug}/tesekkur?scan=${inserted.id}`)
  }

  const bookLabel = pkg.title || pkg.code

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--primary)]/12 via-[var(--background)] to-[var(--accent)]/10 px-4 py-8 sm:py-10">
      <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[var(--secondary)]/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-[var(--primary)]/12 blur-3xl" aria-hidden />

      <div className="relative z-10 max-w-lg mx-auto">
        <header className="text-center mb-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 animate-mascot-shrug" aria-hidden>
            <Image
              src="/logo.png"
              alt="GezginKitap maskotu"
              fill
              className="object-contain drop-shadow-md"
              sizes="(max-width: 640px) 96px, 112px"
              priority
            />
          </div>
          <p
            className="text-lg sm:text-xl font-bold text-[var(--foreground)] tracking-tight"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Gezgin Kitap
          </p>
          <p className="text-sm text-[var(--text-light)] mt-2 max-w-sm mx-auto leading-relaxed">
            Bu kitap yollarda dolaşıyor; sen de bir satır ekle, bir sonraki okuyucuya selam gönder.
          </p>
          <h1 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-4 px-2 leading-snug">
            {bookLabel}
          </h1>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-slate-100/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Şu an hangi ildesin?</label>
                <select
                  value={provinceId}
                  onChange={(e) => { setProvinceId(e.target.value); setDistrictId('') }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 bg-white text-sm"
                  required
                >
                  <option value="">İl seç</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İlçe</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 bg-white text-sm"
                  required
                >
                  <option value="">İlçe seç</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bu kitaba bir not bırak
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 bg-white text-sm placeholder:text-slate-400"
                placeholder="Kısaca nerede bulduğunu, hissettiklerini veya bir sonraki okuyucuya bir cümle..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fotoğraf <span className="font-normal text-slate-500">(istersen)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-[var(--primary)]/10 file:px-3 file:py-1.5 file:font-medium file:text-[var(--primary)]"
              />
              <p className="text-xs text-slate-500 mt-1">Anı karesi eklemek tamamen sana kalmış.</p>
            </div>

            <div className="space-y-3 rounded-xl bg-slate-50 p-3 sm:p-4 border border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeKvkk}
                  onChange={(e) => setAgreeKvkk(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 leading-snug">
                  <Link href="/kvkk" target="_blank" className="text-[var(--primary)] underline hover:no-underline">KVKK Aydınlatma Metni</Link>
                  {' ve '}
                  <Link href="/gizlilik" target="_blank" className="text-[var(--primary)] underline hover:no-underline">Gizlilik Sözleşmesi</Link>
                  {'\'ni okudum, kabul ediyorum.'}
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeSharing}
                  onChange={(e) => setAgreeSharing(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 leading-snug">
                  {SHARING_CONSENT_TEXT} Onaylıyorum.
                </span>
              </label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !agreeKvkk || !agreeSharing}
              className="w-full rounded-xl bg-[var(--primary)] text-white font-semibold py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:opacity-90"
            >
              {loading ? 'Gönderiliyor...' : 'Notumu gönder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
