'use client'

import { usePathname } from 'next/navigation'
import SiteHeader from './SiteHeader'
import Footer from './Footer'

export default function SiteLayoutWrapper({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
