'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { getStorageUrl } from '@/lib/utils'

export default function AdminBlogsClient({ blogs: initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [showCoverPicker, setShowCoverPicker] = useState(false)
  const [publishedAt, setPublishedAt] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const resetForm = () => {
    setEditing(null)
    setTitle('')
    setSlug('')
    setContent('')
    setCoverImage(null)
    setShowCoverPicker(false)
    setPublishedAt('')
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

  const slugFromTitle = (t) => t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    let coverPath = editing?.cover_image || null
    if (coverImage) {
      const path = `blogs/${editing?.id || crypto.randomUUID()}.${coverImage.name.split('.').pop() || 'jpg'}`
      await supabase.storage.from('uploads').upload(path, coverImage, { upsert: true })
      coverPath = path
    }
    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugFromTitle(title),
      content: content.trim(),
      cover_image: coverPath,
      published_at: publishedAt || null,
      is_active: true,
    }
    if (editing) {
      const { data, error } = await supabase.from('blogs').update(payload).eq('id', editing.id).select().single()
      setSaving(false)
      if (error) return
      setBlogs((prev) => prev.map((b) => (b.id === data.id ? data : b)))
      resetForm()
      return
    }
    const { data, error } = await supabase.from('blogs').insert(payload).select().single()
    setSaving(false)
    if (error) return
    setBlogs((prev) => [data, ...prev])
    resetForm()
  }

  const toggleActive = async (item) => {
    const { error } = await supabase.from('blogs').update({ is_active: !item.is_active }).eq('id', item.id)
    if (!error) setBlogs((prev) => prev.map((b) => (b.id === item.id ? { ...b, is_active: !b.is_active } : b)))
  }

  const startEdit = (item) => {
    setEditing(item)
    setTitle(item.title)
    setSlug(item.slug)
    setContent(item.content)
    setCoverImage(null)
    setShowCoverPicker(false)
    setPublishedAt(item.published_at ? item.published_at.slice(0, 16) : '')
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          type="button"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="rounded-xl bg-amber-500 text-white px-4 py-2 font-medium"
        >
          Yeni Gezgin Haber
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow border border-slate-200 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
            <input value={title} onChange={(e) => { setTitle(e.target.value); if (!editing) setSlug(slugFromTitle(e.target.value)); }} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">İçerik</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white placeholder:text-slate-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Manşet Fotoğrafı</label>
            {(existingCoverUrl || selectedCoverPreviewUrl) && (
              <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-600 mb-2">
                  {selectedCoverPreviewUrl ? 'Yeni seçilen görsel' : 'Mevcut görsel'}
                </p>
                <div className="relative w-full max-w-sm aspect-[16/10] rounded-lg overflow-hidden bg-white border border-slate-200">
                  <img
                    src={selectedCoverPreviewUrl || existingCoverUrl}
                    alt="Manşet görseli"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCoverPicker((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 text-white text-xs font-semibold px-3 py-2 hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 14.536A4 4 0 0110 15H9v-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 19H5" />
                    </svg>
                    Değiştir
                  </button>
                  {selectedCoverPreviewUrl && (
                    <button
                      type="button"
                      onClick={() => { setCoverImage(null); setShowCoverPicker(false) }}
                      className="inline-flex items-center rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 hover:bg-slate-200 transition-colors"
                    >
                      Seçimi kaldır
                    </button>
                  )}
                </div>
              </div>
            )}

            {(!existingCoverUrl && !selectedCoverPreviewUrl) && (
              <button
                type="button"
                onClick={() => setShowCoverPicker(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 hover:bg-slate-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Görsel ekle
              </button>
            )}

            {showCoverPicker && (
              <div className="mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-amber-700"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yayın tarihi</label>
            <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white" />
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

      {/* Düzenleme modunda listeyi gizle */}
      {!editing && (
        <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {blogs.map((b) => {
              const coverUrl = b.cover_image
                ? (String(b.cover_image).startsWith('http') ? b.cover_image : getStorageUrl(b.cover_image))
                : null

              return (
                <li key={b.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {coverUrl ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl border border-dashed border-slate-200 bg-white shrink-0" aria-hidden />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{b.title}</p>
                      <p className="text-sm text-slate-500 truncate">{b.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(b)}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-800 text-white text-xs font-semibold px-3 py-2 hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 14.536A4 4 0 0110 15H9v-4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 19H5" />
                      </svg>
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(b)}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                        b.is_active
                          ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {b.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
