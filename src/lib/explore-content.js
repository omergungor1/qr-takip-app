import { getStorageUrl } from '@/lib/utils'
import { getTurizmCategoryLabel } from '@/lib/turizm-categories'

export function mapExploreRow(row) {
  return {
    ...row,
    cover_url: row?.cover_image ? getStorageUrl(row.cover_image) : null,
    category_label: getTurizmCategoryLabel(row?.category),
  }
}

export function toExploreSlug(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

