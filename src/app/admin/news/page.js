import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNewsClient from '@/components/admin/AdminNewsClient'

export default async function AdminNewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: news } = await supabase.from('news').select('*').order('published_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Haber Yönetimi</h1>
      <AdminNewsClient news={news || []} />
    </div>
  )
}
