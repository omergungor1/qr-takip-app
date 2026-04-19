import { createClient } from '@/lib/supabase-server'
import { getStorageUrl } from '@/lib/utils'

/** Yayınlanmış tek blog + isteğe bağlı gezgin (detay sayfaları için) */
export async function getBlogPostBySlug(slug) {
  const supabase = await createClient()
  const { data: row, error } = await supabase
    .from('blogs')
    .select('*, gezginler ( id, name, description, cover_image )')
    .eq('slug', slug)
    .eq('is_active', true)
    .not('published_at', 'is', null)
    .single()

  if (error || !row) return null

  const rawG = row.gezginler
  const g = Array.isArray(rawG) ? rawG[0] : rawG
  const { gezginler: _drop, ...blog } = row

  const gezgin =
    g && g.name
      ? {
          name: g.name,
          description: g.description,
          avatarUrl: g.cover_image ? getStorageUrl(g.cover_image) : null,
        }
      : null

  return { blog, gezgin }
}
