import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ScanForm from '@/components/ScanForm'

export async function generateMetadata({ params }) {
  const slug = (await params).slug
  const supabase = await createClient()
  const { data } = await supabase.from('packages').select('title, code').eq('qr_slug', slug).eq('is_active', true).single()
  const title = data?.title || data?.code || 'Kitap'
  return { title: `${title} Kayıt | GezginKitap` }
}

async function getPackage(slug) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('id, code, title, qr_slug')
    .eq('qr_slug', slug)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  return data
}

export default async function QrCheckInPage({ params }) {
  const { slug } = await params
  const pkg = await getPackage(slug)
  if (!pkg) notFound()

  return <ScanForm package={pkg} />
}
