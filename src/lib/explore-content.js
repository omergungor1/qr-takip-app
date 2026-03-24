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
  const trMap = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    I: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  }

  return String(text || '')
    .trim()
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (ch) => trMap[ch] || ch)
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

