import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import ElciTesekkurClient from '@/components/ElciTesekkurClient'

export async function generateMetadata({ params }) {
  const slug = (await params).slug
  const supabase = await createClient()
  const { data } = await supabase.from('packages').select('title, code').eq('qr_slug', slug).eq('is_active', true).single()
  const title = data?.title || data?.code || 'Kitap'
  return { title: `Teşekkürler, Elçi! | ${title} — GezginKitap` }
}

async function loadTesekkur(slug, scanId) {
  const supabase = await createClient()
  const { data: pkg, error: pErr } = await supabase
    .from('packages')
    .select('id, code, title, qr_slug')
    .eq('qr_slug', slug)
    .eq('is_active', true)
    .single()
  if (pErr || !pkg) return null

  const { data: scan, error: sErr } = await supabase
    .from('package_scans')
    .select('id, created_at, package_id')
    .eq('id', scanId)
    .single()
  if (sErr || !scan || scan.package_id !== pkg.id) return null

  const { count } = await supabase
    .from('package_scans')
    .select('*', { count: 'exact', head: true })
    .eq('package_id', pkg.id)
    .lte('created_at', scan.created_at)

  const registrationOrder = typeof count === 'number' ? count : 1

  const issuedDateFormatted = new Date(scan.created_at).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return {
    pkg,
    scan,
    registrationOrder,
    issuedDateFormatted,
  }
}

export default async function QrTesekkurPage({ params, searchParams }) {
  const slug = (await params).slug
  const sp = await searchParams
  const scanRaw = sp?.scan
  const scanId = Array.isArray(scanRaw) ? scanRaw[0] : scanRaw
  if (!scanId || typeof scanId !== 'string') {
    redirect(`/qr/${slug}`)
  }

  const data = await loadTesekkur(slug, scanId)
  if (!data) notFound()

  return (
    <ElciTesekkurClient
      slug={slug}
      scanId={data.scan.id}
      bookTitle={data.pkg.title || data.pkg.code}
      bookCode={data.pkg.code}
      registrationOrder={data.registrationOrder}
      issuedDateFormatted={data.issuedDateFormatted}
    />
  )
}
