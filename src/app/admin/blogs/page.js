import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminBlogsClient from '@/components/admin/AdminBlogsClient'

export default async function AdminBlogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: blogs } = await supabase.from('blogs').select('*').order('published_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gezgin Haber Yönetimi</h1>
      <AdminBlogsClient blogs={blogs || []} />
    </div>
  )
}
