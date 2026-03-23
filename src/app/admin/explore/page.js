import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getTurizmCategoryLabel } from '@/lib/turizm-categories'

const STATUSES = ['draft', 'published', 'removed']

function safeStatus(value) {
  return STATUSES.includes(value) ? value : 'draft'
}

export default async function AdminExplorePage({ searchParams }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const sp = await searchParams
  const status = safeStatus(sp?.status)

  const { data: items } = await supabase
    .from('explore_contents')
    .select('id,title,slug,category,status,published_at,created_at')
    .eq('status', status)
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Keşfet içerikleri</h1>
        <Link
          href="/admin/explore/new"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] text-white text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition-opacity"
        >
          Yeni içerik ekle
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/explore?status=${s}`}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              status === s
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[var(--primary)]/50'
            }`}
          >
            {s === 'draft' ? 'Draft' : s === 'published' ? 'Published' : 'Removed'}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Başlık</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Yayın</th>
                <th className="px-4 py-3 font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(items || []).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-800 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{getTurizmCategoryLabel(item.category)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.slug}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString('tr-TR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/explore/${item.id}/edit`}
                      className="inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 hover:bg-slate-200 transition-colors"
                    >
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    Bu durumda içerik yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

