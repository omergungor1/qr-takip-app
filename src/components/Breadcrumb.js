import Link from 'next/link'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6 flex-wrap" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-400">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-amber-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
