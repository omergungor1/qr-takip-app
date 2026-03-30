'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

function getRouteCoordinates(scans) {
  const sorted = [...(scans || [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  return sorted
    .filter((s) => s.longitude != null && s.latitude != null)
    .map((s) => [Number(s.longitude), Number(s.latitude)])
}

export default function BookPassportClient({ pkg }) {
  const [lightbox, setLightbox] = useState(null)
  const scans = (pkg?.package_scans || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  const routeCoords = useMemo(() => getRouteCoordinates(scans), [scans])
  const lastPos = scans.length
    ? { lng: Number(scans[scans.length - 1].longitude), lat: Number(scans[scans.length - 1].latitude) }
    : null

  const sponsorLogoUrl = pkg?.sponsor_logo
    ? (pkg.sponsor_logo.startsWith('http') || pkg.sponsor_logo.startsWith('/')
      ? pkg.sponsor_logo
      : `/${pkg.sponsor_logo.replace(/^\//, '')}`)
    : null

  useEffect(() => {
    if (!lightbox) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox])

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <header className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-br from-[var(--primary)]/5 to-transparent">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-poppins)' }}>
          {pkg.code} Nolu Gezgin Kitap
        </h1>
        {pkg.title && (
          <p className="text-[var(--text-light)] mt-1">{pkg.title}</p>
        )}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div>
            <dt className="text-xs uppercase text-[var(--text-light)]">İlk kayıt tarihi</dt>
            <dd className="font-semibold text-[var(--foreground)]">
              {pkg.firstCheckInAt
                ? new Date(pkg.firstCheckInAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-[var(--text-light)]">Toplam kayıt</dt>
            <dd className="font-semibold text-[var(--foreground)]">{scans.length}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-[var(--text-light)]">Gezilen şehir</dt>
            <dd className="font-semibold text-[var(--foreground)]">{pkg.citiesVisited ?? 0}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-[var(--text-light)]">Toplam km</dt>
            <dd className="font-semibold text-[var(--foreground)]">{pkg.totalKm ?? 0} km</dd>
          </div>
        </dl>
        {pkg.sponsor_name && (
          <div className="mt-6 pt-6 border-t border-slate-200 flex items-center gap-3">
            <span className="text-sm text-[var(--text-light)]">Sponsor:</span>
            {sponsorLogoUrl ? (
              <a
                href={pkg.sponsor_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Image
                  src={sponsorLogoUrl}
                  alt={pkg.sponsor_name}
                  width={120}
                  height={48}
                  className="object-contain max-h-12 w-auto"
                />
              </a>
            ) : (
              <a
                href={pkg.sponsor_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--primary)]"
              >
                {pkg.sponsor_name}
              </a>
            )}
          </div>
        )}
      </header>

      {routeCoords.length >= 2 && MAPBOX_TOKEN && (
        <section className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Rota haritası</h2>
          <div className="h-[300px] rounded-xl overflow-hidden border border-slate-200">
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/navigation-day-v1"
              initialViewState={{
                longitude: routeCoords[0][0],
                latitude: routeCoords[0][1],
                zoom: 5,
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Source
                id="route"
                type="geojson"
                data={{
                  type: 'Feature',
                  properties: {},
                  geometry: { type: 'LineString', coordinates: routeCoords },
                }}
              >
                <Layer
                  id="route-line"
                  type="line"
                  layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                  paint={{
                    'line-color': '#2F855A',
                    'line-width': 4,
                  }}
                />
              </Source>
              {lastPos && (
                <Marker longitude={lastPos.lng} latitude={lastPos.lat} anchor="bottom">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-[var(--primary)] flex items-center justify-center shadow-lg overflow-hidden">
                    <Image src="/logo.png" alt="" width={24} height={24} className="rounded-full object-contain" />
                  </div>
                </Marker>
              )}
              <NavigationControl position="top-right" />
            </Map>
          </div>
        </section>
      )}

      <section className="p-4 sm:p-6 border-t border-slate-100">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Yolculuk zaman çizelgesi</h2>
        {scans.length === 0 ? (
          <p className="text-[var(--text-light)]">Henüz kayıt yok.</p>
        ) : (
          <ol className="space-y-4">
            {scans.map((scan, idx) => (
              <li key={scan.id} className="relative pl-10">
                {/* timeline line */}
                <span className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-200" aria-hidden />
                {/* dot */}
                <span className="absolute left-0 top-1">
                  <span className="w-9 h-9 rounded-full bg-white border-2 border-[var(--primary)] shadow-sm flex items-center justify-center text-[var(--primary)] font-bold text-sm">
                    {idx + 1}
                  </span>
                </span>

                <div className="rounded-2xl bg-[var(--background)] border border-slate-100 p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--foreground)]">
                        {scan.province || '—'}
                        {scan.district ? ` / ${scan.district}` : ''}
                      </p>
                      <p className="text-sm text-[var(--text-light)]">
                        {new Date(scan.created_at).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 text-xs font-semibold">
                      Durak {idx + 1}
                    </span>
                  </div>

                  {scan.message && (
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {scan.message}
                    </p>
                  )}

                  {scan.image_path && (
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({
                          src: scan.image_path,
                          alt: `${scan.province || 'Kayıt'} fotoğraf`,
                        })
                      }
                      className="mt-4 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 text-left hover:shadow-md transition-shadow"
                      aria-label="Fotoğrafı tam ekranda aç"
                    >
                      <div className="relative w-full aspect-[16/10] max-h-[220px] sm:max-h-[280px]">
                        <Image
                          src={scan.image_path}
                          alt={`${scan.province || 'Kayıt'} fotoğraf`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 720px, 768px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
                        <span className="absolute bottom-2 right-2 text-[11px] font-semibold text-white bg-black/55 px-2 py-1 rounded-lg">
                          Tam ekran
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 rounded-full bg-white/95 text-slate-800 shadow-lg flex items-center justify-center hover:bg-white"
              aria-label="Kapat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full max-h-[82vh] rounded-2xl overflow-hidden bg-black border border-white/10">
              <img src={lightbox.src} alt={lightbox.alt || ''} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      <footer className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50">
        <Link
          href="/"
          className="inline-flex rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] font-semibold px-6 py-2.5 hover:bg-[var(--primary)]/10"
        >
          Ana sayfaya dön
        </Link>
      </footer>
    </article>
  )
}
