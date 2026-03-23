import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminCheckinsClient from '@/components/admin/AdminCheckinsClient'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [
    { count: packagesCount },
    { count: newsCount },
    { count: blogsCount },
    { count: exploreCount },
  ] = await Promise.all([
    supabase.from('packages').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('explore_contents').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Panel</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/admin/packages" className="bg-white rounded-xl p-6 shadow border border-slate-200 hover:border-amber-300">
          <p className="text-3xl font-bold text-amber-600">{packagesCount ?? 0}</p>
          <p className="text-slate-600">Kitap</p>
        </Link>
        <Link href="/admin/news" className="bg-white rounded-xl p-6 shadow border border-slate-200 hover:border-amber-300">
          <p className="text-3xl font-bold text-amber-600">{newsCount ?? 0}</p>
          <p className="text-slate-600">Haber</p>
        </Link>
        <Link href="/admin/blogs" className="bg-white rounded-xl p-6 shadow border border-slate-200 hover:border-amber-300">
          <p className="text-3xl font-bold text-amber-600">{blogsCount ?? 0}</p>
          <p className="text-slate-600">Blog</p>
        </Link>
        <Link href="/admin/explore" className="bg-white rounded-xl p-6 shadow border border-slate-200 hover:border-amber-300">
          <p className="text-3xl font-bold text-amber-600">{exploreCount ?? 0}</p>
          <p className="text-slate-600">Keşfet</p>
        </Link>
        <Link href="/admin/settings" className="bg-white rounded-xl p-6 shadow border border-slate-200 hover:border-amber-300">
          <p className="text-slate-600">Ayarlar (Domain / QR)</p>
        </Link>
      </div>

      <AdminCheckinsClient />
    </div>
  )
}
