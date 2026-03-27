import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { formatTurkishMobileDisplay } from '@/lib/turkish-mobile-phone'

export const metadata = {
  title: 'Reklam talepleri | GezginKitap Admin',
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('tr-TR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export default async function AdminAdRequestsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: rows, error } = await supabase
    .from('ad_requests')
    .select('id, company_name, contact_person, phone_number, address, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Reklam talepleri</h1>
      <p className="text-slate-600 text-sm mb-6">
        Siteden gönderilen tüm reklam başvuruları aşağıda listelenir.
      </p>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm px-4 py-3">
          Talepler yüklenemedi. Supabase&apos;te{' '}
          <code className="text-xs bg-red-100 px-1 rounded">ad_requests</code> tablosu için{' '}
          <strong>authenticated</strong> kullanıcılara <strong>SELECT</strong> izni veren RLS politikasının
          tanımlı olduğundan emin olun (<code className="text-xs bg-red-100 px-1 rounded">db.sql</code> içindeki{' '}
          <code className="text-xs bg-red-100 px-1 rounded">ad_requests_authenticated_select</code>).
        </div>
      ) : !rows?.length ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm px-4 py-8 text-center">
          Henüz reklam talebi yok.
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[720px]">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Tarih</th>
                  <th className="px-4 py-3">Firma</th>
                  <th className="px-4 py-3">İlgili kişi</th>
                  <th className="px-4 py-3 whitespace-nowrap">Telefon</th>
                  <th className="px-4 py-3 min-w-[200px]">Adres</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 align-top">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{row.company_name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.contact_person}</td>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap font-mono text-xs sm:text-sm">
                      {formatTurkishMobileDisplay(row.phone_number)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-md">
                      {row.address ? (
                        <span className="whitespace-pre-wrap break-words">{row.address}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 px-4 py-2 border-t border-slate-100 bg-slate-50/50">
            Toplam {rows.length} kayıt
          </p>
        </div>
      )}
    </div>
  )
}
