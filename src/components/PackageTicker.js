'use client'

function getLastCity(pkg) {
  const scans = (pkg?.package_scans || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  const last = scans[scans.length - 1]
  return last?.province || null
}

function cityDative(city) {
  if (!city) return ''
  const last = city.slice(-1).toLowerCase()
  const vowel = /[aeıioöuü]/.test(last)
  return vowel ? `${city}'ya` : `${city}'a`
}

export default function PackageTicker({ packages }) {
  const items = (packages || [])
    .map((pkg) => {
      const name = pkg.title || `${pkg.code} nolu kitap` || 'Kitap'
      const city = getLastCity(pkg)
      return city
        ? { id: pkg.id, text: `${pkg.code} nolu kitap ${cityDative(city)} ulaştı` }
        : { id: pkg.id, text: `${pkg.code} nolu kitap henüz yola çıkmadı` }
    })
    .filter(Boolean)

  if (items.length === 0) return null

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-1 py-0">
        <span className="flex shrink-0 items-center gap-1 bg-[var(--primary)] px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white rounded-l-xl">
          <svg className="hidden sm:block h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Son Duraklar
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="animate-ticker flex w-max items-center gap-8 py-0.5 pl-4 sm:pl-8">
            {[...items, ...items].map((item, i) => (
              <span
                key={`${item.id}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--secondary)]" aria-hidden />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
