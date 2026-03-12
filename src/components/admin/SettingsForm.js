'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function SettingsForm({ initial }) {
  const [qrBaseUrl, setQrBaseUrl] = useState(initial.qr_base_url || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.from('settings').upsert({ key: 'qr_base_url', value: qrBaseUrl.trim() }, { onConflict: 'key' })
    setSaving(false)
    if (error) setMessage(error.message)
    else setMessage('Kaydedildi.')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow border border-slate-200 max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Proje domain (QR URL)</label>
        <input
          type="url"
          value={qrBaseUrl}
          onChange={(e) => setQrBaseUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-500 mt-1">QR oluşturulurken kullanılacak. Örn: https://siteniz.com</p>
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <button type="submit" disabled={saving} className="rounded-xl bg-amber-500 text-white px-4 py-2 font-medium disabled:opacity-50">
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </form>
  )
}
