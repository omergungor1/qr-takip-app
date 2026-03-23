import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ScanForm from '@/components/ScanForm'

export async function generateMetadata({ params }) {
  const slug = (await params).slug
  const supabase = await createClient()
  const { data } = await supabase.from('packages').select('title, code').eq('qr_slug', slug).eq('is_active', true).single()
  const title = data?.title || data?.code || 'Kitap'
  return { title: `${title} Check-in | GezginKitap` }
}

async function getPackage(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*, package_scans(*)')
    .eq('qr_slug', slug)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  return {
    ...data,
    package_scans: (data.package_scans || []).filter((s) => s.status === 'approved'),
  }
}

export default async function QrCheckInPage({ params }) {
  const { slug } = await params
  const pkg = await getPackage(slug)
  if (!pkg) notFound()

  const scans = (pkg.package_scans || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )

  return (
    <div className="bg-[var(--background)] min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <ScanForm package={pkg} scans={scans} />
      </div>
    </div>
  )
}
