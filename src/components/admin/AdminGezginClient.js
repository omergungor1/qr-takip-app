'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getStorageUrl } from '@/lib/utils'

export default function AdminGezginClient({ gezginler: initialGezginler }) {
  const router = useRouter()
  const [gezginler, setGezginler] = useState(initialGezginler)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [showCoverPicker, setShowCoverPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setGezginler(initialGezginler)
  }, [initialGezginler])

  const resetForm = () => {
    setEditing(null)
    setName('')
    setDescription('')
    setCoverImage(null)
    setShowCoverPicker(false)
    setShowForm(false)
  }

  const existingCoverUrl = useMemo(() => {
    if (!editing?.cover_image) return null
    if (String(editing.cover_image).startsWith('http')) return editing.cover_image
    return getStorageUrl(editing.cover_image)
  }, [editing])

  const selectedCoverPreviewUrl = useMemo(() => {
    if (!coverImage) return null
    return URL.createObjectURL(coverImage)
  }, [coverImage])

  useEffect(() => {
    return () => {
      if (selectedCoverPreviewUrl) URL.revokeObjectURL(selectedCoverPreviewUrl)
    }
  }, [selectedCoverPreviewUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const rowId = editing?.id || crypto.randomUUID()
    let coverPath = editing?.cover_image || null
    if (coverImage) {
      const ext = coverImage.name.split('.').pop() || 'jpg'
      const path = `gezginler/${rowId}.${ext}`
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, coverImage, { upsert: true })
      if (!upErr) coverPath = path
    }
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      cover_image: coverPath,
    }
    if (editing) {
      const { data, error } = await supabase.from('gezginler').update(payload).eq('id', editing.id).select().single()
      setSaving(false)
      if (error) return
      setGezginler((prev) => prev.map((g) => (g.id === data.id ? data : g)))
      resetForm()
      router.refresh()
      return
    }
    const { data, error } = await supabase.from('gezginler').insert({ id: rowId, ...payload }).select().single()
    setSaving(false)
    if (error) return
    setGezginler((prev) => [data, ...prev])
    resetForm()
    router.refresh()
  }

  const startEdit = (item) => {
    setEditing(item)
    setName(item.name)
    setDescription(item.description || '')
    setCoverImage(null)
    setShowCoverPicker(false)
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Gezgin bloglarında yazar seçiminde görünmesi için önce gezgin profili ekleyin. Kapak görseli isteğe bağlıdır.
      </p>
      {!showForm && (
        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-medium"
        >
          Yeni gezgin
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow border border-slate-200 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">İsim</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kapak görseli (isteğe bağlı)</label>
            {(existingCoverUrl || selectedCoverPreviewUrl) && (
              <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-600 mb-2">{selectedCoverPreviewUrl ? 'Yeni seçilen görsel' : 'Mevcut görsel'}</p>
                <div className="relative w-full max-w-sm aspect-[16/10] rounded-lg overflow-hidden bg-white border border-slate-200">
                  <img src={selectedCoverPreviewUrl || existingCoverUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCoverPicker((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 text-white text-xs font-semibold px-3 py-2 hover:opacity-90 transition-opacity"
                  >
                    Değiştir
                  </button>
                  {selectedCoverPreviewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null)
                        setShowCoverPicker(false)
                      }}
                      className="inline-flex items-center rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 hover:bg-slate-200 transition-colors"
                    >
                      Seçimi kaldır
                    </button>
                  )}
                </div>
              </div>
            )}

            {!existingCoverUrl && !selectedCoverPreviewUrl && (
              <button
                type="button"
                onClick={() => setShowCoverPicker(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 hover:bg-slate-200 transition-colors"
              >
                Görsel ekle
              </button>
            )}

            {showCoverPicker && (
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-800"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-xl bg-slate-800 text-white px-4 py-2 font-medium disabled:opacity-50">
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl bg-slate-100 text-slate-700 px-4 py-2 font-medium hover:bg-slate-200 transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {!editing && (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {gezginler.length === 0 && <li className="p-4 text-sm text-slate-500">Henüz gezgin eklenmedi.</li>}
            {gezginler.map((g) => {
              const coverUrl = g.cover_image
                ? String(g.cover_image).startsWith('http')
                  ? g.cover_image
                  : getStorageUrl(g.cover_image)
                : null
              return (
                <li key={g.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {coverUrl ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl border border-dashed border-slate-200 bg-white shrink-0" aria-hidden />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{g.name}</p>
                      {g.description ? <p className="text-sm text-slate-500 truncate">{g.description}</p> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(g)}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 text-white text-xs font-semibold px-3 py-2 hover:opacity-90 transition-opacity shrink-0"
                  >
                    Düzenle
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
