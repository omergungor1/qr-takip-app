/** Keşfet kategorileri — liste ve detay rotalarında ortak kullanım */
export const TURIZM_CATEGORIES = [
  { id: 'gitmelisin', label: 'Gitmelisin' },
  { id: 'kalmalisin', label: 'Kalmalısın' },
  { id: 'gormelisin', label: 'Görmelisin' },
  { id: 'almalisin', label: 'Almalısın' },
  { id: 'tatmalisin', label: 'Tatmalısın' },
  { id: 'tanismalisin', label: 'Tanışmalısın' },
]

export function isValidTurizmCategory(id) {
  return TURIZM_CATEGORIES.some((c) => c.id === id)
}

export function getTurizmCategoryLabel(id) {
  return TURIZM_CATEGORIES.find((c) => c.id === id)?.label ?? id
}
