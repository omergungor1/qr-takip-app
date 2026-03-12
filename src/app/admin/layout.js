import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-100">
      {user ? (
        <>
          <AdminNav user={user} />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </>
      ) : (
        <main>{children}</main>
      )}
    </div>
  )
}
