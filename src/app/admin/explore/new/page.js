import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminExploreForm from '@/components/admin/AdminExploreForm'

export default async function AdminExploreNewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Yeni keşfet içeriği</h1>
      <AdminExploreForm />
    </div>
  )
}

