const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

export function getStorageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const clean = path.replace(/^\//, '')
  return `${supabaseUrl}/storage/v1/object/public/uploads/${clean}`
}

/** İki koordinat arası yaklaşık mesafe (km) - Haversine */
export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/** Scan listesinden toplam km (ardışık noktalar arası) */
export function totalKmFromScans(scans) {
  const sorted = [...(scans || [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )
  let km = 0
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1]
    const b = sorted[i]
    if (a.latitude != null && a.longitude != null && b.latitude != null && b.longitude != null) {
      km += distanceKm(
        Number(a.latitude),
        Number(a.longitude),
        Number(b.latitude),
        Number(b.longitude)
      )
    }
  }
  return Math.round(km)
}
