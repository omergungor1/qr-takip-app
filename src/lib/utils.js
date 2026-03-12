const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

export function getStorageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const clean = path.replace(/^\//, '')
  return `${supabaseUrl}/storage/v1/object/public/uploads/${clean}`
}
