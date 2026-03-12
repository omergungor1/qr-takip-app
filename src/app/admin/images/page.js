import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getStorageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminImagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: scans } = await supabase
    .from('package_scans')
    .select('*, packages(code, title)')
    .not('image_path', 'is', null)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-slate-600 hover:text-amber-600">← Admin</Link>
        <h1 className="text-2xl font-bold text-slate-800">Kullanıcı Görselleri</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(scans || []).map((scan) => (
          <div key={scan.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow">
            <div className="relative aspect-square bg-slate-100">
              <Image
                src={getStorageUrl(scan.image_path)}
                alt="Paylaşım"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <div className="p-2 text-xs text-slate-600">
              <p>{scan.packages?.title || scan.packages?.code}</p>
              <p>{scan.province} {scan.district ? ` / ${scan.district}` : ''}</p>
              <p>{new Date(scan.created_at).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        ))}
      </div>
      {(!scans || scans.length === 0) && (
        <p className="text-slate-500 text-center py-12">Henüz yüklenen görsel yok.</p>
      )}
    </div>
  )
}
