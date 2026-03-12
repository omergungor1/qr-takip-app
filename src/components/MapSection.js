'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
const ROUTE_SOURCE_ID = 'route-line-source'
const ROUTE_LAYER_ID = 'route-line-layer'
const ANIMATION_DURATION_MS = 15000
const PRELOAD_IMAGE_TIMEOUT_MS = 4000

function getRouteCoordinates(pkg) {
  const scans = (pkg?.package_scans || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  return scans
    .filter((s) => s.longitude != null && s.latitude != null)
    .map((s) => [Number(s.longitude), Number(s.latitude)])
}

function getRouteScans(pkg) {
  return (pkg?.package_scans || [])
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .filter((s) => s.longitude != null && s.latitude != null)
}

function interpolatePosition(coords, progress) {
  if (!coords?.length) return null
  if (coords.length === 1) return { lng: coords[0][0], lat: coords[0][1] }
  const index = progress * (coords.length - 1)
  const i = Math.min(Math.floor(index), coords.length - 2)
  const t = index - i
  return {
    lng: coords[i][0] + t * (coords[i + 1][0] - coords[i][0]),
    lat: coords[i][1] + t * (coords[i + 1][1] - coords[i][1]),
  }
}

export default function MapSection({ packages, onPackageClick }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const animFrameRef = useRef(null)
  const [viewState, setViewState] = useState({
    longitude: 32.85,
    latitude: 39.1,
    zoom: 5.2,
  })
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [lastPositions, setLastPositions] = useState({})
  const [animatingPackageId, setAnimatingPackageId] = useState(null)
  const [animatedPosition, setAnimatedPosition] = useState(null)
  const [currentScanIndex, setCurrentScanIndex] = useState(null)

  useEffect(() => {
    if (!packages?.length) return
    const positions = {}
    packages.forEach((pkg) => {
      const scans = pkg.package_scans || []
      if (scans.length > 0) {
        const last = scans[scans.length - 1]
        positions[pkg.id] = { lat: Number(last.latitude), lng: Number(last.longitude) }
      }
    })
    setLastPositions(positions)
  }, [packages])

  const addRouteLine = useCallback((map, coords) => {
    if (!map || !coords || coords.length < 2) return
    try {
      if (map.getSource(ROUTE_SOURCE_ID)) {
        map.removeLayer(ROUTE_LAYER_ID)
        map.removeSource(ROUTE_SOURCE_ID)
      }
      map.addSource(ROUTE_SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: coords },
        },
      })
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f59e0b',
          'line-width': 4,
          'line-dasharray': [2, 1.5],
        },
      })
    } catch (e) {
      // ignore if already exists
    }
  }, [])

  const removeRouteLine = useCallback((map) => {
    if (!map) return
    try {
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID)
    } catch (_) { }
  }, [])

  useEffect(() => {
    if (!animatingPackageId) return
    const pkg = packages?.find((p) => p.id === animatingPackageId)
    const coords = pkg ? getRouteCoordinates(pkg) : []
    const routeScans = pkg ? getRouteScans(pkg) : []
    const map = mapInstanceRef.current
    if (coords.length >= 2 && map) addRouteLine(map, coords)

    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1)
      setAnimatedPosition(interpolatePosition(coords, progress))
      const scanIdx = routeScans.length > 0
        ? Math.min(Math.floor(progress * routeScans.length), routeScans.length - 1)
        : 0
      setCurrentScanIndex(scanIdx)
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick)
      } else {
        setAnimatingPackageId(null)
        setAnimatedPosition(null)
        setCurrentScanIndex(null)
        if (map) removeRouteLine(map)
      }
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (map) removeRouteLine(map)
      setCurrentScanIndex(null)
    }
  }, [animatingPackageId, packages, addRouteLine, removeRouteLine])

  const handleMarkerClick = useCallback((pkg) => {
    setSelectedPackage(pkg)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedPackage(null)
    setAnimatingPackageId(null)
    setAnimatedPosition(null)
    setCurrentScanIndex(null)
    const map = mapInstanceRef.current
    if (map) removeRouteLine(map)
  }, [removeRouteLine])

  const handlePlay = useCallback(() => {
    if (!selectedPackage) return
    const coords = getRouteCoordinates(selectedPackage)
    if (coords.length < 2) return
    const routeScans = getRouteScans(selectedPackage)
    const firstImage = routeScans[0]?.image_path
    const startAnimation = () => setAnimatingPackageId(selectedPackage.id)
    if (firstImage) {
      const img = new Image()
      const timeout = setTimeout(startAnimation, PRELOAD_IMAGE_TIMEOUT_MS)
      img.onload = () => {
        clearTimeout(timeout)
        startAnimation()
      }
      img.onerror = () => {
        clearTimeout(timeout)
        startAnimation()
      }
      img.src = firstImage
    } else {
      startAnimation()
    }
  }, [selectedPackage])

  const handleOpenDetail = useCallback(() => {
    if (selectedPackage) onPackageClick?.(selectedPackage)
    handleClosePopup()
  }, [selectedPackage, onPackageClick])

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-slate-100 rounded-2xl text-slate-600">
        <p>Harita için NEXT_PUBLIC_MAPBOX_TOKEN tanımlayın.</p>
      </div>
    )
  }

  return (
    <div className="h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onLoad={(e) => { mapInstanceRef.current = e.target }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        {/* Ziyaret noktaları: animasyon sırasında geçilen noktalar yeşil tik, diğerleri boş daire */}
        {animatingPackageId && (() => {
          const pkg = packages?.find((p) => p.id === animatingPackageId)
          const routeScans = pkg ? getRouteScans(pkg) : []
          return routeScans.map((scan, idx) => {
            const passed = currentScanIndex != null && idx <= currentScanIndex
            const lng = Number(scan.longitude)
            const lat = Number(scan.latitude)
            if (Number.isNaN(lng) || Number.isNaN(lat)) return null
            return (
              <Marker
                key={`route-${pkg.id}-${scan.id}-${idx}`}
                longitude={lng}
                latitude={lat}
                anchor="center"
                style={{ pointerEvents: 'none' }}
              >
                <div
                  className={`flex items-center justify-center rounded-full shadow-md ${passed ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-300'}`}
                  style={{ width: 24, height: 24 }}
                  title={scan.province ? `${scan.province}${scan.district ? ` / ${scan.district}` : ''}` : 'Ziyaret noktası'}
                >
                  {passed ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  )}
                </div>
              </Marker>
            )
          })
        })()}
        {packages?.map((pkg) => {
          const isAnimating = animatingPackageId === pkg.id
          const pos = isAnimating && animatedPosition
            ? { lat: animatedPosition.lat, lng: animatedPosition.lng }
            : lastPositions[pkg.id]
          if (!pos) return null
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
                className={`bg-amber-500 text-white p-2 rounded-full shadow-md hover:bg-amber-600 transition-colors flex items-center justify-center ${isAnimating ? 'animate-package-bounce' : ''}`}
                title={pkg.title || pkg.code}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z" />
                </svg>
              </div>
            </Marker>
          )
        })}
        {selectedPackage && (() => {
          const isAnimatingThis = animatingPackageId === selectedPackage.id
          const routeCoords = getRouteCoordinates(selectedPackage)
          const routeScans = getRouteScans(selectedPackage)
          const currentScan = isAnimatingThis && currentScanIndex != null && routeScans[currentScanIndex]
          const popupLng = isAnimatingThis
            ? (animatedPosition?.lng ?? routeCoords[0]?.[0] ?? lastPositions[selectedPackage.id]?.lng)
            : lastPositions[selectedPackage.id]?.lng
          const popupLat = isAnimatingThis
            ? (animatedPosition?.lat ?? routeCoords[0]?.[1] ?? lastPositions[selectedPackage.id]?.lat)
            : lastPositions[selectedPackage.id]?.lat
          return (
            <Popup
              longitude={popupLng}
              latitude={popupLat}
              onClose={handleClosePopup}
              closeButton
              closeOnClick={false}
            >
              <div className="p-2 min-w-[200px] max-w-[280px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">{selectedPackage.title || selectedPackage.code}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{selectedPackage.description || 'Gezgin paket'}</p>
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
                {currentScan && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                    <p className="text-sm font-medium text-slate-800">
                      {currentScan.province || '—'}
                      {currentScan.district ? ` / ${currentScan.district}` : ''}
                      {currentScan.created_at && (
                        <span className="text-slate-500 font-normal ml-1">
                          · {new Date(currentScan.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </p>
                    {currentScan.message && (
                      <p className="text-xs text-slate-600">{currentScan.message}</p>
                    )}
                    {currentScan.image_path && (
                      <div className="relative w-full aspect-video rounded overflow-hidden bg-slate-200">
                        <img
                          src={currentScan.image_path}
                          alt="Paylaşım"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handlePlay}
                    disabled={!(selectedPackage.package_scans?.length >= 2)}
                    className="flex-1 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Oynat
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenDetail}
                    className="flex-1 py-2 rounded-lg border border-amber-500 text-amber-600 text-sm font-medium hover:bg-amber-50"
                  >
                    Detay
                  </button>
                </div>
              </div>
            </Popup>
          )
        })()}
      </Map>
    </div>
  )
}
