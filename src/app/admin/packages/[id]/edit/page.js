import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AdminPackageEditForm from '@/components/admin/AdminPackageEditForm'

export default async function PackageEditPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: pkg } = await supabase.from('packages').select('*').eq('id', id).single()
  if (!pkg) notFound()

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/packages" className="text-slate-600 hover:text-[var(--primary)]">← Kitaplar</Link>
        <Link href={`/admin/packages/${id}`} className="text-slate-600 hover:text-[var(--primary)]">Hareketler</Link>
        <h1 className="text-2xl font-bold text-slate-800">Düzenle: {pkg.title || pkg.code}</h1>
      </div>
      <AdminPackageEditForm pkg={pkg} />
    </div>
  )
}
