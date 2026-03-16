'use client'

import { useMemo } from 'react'
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
            <dt className="text-xs uppercase text-[var(--text-light)]">İlk check-in</dt>
            <dd className="font-semibold text-[var(--foreground)]">
              {pkg.firstCheckInAt
                ? new Date(pkg.firstCheckInAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-[var(--text-light)]">Toplam check-in</dt>
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
              mapStyle="mapbox://styles/mapbox/light-v11"
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
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                    </svg>
                  </div>
                </Marker>
              )}
              <NavigationControl position="top-right" />
            </Map>
          </div>
        </section>
      )}

      {scans.some((s) => s.image_path) && (
        <section className="p-4 sm:p-6 border-t border-slate-100">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Fotoğraf galerisi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {scans.filter((s) => s.image_path).map((scan) => (
              <div key={scan.id} className="rounded-xl overflow-hidden border border-slate-200 aspect-square relative bg-slate-100">
                <Image
                  src={scan.image_path}
                  alt={scan.province || 'Check-in'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                  {scan.province}{scan.district ? ` / ${scan.district}` : ''} · {new Date(scan.created_at).toLocaleDateString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="p-4 sm:p-6 border-t border-slate-100">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">Check-in listesi</h2>
        {scans.length === 0 ? (
          <p className="text-[var(--text-light)]">Henüz check-in yok.</p>
        ) : (
          <ul className="space-y-3">
            {scans.map((scan, idx) => (
              <li
                key={scan.id}
                className="flex gap-4 p-4 rounded-xl bg-[var(--background)] border border-slate-100"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-semibold">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--foreground)]">
                    {scan.province || '—'}
                    {scan.district ? ` / ${scan.district}` : ''}
                  </p>
                  <p className="text-sm text-[var(--text-light)]">
                    {new Date(scan.created_at).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {scan.message && (
                    <p className="text-sm text-slate-600 mt-1">{scan.message}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50">
        <Link
          href="/harita"
          className="inline-flex rounded-xl border-2 border-[var(--primary)] text-[var(--primary)] font-semibold px-6 py-2.5 hover:bg-[var(--primary)]/10"
        >
          Haritaya dön
        </Link>
      </footer>
    </article>
  )
}
