import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminBlogsClient from '@/components/admin/AdminBlogsClient'
import AdminGezginClient from '@/components/admin/AdminGezginClient'

export default async function AdminBlogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ data: blogs }, { data: gezginler }] = await Promise.all([
    supabase.from('blogs').select('*').order('published_at', { ascending: false }),
    supabase.from('gezginler').select('*').order('name', { ascending: true }),
  ])

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold text-slate-800">Gezgin içerik yönetimi</h1>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Gezginler</h2>
        <AdminGezginClient gezginler={gezginler || []} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Gezgin blogları</h2>
        <AdminBlogsClient blogs={blogs || []} gezginler={gezginler || []} />
      </section>
    </div>
  )
}
