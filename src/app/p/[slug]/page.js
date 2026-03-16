import { redirect } from 'next/navigation'

export default async function LegacyScanPage({ params }) {
  const { slug } = await params
  redirect(`/qr/${slug}`)
}
