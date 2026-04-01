import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

function looksLikeHtml(input) {
  if (!input) return false
  const s = String(input).trim()
  if (!s) return false
  // Basit bir heuristik: HTML tag'leri varsa eski içerikler için bozmadan geçelim.
  return /<\/?[a-z][\s\S]*>/i.test(s)
}

function addTargetBlankToLinks(html) {
  if (!html) return html
  // target yoksa ekle, rel yoksa ekle. (basit ama pratik)
  return String(html).replace(/<a\b([^>]*?)>/gi, (full, attrs) => {
    const hasHref = /\bhref\s*=\s*['"][^'"]+['"]/i.test(attrs)
    if (!hasHref) return full
    // sayfa içi anchor'ları (#...) zorlamayalım
    const isHash = /\bhref\s*=\s*['"]#/i.test(attrs)
    if (isHash) return full

    const hasTarget = /\btarget\s*=/i.test(attrs)
    const hasRel = /\brel\s*=/i.test(attrs)

    let nextAttrs = attrs
    if (!hasTarget) nextAttrs += ' target="_blank"'
    if (!hasRel) nextAttrs += ' rel="noopener noreferrer"'
    return `<a${nextAttrs}>`
  })
}

export async function contentToHtml(content) {
  const raw = (content || '').toString()
  if (!raw.trim()) return ''
  if (looksLikeHtml(raw)) return addTargetBlankToLinks(raw)

  const file = await remark()
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkHtml, { sanitize: false })
    .process(raw)

  return addTargetBlankToLinks(String(file))
}

