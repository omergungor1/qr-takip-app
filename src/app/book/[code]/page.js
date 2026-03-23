import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { getStorageUrl, totalKmFromScans } from '@/lib/utils'
import BookPassportClient from '@/components/BookPassportClient'

export async function generateMetadata({ params }) {
  const { code } = await params
  return {
    title: `${code} Nolu Gezgin Kitap Yolculuğu`,
    description: `GezginKitap - ${code} nolu kitabın Türkiye yolculuğu, check-in geçmişi ve rota haritası.`,
  }
}

async function getPackage(code) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*, package_scans(*)')
    .eq('code', code)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  const scans = (data.package_scans || [])
    .filter((s) => s.status === 'approved')
    .map((s) => ({
      ...s,
      image_path: s.image_path ? getStorageUrl(s.image_path) : null,
    }))
  const firstScan = scans.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]
  const totalKm = totalKmFromScans(scans)
  const cities = new Set(scans.map((s) => s.province).filter(Boolean)).size
  return {
    ...data,
    package_scans: scans,
    firstCheckInAt: firstScan?.created_at || null,
    totalKm,
    citiesVisited: cities,
  }
}

export default async function BookPassportPage({ params }) {
  const { code } = await params
  const pkg = await getPackage(code)
  if (!pkg) notFound()

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BookPassportClient pkg={pkg} />
      </div>
    </div>
  )
}
