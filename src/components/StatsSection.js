export default function StatsSection({ stats }) {
  const s = stats || {}
  const items = [
    { label: 'Toplam Kitap', value: s.totalPackages ?? 0, suffix: '' },
    { label: 'Toplam Check-in', value: s.totalScans ?? 0, suffix: '' },
    { label: 'Gezilen Şehir', value: s.citiesVisited ?? 0, suffix: '' },
    { label: 'Toplam KM', value: s.totalKm ?? 0, suffix: ' km' },
  ]

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)] mb-8">
          Proje İstatistikleri
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-[var(--background)] rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-[var(--primary)]/20 transition-all duration-300"
            >
              <p className="text-3xl sm:text-4xl font-bold text-[var(--primary)]">
                {item.value}
                {item.suffix}
              </p>
              <p className="text-[var(--text-light)] mt-1 text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
