'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import turkiyeIlIlce from '../../data/turkiye-il-ilce'

const STORAGE_PATH = 'scan-images'

export default function ScanForm({ package: pkg, scans }) {
  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const provinces = turkiyeIlIlce.provinces || []
  const districts = (turkiyeIlIlce.districts || []).filter((d) => String(d.province_id) === String(provinceId))

  /* Kullanıcı konum verisi şimdilik kullanılmıyor; il/ilçe manuel seçiliyor. İlçe lat/lng ile kayıt yapılıyor.
  const [geoAttempted, setGeoAttempted] = useState(false)
  useEffect(() => {
    if (geoAttempted) return
    setGeoAttempted(true)
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const nearest = provinces.reduce((acc, p) => {
          const d = Math.hypot(p.lat - lat, p.lng - lng)
          return d < acc.d ? { d, id: p.id } : acc
        }, { d: Infinity, id: null })
        if (nearest.id) setProvinceId(String(nearest.id))
      },
      () => {}
    )
  }, [geoAttempted, provinces])
  */

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const province = provinces.find((p) => String(p.id) === String(provinceId))
    const district = districts.find((d) => String(d.id) === String(districtId))
    if (!province) {
      setError('Lütfen il seçin.')
      return
    }
    if (!district) {
      setError('Lütfen ilçe seçin. Konum ilçe bazında kaydedilir.')
      return
    }
    // package_scans koordinatları: ilçe seviyesinde (turkiye-il-ilce.js districts lat/lng)
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

    const { error: insertError } = await supabase.from('package_scans').insert({
      package_id: pkg.id,
      latitude,
      longitude,
      province: province.name,
      district: district?.name || null,
      message: message.trim() || null,
      image_path: imagePath,
    })

    setLoading(false)
    if (insertError) {
      setError(insertError.message || 'Kayıt başarısız.')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Paylaşımınız kaydedildi</h2>
        <p className="text-slate-600 mb-6">
          Bu paketin yolculuğuna katkıda bulunduğunuz için teşekkür ederiz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 text-white font-medium py-3 px-6"
          >
            Ana Sayfaya Git
          </a>
          <a
            href="/#map"
            className="inline-flex items-center justify-center rounded-xl border-2 border-amber-500 text-amber-600 font-medium py-3 px-6"
          >
            Haritada Paketi Gör
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">{pkg.title || pkg.code}</h2>
          <p className="text-slate-600 text-sm mt-2">
            Bu bir gezgin paket projesidir. Paketi bulduğunuz şehirde kısa bir mesaj bırakabilir, isterseniz bir fotoğraf da paylaşabilirsiniz.
          </p>
        </div>

        {scans.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-2">Paketin geçmiş yolculuğu</h3>
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {scans.slice(-5).reverse().map((s) => (
                <li key={s.id} className="text-sm text-slate-600">
                  {s.province}{s.district ? ` / ${s.district}` : ''} – {new Date(s.created_at).toLocaleDateString('tr-TR')}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">İl</label>
            <select
              value={provinceId}
              onChange={(e) => { setProvinceId(e.target.value); setDistrictId('') }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white"
              required
            >
              <option value="">Seçin</option>
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white"
              required
            >
              <option value="">Seçin</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mesaj (isteğe bağlı)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white placeholder:text-slate-400"
              placeholder="Bu şehirde nerede buldunuz?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fotoğraf (isteğe bağlı)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-amber-700"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 text-white font-medium py-3 disabled:opacity-50"
          >
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
      </div>
    </>
  )
}
