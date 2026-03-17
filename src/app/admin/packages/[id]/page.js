import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getStorageUrl } from '@/lib/utils'
import Image from 'next/image'

export default async function PackageScansPage({ params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: pkg } = await supabase.from('packages').select('*').eq('id', id).single()
  if (!pkg) notFound()

  const { data: scans } = await supabase
    .from('package_scans')
    .select('*')
    .eq('package_id', id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/packages" className="text-slate-600 hover:text-amber-600">← Kitaplar</Link>
        <h1 className="text-2xl font-bold text-slate-800">Hareketler: {pkg.title || pkg.code}</h1>
      </div>
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {(scans || []).map((scan) => (
            <li key={scan.id} className="p-4">
              <p className="font-medium text-slate-800">{scan.province || '—'} {scan.district ? `/ ${scan.district}` : ''}</p>
              <p className="text-sm text-slate-500">{new Date(scan.created_at).toLocaleString('tr-TR')}</p>
              {scan.message && <p className="text-slate-600 mt-1">{scan.message}</p>}
              {scan.image_path && (
                <div className="mt-2 relative w-32 h-24 rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={getStorageUrl(scan.image_path)}
                    alt="Paylaşım"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
        {(!scans || scans.length === 0) && (
          <p className="p-6 text-slate-500 text-center">Henüz tarama yok.</p>
        )}
      </div>
    </div>
  )
}
