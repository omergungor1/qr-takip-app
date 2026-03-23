import { createClient } from '@/lib/supabase-server'
import MapSection from '@/components/MapSection'
import PackageTicker from '@/components/PackageTicker'
import { getStorageUrl } from '@/lib/utils'

export const metadata = {
  title: 'Harita | GezginKitap',
  description: 'Gezgin kitapların Türkiye haritasındaki konumları ve rotaları.',
}

async function getPackages() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('packages')
    .select('*, package_scans(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  const packages = (data || []).map((p) => ({
    ...p,
    package_scans: (p.package_scans || [])
      .filter((s) => s.status === 'approved')
      .map((s) => ({
        ...s,
        image_path: s.image_path ? getStorageUrl(s.image_path) : null,
      })),
  }))
  return packages
}

export default async function HaritaPage() {
  const packages = await getPackages()

  return (
    <div className="py-8 sm:py-12 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2 text-center">
          Gezgin Kitaplar Haritası
        </h1>
        <p className="text-[var(--text-light)] text-center mb-6 max-w-2xl mx-auto">
          Kitapların son konumları ve gezindiği rotayı görün. Bir kitaba tıklayarak pasaport sayfasına gidebilirsiniz.
        </p>
        <div className="mt-6">
          <MapSection packages={packages} />
        </div>
        <PackageTicker packages={packages} />
      </div>
    </div>
  )
}
