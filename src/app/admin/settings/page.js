import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: rows } = await supabase.from('settings').select('key, value')
  const settings = (rows || []).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Ayarlar</h1>
      <SettingsForm initial={{ qr_base_url: settings.qr_base_url || '' }} />
    </div>
  )
}
