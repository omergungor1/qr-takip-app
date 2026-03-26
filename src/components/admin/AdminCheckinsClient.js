'use client'

import { useEffect, useRef, useState } from 'react'

const PAGE_SIZE = 20
const STATUSES = ['pending', 'approved', 'rejected', 'hidden']

function statusLabel(status) {
  if (status === 'pending') return 'Beklemede'
  if (status === 'approved') return 'Onaylandı'
  if (status === 'rejected') return 'Reddedildi'
  if (status === 'hidden') return 'Gizli'
  return status || '—'
}

function formatTrDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return '—'
  }
}

export default function AdminCheckinsClient() {
  const [tab, setTab] = useState('pending') // pending | all
  const [pendingItems, setPendingItems] = useState([])
  const [pendingPage, setPendingPage] = useState(1)
  const [pendingHasMore, setPendingHasMore] = useState(true)

  const [allItems, setAllItems] = useState([])
  const [allPage, setAllPage] = useState(1)
  const [allHasMore, setAllHasMore] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [q, setQ] = useState('')

  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const requestSeq = useRef(0)

  const activeList = tab === 'pending' ? pendingItems : allItems

  const refreshPending = async (page = 1) => {
    const seq = ++requestSeq.current
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/checkins?type=pending&page=${page}&limit=${PAGE_SIZE}`)
      const json = await res.json()
      if (seq !== requestSeq.current) return
      setPendingItems((prev) => (page === 1 ? (json.items || []) : [...prev, ...(json.items || [])]))
      setPendingPage(page)
      setPendingHasMore(Boolean(json.hasMore))
    } finally {
      setLoading(false)
    }
  }

  const refreshAll = async (page = 1) => {
    const seq = ++requestSeq.current
    setLoading(true)
    try {
      const qs = q ? `&q=${encodeURIComponent(q)}` : ''
      const res = await fetch(`/api/admin/checkins?type=all&page=${page}&limit=${PAGE_SIZE}${qs}`)
      const json = await res.json()
      if (seq !== requestSeq.current) return
      setAllItems((prev) => (page === 1 ? (json.items || []) : [...prev, ...(json.items || [])]))
      setAllPage(page)
      setAllHasMore(Boolean(json.hasMore))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tab === 'pending' && pendingItems.length === 0) refreshPending(1)
    if (tab === 'all' && allItems.length === 0) refreshAll(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const handleLoadMore = async () => {
    if (loading) return
    if (tab === 'pending') {
      if (!pendingHasMore) return
      await refreshPending(pendingPage + 1)
      return
    }
    if (!allHasMore) return
    await refreshAll(allPage + 1)
  }

  const handleApplySearch = () => {
    setQ(searchText.trim())
    setAllItems([])
    setAllPage(1)
    setAllHasMore(true)
  }

  useEffect(() => {
    if (tab !== 'all') return
    if (allItems.length === 0) refreshAll(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tab])

  const updateStatus = async (id, nextStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/admin/checkins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(json?.error || 'Durum güncellenemedi.')
        return
      }

      // Sayfayı yenilemeden lokal state'i güncelle.
      // - Pending tab: approved/rejected/hidden olunca satır listeden çıkar.
      // - All tab: durum badge'i güncellenir (satır kalır).
      setPendingItems((prev) => {
        if (nextStatus !== 'pending') return prev.filter((x) => x.id !== id)
        return prev.map((x) => (x.id === id ? { ...x, status: nextStatus } : x))
      })
      setAllItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: nextStatus } : x)))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${tab === 'pending'
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[var(--primary)]/60'
            }`}
        >
          Bekleyen Kayıtlar
        </button>
        <button
          type="button"
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${tab === 'all'
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[var(--primary)]/60'
            }`}
        >
          Tüm Kayıtlar
        </button>
      </div>

      {tab === 'all' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Arama</label>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplySearch()
                }}
                placeholder="İl, ilçe, mesaj veya kitap kodu..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleApplySearch}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-white text-sm font-medium px-4 py-2.5 hover:opacity-90 transition-opacity"
              >
                Ara
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchText('')
                  setQ('')
                  setAllItems([])
                  setAllPage(1)
                  setAllHasMore(true)
                }}
                className="inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2.5 hover:bg-slate-200 transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Kitap</th>
                <th className="px-4 py-3 font-semibold">Konum</th>
                <th className="px-4 py-3 font-semibold">Mesaj</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Tarih</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Durum</th>
                {tab === 'pending' ? <th className="px-4 py-3 font-semibold">İşlemler</th> : <th className="px-4 py-3 font-semibold">Düzenle</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    {loading ? 'Yükleniyor...' : 'Kayıt yok.'}
                  </td>
                </tr>
              ) : (
                activeList.map((row) => {
                  const bookTitle = row.package?.title || row.package?.code || '—'
                  const loc = row.district ? `${row.province} / ${row.district}` : row.province || '—'
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 truncate max-w-[260px]">{bookTitle}</div>
                        {row.image_url && (
                          <div className="mt-2 w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                            {/* Thumbnail */}
                            <img src={row.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{loc}</td>
                      <td className="px-4 py-3 text-slate-600 break-all">{row.message ? row.message.slice(0, 80) : '—'}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatTrDate(row.created_at)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${row.status === 'approved'
                              ? 'bg-green-50 text-green-800'
                              : row.status === 'pending'
                                ? 'bg-amber-50 text-amber-800'
                                : row.status === 'rejected'
                                  ? 'bg-red-50 text-red-800'
                                  : 'bg-slate-100 text-slate-700'
                            }`}
                        >
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      {tab === 'pending' ? (
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={updatingId === row.id}
                              onClick={() => updateStatus(row.id, 'approved')}
                              className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
                            >
                              Onayla
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === row.id}
                              onClick={() => updateStatus(row.id, 'rejected')}
                              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
                            >
                              Reddet
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === row.id}
                              onClick={() => updateStatus(row.id, 'hidden')}
                              className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
                            >
                              Gizle
                            </button>
                          </div>
                        </td>
                      ) : (
                        <td className="px-4 py-3">
                          <select
                            value={row.status}
                            disabled={updatingId === row.id}
                            onChange={(e) => updateStatus(row.id, e.target.value)}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 text-xs font-medium"
                          >
                            {STATUSES.map((s) => (
                              <option value={s} key={s}>
                                {statusLabel(s)}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            {tab === 'pending' ? 'Beklemede kayıtlar' : 'Arama sonuçları'}: <strong className="text-slate-800">{activeList.length}</strong>
          </div>
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading || (tab === 'pending' ? !pendingHasMore : !allHasMore)}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-white text-sm font-medium px-4 py-2.5 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? 'Yükleniyor...' : tab === 'pending' ? (pendingHasMore ? 'Daha Fazla' : 'Hepsi') : allHasMore ? 'Daha Fazla' : 'Hepsi'}
          </button>
        </div>
      </div>
    </div>
  )
}

