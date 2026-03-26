import Link from 'next/link'

export default function WantedBooksSection({ wantedBooks }) {
  if (!wantedBooks?.length) return null

  return (
    <section className="py-12 sm:py-16 bg-[var(--accent)]/10 border-y border-[var(--accent)]/20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2 text-center">
          Aranıyor: Gezgin Kitaplar
        </h2>
        <p className="text-[var(--text-light)] text-center mb-8 max-w-2xl mx-auto">
          Bu kitaplardan 14 gündür kayıt alınmadı. Bulan ilk kişi sürpriz ödül kazanabilir.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {wantedBooks.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/book/${pkg.code}`}
              className="rounded-xl bg-white border-2 border-[var(--accent)]/30 px-6 py-4 shadow-sm hover:shadow-md hover:border-[var(--accent)] transition-all font-semibold text-[var(--foreground)]"
            >
              {pkg.code} nolu kitap
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
