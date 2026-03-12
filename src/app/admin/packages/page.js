import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminPackagesClient from '@/components/admin/AdminPackagesClient'

export default async function AdminPackagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: settingsRow } = await supabase.from('settings').select('value').eq('key', 'qr_base_url').single()
  const qrBaseUrl = settingsRow?.value || ''

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Paket Yönetimi</h1>
      <AdminPackagesClient packages={packages || []} qrBaseUrl={qrBaseUrl} />
    </div>
  )
}
