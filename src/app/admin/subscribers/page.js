import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminSubscribersClient from '@/components/admin/AdminSubscribersClient'

export const metadata = {
  title: 'Aboneler | GezginKitap Admin',
}

export default async function AdminSubscribersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">E-posta aboneleri</h1>
      <p className="text-slate-600 text-sm mb-6">
        Bülten için kayıt olan adresler. Listeyi CSV olarak indirebilirsiniz.
      </p>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm px-4 py-3">
          Aboneler yüklenemedi. Supabase&apos;te <code className="text-xs bg-red-100 px-1 rounded">subscribers</code>{' '}
          tablosu için <strong>authenticated</strong> kullanıcılara <strong>SELECT</strong> izni veren RLS politikasının
          tanımlı olduğundan emin olun (<code className="text-xs bg-red-100 px-1 rounded">db.sql</code> içindeki{' '}
          <code className="text-xs bg-red-100 px-1 rounded">subscribers_authenticated_select</code>).
        </div>
      ) : (
        <AdminSubscribersClient subscribers={subscribers || []} />
      )}
    </div>
  )
}
