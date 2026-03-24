'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { TURIZM_CATEGORIES } from '@/lib/turizm-categories'
import { toExploreSlug } from '@/lib/explore-content'
import { getStorageUrl } from '@/lib/utils'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export default function AdminExploreForm({ initialItem }) {
  const router = useRouter()
  const supabase = createClient()
  const editing = Boolean(initialItem?.id)

  const [title, setTitle] = useState(initialItem?.title || '')
  const [slug, setSlug] = useState(initialItem?.slug || '')
  const [description, setDescription] = useState(initialItem?.description || '')
  const [content, setContent] = useState(initialItem?.content || '')
  const [videoUrl, setVideoUrl] = useState(initialItem?.video_url || '')
  const [category, setCategory] = useState(initialItem?.category || TURIZM_CATEGORIES[0].id)
  const [status, setStatus] = useState(initialItem?.status || 'draft')
  const [publishedAt, setPublishedAt] = useState(initialItem?.published_at ? initialItem.published_at.slice(0, 16) : '')
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const existingCoverUrl = initialItem?.cover_image ? getStorageUrl(initialItem.cover_image) : null

  const onFileChange = (file) => {
    if (!file) {
      setImageFile(null)
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Görsel boyutu en fazla 2MB olabilir.')
      return
    }
    setError('')
    setImageFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError('')

    let coverPath = initialItem?.cover_image || null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop() || 'jpg'
      const base = editing ? initialItem.id : crypto.randomUUID()
      const path = `explore/${base}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('uploads').upload(path, imageFile, { upsert: true })
      if (uploadError) {
        setSaving(false)
        setError(uploadError.message || 'Görsel yüklenemedi.')
        return
      }
      coverPath = path
    }

    const nextSlug = (slug.trim() || toExploreSlug(title)).toLowerCase()
    const payload = {
      title: title.trim(),
      slug: nextSlug,
      description: description.trim() || null,
      content: content.trim() || null,
      video_url: videoUrl.trim() || null,
      category,
      status,
      cover_image: coverPath,
      published_at: publishedAt || null,
    }

    if (editing) {
      const { error: updateError } = await supabase.from('explore_contents').update(payload).eq('id', initialItem.id)
      setSaving(false)
      if (updateError) {
        setError(updateError.message || 'Güncelleme başarısız.')
        return
      }
      router.push('/admin/explore')
      router.refresh()
      return
    }

    const { error: insertError } = await supabase.from('explore_contents').insert(payload)
    setSaving(false)
    if (insertError) {
      setError(insertError.message || 'Kayıt başarısız.')
      return
    }
    router.push('/admin/explore')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow border border-slate-200 space-y-4 max-w-3xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (!editing) setSlug(toExploreSlug(e.target.value))
          }}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(toExploreSlug(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
          >
            {TURIZM_CATEGORIES.map((c) => (
              <option value={c.id} key={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kısa açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">İçerik (HTML/markdown)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Video URL (YouTube)</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınlanmış</option>
            <option value="removed">Silindi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Yayın tarihi</label>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kapak görseli (max 2MB)</label>
        {existingCoverUrl && !imageFile && (
          <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-600 mb-2">Mevcut kapak görseli</p>
            <div className="relative w-full max-w-sm aspect-[16/10] rounded-lg overflow-hidden bg-white border border-slate-200">
              <img src={existingCoverUrl} alt="Mevcut kapak görseli" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        {imageFile && (
          <p className="text-xs text-slate-600 mb-2">
            Yeni seçilen dosya: <strong>{imageFile.name}</strong>
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white file:mr-2 file:rounded-lg file:border-0 file:bg-[var(--primary)]/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[var(--primary)]"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-white text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {saving ? 'Kaydediliyor...' : editing ? 'Güncelle' : 'Kaydet'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/explore')}
          className="inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2.5 hover:bg-slate-200 transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  )
}

