// Demo: tüm rakamlar statik, aktif proje gibi dolu görünsün
const STATIC_STATS = {
  totalPackages: 24,
  citiesVisited: 48,
  totalKm: 12500,
  totalScans: 320,
}

export default function StatsSection() {
  const items = [
    { label: 'Toplam Paket', value: STATIC_STATS.totalPackages, suffix: '' },
    { label: 'Ziyaret Edilen Şehir', value: STATIC_STATS.citiesVisited, suffix: '' },
    { label: 'Gezilen Kilometre', value: STATIC_STATS.totalKm, suffix: ' km' },
    { label: 'Toplam Paylaşım', value: STATIC_STATS.totalScans, suffix: '' },
  ]

  return (
    <section className="py-12 sm:py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-8">
          Proje İstatistikleri
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, i) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg hover:border-amber-200 transition-all duration-300"
            >
              <p className="text-3xl sm:text-4xl font-bold text-amber-600">
                {item.value}
                {item.suffix}
              </p>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
