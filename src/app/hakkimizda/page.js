import HakkimizdaAccordion from '@/components/HakkimizdaAccordion'

export const metadata = {
  title: 'Proje Hakkında | GezginKitap',
  description: 'GezginKitap projesi: Kitaplar Türkiye\'yi geziyor. Bir kitabı bul, kayıt yap ve başka bir şehre bırak.',
}

export default function HakkimizdaPage() {
  return (
    <div className="py-12 sm:py-16 bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-8 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Proje Hakkında
        </h1>
        <HakkimizdaAccordion />
      </div>
    </div>
  )
}
