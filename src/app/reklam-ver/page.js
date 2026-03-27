import Link from 'next/link'
import AdRequestForm from '@/components/AdRequestForm'

export const metadata = {
  title: 'Reklam ver | GezginKitap',
  description: 'GezginKitap üzerinde reklam ve sponsorluk talebi oluşturun.',
}

export default function ReklamVerPage() {
  return (
    <div className="py-12 sm:py-16 bg-[var(--background)] min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Reklam ver
          </h1>
          <p className="text-[var(--text-light)] max-w-xl mx-auto">
            Markanızı veya işletmenizi GezginKitap kitlesine tanıtmak için aşağıdaki formu doldurun. Ekibimiz
            en kısa sürede sizinle iletişime geçecektir.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm mb-8">
          <AdRequestForm />
        </div>

        <p className="text-center text-sm text-slate-500">
          <Link href="/" className="text-[var(--primary)] font-medium hover:underline underline-offset-2">
            Ana sayfaya dön
          </Link>
        </p>
      </div>
    </div>
  )
}
