import { redirect } from 'next/navigation'

export default async function TurizmDetailRedirectPage({ params }) {
  const { slug } = await params
  redirect(`/kesfet/${slug}`)
}
