'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function PackageModal({ package: pkg, onClose, baseUrl }) {
  const [playing, setPlaying] = useState(false)
  const scans = (pkg?.package_scans || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )

  if (!pkg) return null

  const togglePlay = () => setPlaying((p) => !p)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{pkg.title || pkg.code}</h2>
            <p className="text-slate-600 text-sm mt-1">{pkg.description || 'Gezgin paket yolculuk geçmişi'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Gezilen şehirler:</span>
            <span className="text-sm text-slate-600">
              {[...new Set(scans.map((s) => s.province).filter(Boolean))].join(', ') || 'Henüz yok'}
            </span>
          </div>

          {playing && (
            <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-2">
              Yolculuk animasyonu haritada oynatılıyor (isteğe bağlı geliştirilebilir).
            </p>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">Yolculuk geçmişi</h3>
            {scans.length === 0 ? (
              <p className="text-slate-500 text-sm">Henüz tarama kaydı yok.</p>
            ) : (
              <ul className="space-y-3">
                {scans.map((scan, idx) => (
                  <li key={scan.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800">
                        {scan.province || '—'}
                        {scan.district ? ` / ${scan.district}` : ''}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(scan.created_at).toLocaleDateString('tr-TR', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                      {scan.message && (
                        <p className="text-sm text-slate-600 mt-1">{scan.message}</p>
                      )}
                      {scan.image_path && (
                        <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden bg-slate-200">
                          <Image
                            src={scan.image_path}
                            alt="Paylaşım"
                            fill
                            className="object-cover"
                            sizes="(max-width: 400px) 100vw, 400px"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={togglePlay}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white font-medium text-sm"
            >
              {playing ? 'Durdur' : 'Yolculuğu haritada oynat'}
            </button>
            {baseUrl && (
              <a
                href={`${baseUrl}/p/${pkg.qr_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl border border-amber-500 text-amber-600 font-medium text-sm text-center"
              >
                QR sayfası
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
