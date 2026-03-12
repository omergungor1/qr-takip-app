'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function MapSection({ packages, onPackageClick }) {
  const mapRef = useRef(null)
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
      const scans = pkg.package_scans || []
      if (scans.length > 0) {
        const last = scans[scans.length - 1]
        positions[pkg.id] = { lat: Number(last.latitude), lng: Number(last.longitude) }
      }
    })
    setLastPositions(positions)
  }, [packages])

  const handleMarkerClick = useCallback(
    (pkg) => {
      setSelectedPackage(pkg)
      onPackageClick?.(pkg)
    },
    [onPackageClick]
  )

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
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        {packages?.map((pkg) => {
          const pos = lastPositions[pkg.id]
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
                className="bg-amber-500 text-white p-2 rounded-full shadow-md hover:bg-amber-600 transition-colors flex items-center justify-center"
                title={pkg.title || pkg.code}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm10 16H4V9h16v11z" />
                </svg>
              </div>
            </Marker>
          )
        })}
        {selectedPackage && (
          <Popup
            longitude={lastPositions[selectedPackage.id]?.lng}
            latitude={lastPositions[selectedPackage.id]?.lat}
            onClose={() => setSelectedPackage(null)}
            closeButton
            closeOnClick={false}
          >
            <div className="p-2 min-w-[180px]">
              <p className="font-semibold text-slate-800">{selectedPackage.title || selectedPackage.code}</p>
              <p className="text-sm text-slate-600">{selectedPackage.description || 'Gezgin paket'}</p>
              <button
                type="button"
                onClick={() => {
                  onPackageClick?.(selectedPackage)
                  setSelectedPackage(null)
                }}
                className="mt-2 w-full py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium"
              >
                Detay & yolculuk geçmişi
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
