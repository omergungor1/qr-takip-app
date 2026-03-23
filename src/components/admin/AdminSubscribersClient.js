'use client'

function escapeCsvCell(value) {
  const s = value == null ? '' : String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function buildCsv(rows) {
  const header = ['email', 'created_at', 'id']
  const lines = [header.join(',')]
  for (const row of rows) {
    lines.push(
      [escapeCsvCell(row.email), escapeCsvCell(row.created_at), escapeCsvCell(row.id)].join(',')
    )
  }
  return '\uFEFF' + lines.join('\r\n')
}

export default function AdminSubscribersClient({ subscribers }) {
  const handleDownload = () => {
    const csv = buildCsv(subscribers)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const fname = `gezgin-kitap-aboneler-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.csv`
    a.href = url
    a.download = fname
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Toplam <strong className="text-slate-800">{subscribers.length}</strong> abone
        </p>
        <button
          type="button"
          onClick={handleDownload}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium px-4 py-2.5 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV indir
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">E-posta</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Kayıt tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                    Henüz abone yok.
                  </td>
                </tr>
              ) : (
                subscribers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-slate-800 break-all">{row.email}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString('tr-TR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
