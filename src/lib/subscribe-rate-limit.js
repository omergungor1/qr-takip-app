/**
 * Sunucu belleğinde basit pencere sınırlaması (process başına).
 * Çoklu instance / serverless’ta tam koruma için Redis tabanlı limit önerilir.
 */
const buckets = new Map()

function prune(now) {
  if (buckets.size < 2000) return
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k)
  }
}

/**
 * @param {string} key örn. istemci IP
 * @param {number} max pencere içi en fazla deneme
 * @param {number} windowMs pencere süresi (ms)
 * @returns {{ ok: true } | { ok: false, retryAfterSec: number }}
 */
export function consumeRateLimit(key, max, windowMs) {
  const now = Date.now()
  prune(now)
  let b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + windowMs }
    buckets.set(key, b)
  }
  if (b.count >= max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) }
  }
  b.count += 1
  return { ok: true }
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}
