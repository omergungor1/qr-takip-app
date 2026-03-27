'use client'

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { totalKmFromScans } from '@/lib/utils'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
const ALL_ROUTES_SOURCE_ID = 'all-routes-source'
const ALL_ROUTES_LAYER_ID = 'all-routes-layer'

/** Mobil: Türkiye’nin tamamı görünsün (daha düşük zoom) */
const VIEW_MOBILE = { longitude: 35, latitude: 39, zoom: 4.25 }
const VIEW_DESKTOP = { longitude: 32.85, latitude: 39.1, zoom: 5.2 }
const MOBILE_MQ = '(max-width: 639px)'

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
  const scans = (pkg?.package_scans || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  return scans
    .filter((s) => s.longitude != null && s.latitude != null)
    .map((s) => [Number(s.longitude), Number(s.latitude)])
}

function getScansWithCoords(pkg) {
  const scans = (pkg?.package_scans || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  return scans
    .filter((s) => s.longitude != null && s.latitude != null)
    .map((s) => ({
      ...s,
      lat: Number(s.latitude),
      lng: Number(s.longitude),
    }))
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

export default function MapSection({ packages, recentScanMessages = [] }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const mapContainerRef = useRef(null)
  const [viewState, setViewState] = useState({
    longitude: VIEW_DESKTOP.longitude,
    latitude: VIEW_DESKTOP.latitude,
    zoom: VIEW_DESKTOP.zoom,
  })
  const [mapReady, setMapReady] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedStop, setSelectedStop] = useState(null)
  const [lastPositions, setLastPositions] = useState({})

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const applyViewport = () => {
      const mobile = mq.matches
      setViewState((prev) => ({
        ...prev,
        ...(mobile ? VIEW_MOBILE : VIEW_DESKTOP),
      }))
    }
    applyViewport()
    mq.addEventListener('change', applyViewport)
    return () => mq.removeEventListener('change', applyViewport)
  }, [])

  useEffect(() => {
    if (!packages?.length) return
    const positions = {}
    packages.forEach((pkg) => {
      const scans = getScansWithCoords(pkg)
      if (scans.length > 0) {
        const last = scans[scans.length - 1]
        positions[pkg.id] = { lat: last.lat, lng: last.lng }
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
    setMapReady(true)
    requestAnimationFrame(() => {
      try {
        e.target.resize()
      } catch {
        /* ignore */
      }
    })
  }, [drawAllRoutes])

  useEffect(() => {
    if (!mapReady) return
    const mapboxMap = mapRef.current?.getMap?.()
    if (!mapboxMap) return

    const resizeMap = () => {
      try {
        mapboxMap.resize()
      } catch {
        /* ignore */
      }
    }

    resizeMap()
    const t0 = requestAnimationFrame(resizeMap)
    const t1 = requestAnimationFrame(() => requestAnimationFrame(resizeMap))

    window.addEventListener('resize', resizeMap)
    window.addEventListener('orientationchange', resizeMap)

    const node = mapContainerRef.current
    let ro
    if (node && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resizeMap)
      ro.observe(node)
    }

    return () => {
      cancelAnimationFrame(t0)
      cancelAnimationFrame(t1)
      window.removeEventListener('resize', resizeMap)
      window.removeEventListener('orientationchange', resizeMap)
      ro?.disconnect()
    }
  }, [mapReady])

  const handleMarkerClick = useCallback((pkg) => {
    setSelectedStop(null)
    setSelectedPackage(pkg)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedPackage(null)
  }, [])

  const focusPointForPopup = useCallback((lng, lat) => {
    const map = mapRef.current?.getMap?.()
    if (!map) return
    try {
      const h = typeof window !== 'undefined' ? window.innerHeight : 800
      const offsetY = Math.round(Math.min(160, Math.max(90, h * 0.18)))
      map.easeTo({
        center: [lng, lat],
        duration: 450,
        offset: [0, offsetY],
      })
    } catch {
      // ignore
    }
  }, [])

  const handleStopClick = useCallback((payload) => {
    focusPointForPopup(payload.scan.lng, payload.scan.lat)
    setSelectedPackage(null)
    setSelectedStop(payload)
  }, [focusPointForPopup])

  const handleCloseStopPopup = useCallback(() => {
    setSelectedStop(null)
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

  const tickerItems =
    recentScanMessages.length > 0
      ? recentScanMessages
      : [{ id: 'placeholder', date: '', message: 'Henüz onaylı okur mesajı yok.' }]

  const messageList = (
    <>
      {tickerItems.map((item) => (
        <div
          key={`a-${item.id}`}
          className="flex flex-col gap-1 p-3 rounded-xl bg-white/90 backdrop-blur border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          {item.date ? (
            <span className="text-xs font-medium text-[var(--primary)]">{item.date}</span>
          ) : null}
          <p className="text-sm text-[var(--foreground)] leading-snug">{item.message}</p>
        </div>
      ))}
      {tickerItems.map((item) => (
        <div
          key={`b-${item.id}`}
          className="flex flex-col gap-1 p-3 rounded-xl bg-white/90 backdrop-blur border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          {item.date ? (
            <span className="text-xs font-medium text-[var(--primary)]">{item.date}</span>
          ) : null}
          <p className="text-sm text-[var(--foreground)] leading-snug">{item.message}</p>
        </div>
      ))}
    </>
  )

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full min-w-0">
      <div
        ref={mapContainerRef}
        className="relative w-full min-w-0 min-h-[400px] sm:min-h-[500px] h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 isolate"
      >
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={() => {
            setSelectedPackage(null)
            setSelectedStop(null)
          }}
          onLoad={handleMapLoad}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />
          <FullscreenControl position="top-right" />
          {packages?.map((pkg, index) => {
            const routeScans = getScansWithCoords(pkg)
            if (!routeScans.length) return null

            const firstPos = routeScans[0]
            const pos = routeScans[routeScans.length - 1]
            const intermediateStops = routeScans.slice(1, -1)
            const { color } = getRouteStyle(pkg, index, maxScans)

            return (
              <Fragment key={pkg.id}>
                {routeScans.length > 1 && (
                  <Marker
                    key={`${pkg.id}-first`}
                    longitude={firstPos.lng}
                    latitude={firstPos.lat}
                    anchor="center"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation()
                      handleStopClick({
                        pkg,
                        scan: firstPos,
                        stopIndex: 0,
                        totalStops: routeScans.length,
                        color,
                      })
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border bg-violet-100 shadow-[0_1px_3px_rgba(0,0,0,0.18)] flex items-center justify-center"
                      style={{ borderColor: '#5B21B6' }}
                      title={`${pkg.title || pkg.code} - ilk durak`}
                    >
                      <Image src="/logo.png" alt="" width={8} height={8} className="rounded-full object-contain opacity-80" />
                    </div>
                  </Marker>
                )}

                {intermediateStops.map((stop, i) => (
                  <Marker
                    key={`${pkg.id}-mid-${i}-${stop.created_at}`}
                    longitude={stop.lng}
                    latitude={stop.lat}
                    anchor="center"
                    onClick={(e) => {
                      e.originalEvent.stopPropagation()
                      handleStopClick({
                        pkg,
                        scan: stop,
                        stopIndex: i + 1,
                        totalStops: routeScans.length,
                        color,
                      })
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.18)] flex items-center justify-center"
                      style={{ borderColor: `${color}CC` }}
                      title={`${pkg.title || pkg.code} - ara durak`}
                    >
                      <Image src="/logo.png" alt="" width={8} height={8} className="rounded-full object-contain opacity-70" />
                    </div>
                  </Marker>
                ))}

                <Marker
                  key={pkg.id}
                  longitude={pos.lng}
                  latitude={pos.lat}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    focusPointForPopup(pos.lng, pos.lat)
                    setSelectedStop(null)
                    handleMarkerClick(pkg)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="p-1 rounded-full shadow-md hover:opacity-90 transition-opacity flex items-center justify-center border-2 border-white bg-white"
                    style={{ borderColor: color }}
                    title={`${pkg.title || pkg.code} - son durak`}
                  >
                    <Image src="/logo.png" alt="" width={28} height={28} className="rounded-full object-contain" />
                  </div>
                </Marker>
              </Fragment>
            )
          })}
          {selectedStop && (() => {
            const pkg = selectedStop.pkg
            const scan = selectedStop.scan
            const stopIndex = selectedStop.stopIndex
            const totalStops = selectedStop.totalStops
            const bookColor = selectedStop.color

            const title = pkg?.title || pkg?.code
            const loc = scan?.district ? `${scan.province} / ${scan.district}` : scan?.province || '—'
            const when = scan?.created_at ? new Date(scan.created_at).toLocaleString('tr-TR') : '—'
            const message = scan?.message || '—'
            const imageUrl = scan?.image_path || null

            return (
              <Popup
                longitude={scan.lng}
                latitude={scan.lat}
                onClose={handleCloseStopPopup}
                closeButton={false}
                closeOnClick={false}
                anchor="bottom"
                offset={14}
                maxWidth="340px"
              >
                <div className="p-2 sm:p-2.5 min-w-[180px] max-w-[220px] sm:min-w-[260px] sm:max-w-[320px]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate text-sm sm:text-base">{title} nolu kitap</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Durak <strong>{stopIndex + 1}</strong> / {totalStops}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2">{loc}</p>
                      <p className="text-xs text-slate-500 mt-1">{when}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseStopPopup}
                      className="p-1 rounded hover:bg-slate-100 text-slate-500 shrink-0"
                      aria-label="Kapat"
                    >
                      <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {imageUrl && (
                    <div className="mt-2 w-full aspect-[16/10] max-h-[80px] sm:max-h-[140px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="mt-2 rounded-xl bg-slate-50 border border-slate-100 p-2">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Mesaj</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words line-clamp-3 sm:line-clamp-4">{message}</p>
                  </div>

                  <Link
                    href={`/book/${pkg.code}`}
                    className="mt-2.5 block w-full text-center rounded-xl text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: bookColor }}
                  >
                    Kitap pasaportu
                  </Link>
                </div>
              </Popup>
            )
          })()}
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
                    <li>Toplam kayıt: <strong>{stats.totalCheckins}</strong></li>
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
      <aside className="w-full sm:w-72 h-[320px] sm:h-[500px] shrink-0 flex flex-col rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-[var(--background)]">
        <div className="px-4 py-3 border-b border-slate-200 bg-white/80 shrink-0">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Okur mesajları</h3>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 w-full animate-ticker-vertical">
            <div className="flex flex-col gap-3 p-4">
              {messageList}
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
