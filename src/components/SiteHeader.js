import Link from 'next/link'
import Image from 'next/image'

export default function SiteHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Gezgin Paket"
                fill
                className="object-contain"
                priority
                sizes="40px"
              />
            </div>
            <span className="font-bold text-slate-800 text-lg sm:text-xl truncate">
              Gezgin Paket
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
