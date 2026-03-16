'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminPackageEditForm({ pkg }) {
  const router = useRouter()
  const [title, setTitle] = useState(pkg?.title ?? '')
  const [description, setDescription] = useState(pkg?.description ?? '')
  const [sponsorName, setSponsorName] = useState(pkg?.sponsor_name ?? '')
  const [sponsorLogo, setSponsorLogo] = useState(pkg?.sponsor_logo ?? '')
  const [sponsorUrl, setSponsorUrl] = useState(pkg?.sponsor_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const { error: err } = await supabase
      .from('packages')
      .update({
        title: title.trim() || null,
        description: description.trim() || null,
        sponsor_name: sponsorName.trim() || null,
        sponsor_logo: sponsorLogo.trim() || null,
        sponsor_url: sponsorUrl.trim() || null,
      })
      .eq('id', pkg.id)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    router.push('/admin/packages')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow border border-slate-200 space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>
      <hr className="border-slate-200" />
      <h3 className="font-semibold text-slate-800">Sponsor bilgisi</h3>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Sponsor adı</label>
        <input
          value={sponsorName}
          onChange={(e) => setSponsorName(e.target.value)}
          placeholder="Örn: Özdilek"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Sponsor logo (yol)</label>
        <input
          value={sponsorLogo}
          onChange={(e) => setSponsorLogo(e.target.value)}
          placeholder="sponsors/ozdilek-logo.webp"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
        <p className="text-xs text-slate-500 mt-1">public/ klasörüne göre: sponsors/dosya.png</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Sponsor URL</label>
        <input
          type="url"
          value={sponsorUrl}
          onChange={(e) => setSponsorUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--primary)] text-white px-4 py-2 font-medium disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <a
          href="/admin/packages"
          className="rounded-xl border border-slate-300 text-slate-700 px-4 py-2 font-medium"
        >
          İptal
        </a>
      </div>
    </form>
  )
}
