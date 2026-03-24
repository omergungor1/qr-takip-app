import { redirect } from 'next/navigation'

export default async function TurizmKategoriRedirectPage({ params }) {
  const { kategori } = await params
  redirect(`/kesfet/${kategori}`)
}
