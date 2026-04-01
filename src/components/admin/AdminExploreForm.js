'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import remarkBreaks from 'remark-breaks'
import { createClient } from '@/lib/supabase'
import { TURIZM_CATEGORIES } from '@/lib/turizm-categories'
import { toExploreSlug } from '@/lib/explore-content'
import { getStorageUrl } from '@/lib/utils'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const MAX_GALLERY_IMAGES = 10
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

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
  const [galleryItems, setGalleryItems] = useState([]) // { key, kind: 'existing'|'new', id?, path?, url, file? }
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const existingCoverUrl = initialItem?.cover_image ? getStorageUrl(initialItem.cover_image) : null

  useEffect(() => {
    if (!editing) return
    let cancelled = false
    const load = async () => {
      const { data, error: gErr } = await supabase
        .from('content_galleries')
        .select('id, image_url, caption, sort_order')
        .eq('content_type', 'explore')
        .eq('content_id', initialItem.id)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (cancelled) return
      if (gErr) return
      setGalleryItems(
        (data || []).slice(0, MAX_GALLERY_IMAGES).map((g) => ({
          key: `g-${g.id}`,
          kind: 'existing',
          id: g.id,
          path: g.image_url,
          url: getStorageUrl(g.image_url),
        }))
      )
    }
    load()
    return () => {
      cancelled = true
    }
  }, [editing, initialItem?.id, supabase])

  useEffect(() => {
    return () => {
      // new item preview objectURL cleanup
      for (const it of galleryItems) {
        if (it.kind === 'new' && it.url?.startsWith('blob:')) {
          try { URL.revokeObjectURL(it.url) } catch { }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const galleryCount = galleryItems.length
  const gallerySlotsLeft = Math.max(0, MAX_GALLERY_IMAGES - galleryCount)

  const moveGalleryItem = (index, dir) => {
    setGalleryItems((prev) => {
      const next = [...prev]
      const to = index + dir
      if (to < 0 || to >= next.length) return prev
      const tmp = next[index]
      next[index] = next[to]
      next[to] = tmp
      return next
    })
  }

  const removeGalleryItem = (key) => {
    setGalleryItems((prev) => {
      const it = prev.find((x) => x.key === key)
      if (it?.kind === 'new' && it.url?.startsWith('blob:')) {
        try { URL.revokeObjectURL(it.url) } catch { }
      }
      return prev.filter((x) => x.key !== key)
    })
  }

  const onGalleryFiles = (files) => {
    const list = Array.from(files || [])
    if (list.length === 0) return
    if (gallerySlotsLeft <= 0) {
      setError(`Galeri için en fazla ${MAX_GALLERY_IMAGES} görsel yüklenebilir.`)
      return
    }
    const picked = list.slice(0, gallerySlotsLeft)
    const tooBig = picked.find((f) => f.size > MAX_IMAGE_BYTES)
    if (tooBig) {
      setError('Galeri görsel boyutu en fazla 2MB olabilir.')
      return
    }
    setError('')
    const next = picked.map((file) => ({
      key: `n-${crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`,
      kind: 'new',
      file,
      url: URL.createObjectURL(file),
    }))
    setGalleryItems((prev) => [...prev, ...next])
  }

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
      if (updateError) {
        setSaving(false)
        setError(updateError.message || 'Güncelleme başarısız.')
        return
      }
      // Galeri kaydet
      await saveGallery(initialItem.id)
      setSaving(false)
      router.push('/admin/explore')
      router.refresh()
      return
    }

    const { data: inserted, error: insertError } = await supabase.from('explore_contents').insert(payload).select('id').single()
    if (insertError || !inserted?.id) {
      setSaving(false)
      setError(insertError.message || 'Kayıt başarısız.')
      return
    }
    await saveGallery(inserted.id)
    setSaving(false)
    router.push('/admin/explore')
    router.refresh()
  }

  const saveGallery = async (contentId) => {
    const current = galleryItems
    const existingIds = current.filter((x) => x.kind === 'existing' && x.id).map((x) => x.id)

    if (editing) {
      const { data: before } = await supabase
        .from('content_galleries')
        .select('id')
        .eq('content_type', 'explore')
        .eq('content_id', contentId)
      const beforeIds = (before || []).map((x) => x.id)
      const removed = beforeIds.filter((id) => !existingIds.includes(id))
      if (removed.length) {
        await supabase.from('content_galleries').delete().in('id', removed)
      }
    }

    // Yeni dosyaları yükle ve insert et
    const uploadQueue = current.map((it, idx) => ({ it, idx })).filter((x) => x.it.kind === 'new' && x.it.file)
    for (const { it, idx } of uploadQueue) {
      const file = it.file
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `explore-gallery/${contentId}-${idx + 1}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
      if (uploadError) {
        setError(uploadError.message || 'Galeri görseli yüklenemedi.')
        return
      }
      const { error: insErr } = await supabase.from('content_galleries').insert({
        content_id: contentId,
        content_type: 'explore',
        image_url: path,
        caption: null,
        sort_order: idx,
      })
      if (insErr) {
        setError(insErr.message || 'Galeri kaydı eklenemedi.')
        return
      }
    }

    // Mevcutların sort_order güncelle
    const keptExisting = current
      .map((it, idx) => ({ it, idx }))
      .filter((x) => x.it.kind === 'existing' && x.it.id)
    for (const { it, idx } of keptExisting) {
      await supabase.from('content_galleries').update({ sort_order: idx }).eq('id', it.id)
    }
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
        <label className="block text-sm font-medium text-slate-700 mb-1">İçerik</label>
        <div data-color-mode="light" className="rounded-lg border border-slate-300 bg-white overflow-hidden">
          <MDEditor
            value={content}
            onChange={(v) => setContent(v || '')}
            height={420}
            preview="live"
            visibleDragbar
            previewOptions={{ remarkPlugins: [remarkBreaks] }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Kalın, italik, link ve başlık ekleyebilir; Markdown ile içerik yazabilirsin.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Video URL (YouTube / Vimeo / Instagram / Facebook)</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... veya https://www.instagram.com/p/..."
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
        <label className="block text-sm font-medium text-slate-700 mb-1">Manşet Fotoğrafı (max 2MB)</label>
        {existingCoverUrl && !imageFile && (
          <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-600 mb-2">Mevcut manşet fotoğrafı</p>
            <div className="relative w-full max-w-sm aspect-[16/10] rounded-lg overflow-hidden bg-white border border-slate-200">
              <img src={existingCoverUrl} alt="Mevcut manşet fotoğrafı" className="w-full h-full object-cover" />
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

      <div>
        <div className="flex items-end justify-between gap-3 mb-2">
          <label className="block text-sm font-medium text-slate-700">Galeri görselleri (max {MAX_GALLERY_IMAGES})</label>
          <span className="text-xs text-slate-500">{galleryCount}/{MAX_GALLERY_IMAGES}</span>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => onGalleryFiles(e.target.files)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white file:mr-2 file:rounded-lg file:border-0 file:bg-[var(--primary)]/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[var(--primary)]"
        />
        {galleryItems.length > 0 && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryItems.map((it, idx) => (
              <div key={it.key} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-white border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveGalleryItem(idx, -1)}
                      disabled={idx === 0}
                      className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
                      title="Sola al"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryItem(idx, 1)}
                      disabled={idx === galleryItems.length - 1}
                      className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
                      title="Sağa al"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(it.key)}
                    className="h-9 px-3 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50"
                    title="Sil"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

