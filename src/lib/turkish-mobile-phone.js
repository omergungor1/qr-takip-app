/**
 * Türkiye cep telefonu: 11 hane, 05 ile başlar — görünüm 05XX XXX XX XX
 */

export function normalizeTurkishMobileDigits(raw) {
  let d = String(raw || '').replace(/\D/g, '')
  if (d.startsWith('90') && d.length >= 12) {
    d = '0' + d.slice(2)
  }
  if (d.length > 0 && d[0] === '5') {
    d = '0' + d
  }
  return d.slice(0, 11)
}

export function formatTurkishMobileDisplay(raw) {
  const d = normalizeTurkishMobileDigits(raw)
  if (d.length === 0) return ''
  const a = d.slice(0, 4)
  const b = d.slice(4, 7)
  const c = d.slice(7, 9)
  const e = d.slice(9, 11)
  let out = a
  if (b) out += ' ' + b
  if (c) out += ' ' + c
  if (e) out += ' ' + e
  return out
}

export function isValidTurkishMobileDigits(raw) {
  const d = normalizeTurkishMobileDigits(raw)
  return /^05\d{9}$/.test(d)
}
