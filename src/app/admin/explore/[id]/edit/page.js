import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminExploreForm from '@/components/admin/AdminExploreForm'

export default async function AdminExploreEditPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: item } = await supabase.from('explore_contents').select('*').eq('id', id).single()
  if (!item) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Keşfet içeriği düzenle</h1>
      <AdminExploreForm initialItem={item} />
    </div>
  )
}

