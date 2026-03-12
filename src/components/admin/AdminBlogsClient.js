'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AdminBlogsClient({ blogs: initialBlogs }) {
  const [blogs, setBlogs] = useState(initialBlogs)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [publishedAt, setPublishedAt] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const resetForm = () => {
    setEditing(null)
    setTitle('')
    setSlug('')
    setContent('')
    setCoverImage(null)
    setPublishedAt('')
    setShowForm(false)
  }

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
      if (!error) setBlogs((prev) => prev.map((b) => (b.id === data.id ? data : b)))
      resetForm()
      return
    }
    const { data, error } = await supabase.from('blogs').insert(payload).select().single()
    setSaving(false)
    if (!error) setBlogs((prev) => [data, ...prev])
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
    setPublishedAt(item.published_at ? item.published_at.slice(0, 16) : '')
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => { resetForm(); setShowForm((v) => !v); }} className="rounded-xl bg-amber-500 text-white px-4 py-2 font-medium">
        {showForm ? 'İptal' : 'Yeni blog'}
      </button>

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
            <label className="block text-sm font-medium text-slate-700 mb-1">Kapak görseli</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0])} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white file:mr-2 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-amber-700" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yayın tarihi</label>
            <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white" />
          </div>
          <button type="submit" disabled={saving} className="rounded-xl bg-slate-800 text-white px-4 py-2 font-medium disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {blogs.map((b) => (
            <li key={b.id} className="p-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-800">{b.title}</p>
                <p className="text-sm text-slate-500">{b.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => startEdit(b)} className="text-sm text-slate-600 hover:underline">Düzenle</button>
                <button type="button" onClick={() => toggleActive(b)} className={`text-sm px-3 py-1 rounded-lg ${b.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                  {b.is_active ? 'Aktif' : 'Pasif'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
