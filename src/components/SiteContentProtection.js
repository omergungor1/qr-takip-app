'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function isFormField(el) {
  if (!el || typeof el.closest !== 'function') return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return Boolean(el.closest('input, textarea, select, [contenteditable="true"]'))
}

export default function SiteContentProtection() {
  const pathname = usePathname()
  const skip = pathname?.startsWith('/admin')

  useEffect(() => {
    if (skip) {
      document.documentElement.classList.remove('site-content-protected')
      return
    }

    document.documentElement.classList.add('site-content-protected')

    const onContextMenu = (e) => {
      e.preventDefault()
    }

    const onCopy = (e) => {
      if (isFormField(e.target)) return
      e.preventDefault()
    }

    const onCut = (e) => {
      if (isFormField(e.target)) return
      e.preventDefault()
    }

    const onDragStart = (e) => {
      const t = e.target
      if (t && (t.tagName === 'IMG' || t.closest?.('img, picture'))) {
        e.preventDefault()
      }
    }

    const onSelectStart = (e) => {
      if (isFormField(e.target)) return
      e.preventDefault()
    }

    const onKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const k = e.key.toLowerCase()
      if (['c', 'x', 'a', 's', 'u'].includes(k)) {
        if (isFormField(e.target)) return
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('copy', onCopy, true)
    document.addEventListener('cut', onCut, true)
    document.addEventListener('dragstart', onDragStart, true)
    document.addEventListener('selectstart', onSelectStart, true)
    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.documentElement.classList.remove('site-content-protected')
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('copy', onCopy, true)
      document.removeEventListener('cut', onCut, true)
      document.removeEventListener('dragstart', onDragStart, true)
      document.removeEventListener('selectstart', onSelectStart, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [skip])

  return null
}
