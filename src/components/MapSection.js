'use client'

import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import Link from 'next/link'
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { totalKmFromScans } from '@/lib/utils'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
const ALL_ROUTES_SOURCE_ID = 'all-routes-source'
const ALL_ROUTES_LAYER_ID = 'all-routes-layer'

/** Her kitap için farklı renk – minimal, ayırt edilebilir palet */
const ROUTE_PALETTE = [
  '#E85D04', // turuncu
  '#2D6A4F', // yeşil
  '#1D3557', // lacivert
  '#6A0572', // mor
  '#B5179E', // pembe
  '#06A77D', // camgöbeği
  '#C1121F', // kırmızı
  '#457B9D', // mavi
  '#CA6702', // amber
  '#5C4D7D', // eflatun
]

function getRouteCoordinates(pkg) {
  const scans = (pkg?.package_scans || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  return scans
    .filter((s) => s.longitude != null && s.latitude != null)
    .map((s) => [Number(s.longitude), Number(s.latitude)])
}

/** Kitap indeksine ve yolculuk yoğunluğuna göre rota stili (renk, kalınlık, opacity) */
function getRouteStyle(pkg, index, maxScans) {
  const scanCount = (pkg?.package_scans || []).length
  const ratio = maxScans > 0 ? Math.min(scanCount / maxScans, 1) : 0
  const color = ROUTE_PALETTE[index % ROUTE_PALETTE.length]
  const lineWidth = 1.5 + ratio * 3.5   // 1.5 – 5 px: az gezen ince, çok gezen kalın
  const lineOpacity = 0.45 + ratio * 0.5  // 0.45 – 0.95: az gezen soluk, çok gezen belirgin
  return { color, lineWidth, lineOpacity }
}

function getAllRoutesGeoJSON(packages) {
  const maxScans = Math.max(1, ...(packages || []).map((p) => (p.package_scans || []).length))
  const features = (packages || [])
    .map((pkg, index) => {
      const coords = getRouteCoordinates(pkg)
      if (coords.length < 2) return null
      const { color, lineWidth, lineOpacity } = getRouteStyle(pkg, index, maxScans)
      return {
        type: 'Feature',
        properties: { color, lineWidth, lineOpacity },
        geometry: { type: 'LineString', coordinates: coords },
      }
    })
    .filter(Boolean)
  return { type: 'FeatureCollection', features }
}

export default function MapSection({ packages }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [viewState, setViewState] = useState({
    longitude: 32.85,
    latitude: 39.1,
    zoom: 5.2,
  })
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [lastPositions, setLastPositions] = useState({})

  useEffect(() => {
    if (!packages?.length) return
    const positions = {}
    packages.forEach((pkg) => {
      const scans = (pkg.package_scans || []).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      )
      if (scans.length > 0) {
        const last = scans[scans.length - 1]
        positions[pkg.id] = { lat: Number(last.latitude), lng: Number(last.longitude) }
      }
    })
    setLastPositions(positions)
  }, [packages])

  const drawAllRoutes = useCallback((map) => {
    if (!map || !packages?.length) return
    try {
      const geojson = getAllRoutesGeoJSON(packages)
      if (geojson.features.length === 0) return
      if (map.getSource(ALL_ROUTES_SOURCE_ID)) {
        map.getSource(ALL_ROUTES_SOURCE_ID).setData(geojson)
        return
      }
      map.addSource(ALL_ROUTES_SOURCE_ID, {
        type: 'geojson',
        data: geojson,
      })
      map.addLayer({
        id: ALL_ROUTES_LAYER_ID,
        type: 'line',
        source: ALL_ROUTES_SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'lineWidth'],
          'line-opacity': ['get', 'lineOpacity'],
        },
      })
    } catch (e) {
      // ignore
    }
  }, [packages])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (map) drawAllRoutes(map)
  }, [drawAllRoutes])

  const handleMapLoad = useCallback((e) => {
    mapInstanceRef.current = e.target
    drawAllRoutes(e.target)
  }, [drawAllRoutes])

  const handleMarkerClick = useCallback((pkg) => {
    setSelectedPackage(pkg)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedPackage(null)
  }, [])

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-2xl text-slate-600">
        <p>Harita için NEXT_PUBLIC_MAPBOX_TOKEN tanımlayın.</p>
      </div>
    )
  }

  const maxScans = useMemo(
    () => Math.max(1, ...(packages || []).map((p) => (p.package_scans || []).length)),
    [packages]
  )

  const getBookStats = (pkg) => {
    const scans = pkg?.package_scans || []
    const totalCheckins = scans.length
    const cities = new Set(scans.map((s) => s.province).filter(Boolean)).size
    const km = totalKmFromScans(scans)
    const lastScan = scans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    const lastCity = lastScan?.province || '—'
    return { totalCheckins, cities, km, lastCity }
  }

  return (
    <div className="h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        {packages?.map((pkg, index) => {
          const pos = lastPositions[pkg.id]
          if (!pos) return null
          const { color } = getRouteStyle(pkg, index, maxScans)
          return (
            <Marker
              key={pkg.id}
              longitude={pos.lng}
              latitude={pos.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleMarkerClick(pkg)
              }}
              style={{ cursor: 'pointer' }}
            >
              <div
                className="p-2 rounded-full shadow-md hover:opacity-90 transition-opacity flex items-center justify-center border-2 border-white"
                style={{ backgroundColor: color }}
                title={pkg.title || pkg.code}
              >
                <svg className="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                </svg>
              </div>
            </Marker>
          )
        })}
        {selectedPackage && (() => {
          const pos = lastPositions[selectedPackage.id]
          if (!pos) return null
          const stats = getBookStats(selectedPackage)
          const selectedIndex = packages?.findIndex((p) => p.id === selectedPackage.id) ?? 0
          const { color: bookColor } = getRouteStyle(selectedPackage, selectedIndex, maxScans)
          const sponsorLogoUrl = selectedPackage.sponsor_logo
            ? (selectedPackage.sponsor_logo.startsWith('http') || selectedPackage.sponsor_logo.startsWith('/')
              ? selectedPackage.sponsor_logo
              : `/${selectedPackage.sponsor_logo.replace(/^\//, '')}`)
            : null
          return (
            <Popup
              longitude={pos.lng}
              latitude={pos.lat}
              onClose={handleClosePopup}
              closeButton={false}
              closeOnClick={false}
            >
              <div className="p-2 min-w-[220px] max-w-[280px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">{selectedPackage.title || selectedPackage.code} nolu kitap</p>
                    <p className="text-sm text-slate-600 mt-1">Son konum: {stats.lastCity}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500 shrink-0"
                    aria-label="Kapat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  <li>Toplam check-in: <strong>{stats.totalCheckins}</strong></li>
                  <li>Gezilen şehir: <strong>{stats.cities}</strong></li>
                  <li>Toplam km: <strong>{stats.km} km</strong></li>
                </ul>
                {selectedPackage.sponsor_name && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <span className="text-xs text-slate-500">Sponsor:</span>
                    {sponsorLogoUrl ? (
                      <img
                        src={sponsorLogoUrl}
                        alt={selectedPackage.sponsor_name}
                        className="h-6 w-auto object-contain max-w-[100px]"
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-700">{selectedPackage.sponsor_name}</span>
                    )}
                  </div>
                )}
                <Link
                  href={`/book/${selectedPackage.code}`}
                  className="mt-4 block w-full text-center rounded-xl text-white text-sm font-semibold py-2.5 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: bookColor }}
                >
                  Kitap pasaportu
                </Link>
              </div>
            </Popup>
          )
        })()}
      </Map>
    </div>
  )
}
