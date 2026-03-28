'use client'

import { usePathname } from 'next/navigation'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import EmailSubscription from './EmailSubscription'

export default function SiteLayoutWrapper({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isCheckInPage = pathname?.startsWith('/p/') || pathname?.startsWith('/qr/')

  if (isAdmin) {
    return <>{children}</>
  }

  /* QR / kısa link kayıt sayfası: sade içerik, header ve footer yok */
  if (isCheckInPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <EmailSubscription />
      <Footer />
    </div>
  )
}
