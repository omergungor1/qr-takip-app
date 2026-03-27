'use client'

import { useState } from 'react'
import Image from 'next/image'

function Chevron({ open }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function HakkimizdaAccordion() {
  const [bizOpen, setBizOpen] = useState(true)
  const [erkanOpen, setErkanOpen] = useState(false)

  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-semibold uppercase tracking-wide text-[var(--text-light)] mb-1">
        Hakkında
      </p>

      <div className="rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setBizOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold text-[var(--foreground)] hover:bg-slate-50/90 transition-colors"
          aria-expanded={bizOpen}
          id="hakkimizda-biz-trigger"
          aria-controls="hakkimizda-biz-panel"
        >
          <span>Biz</span>
          <Chevron open={bizOpen} />
        </button>
        {bizOpen && (
          <div
            id="hakkimizda-biz-panel"
            role="region"
            aria-labelledby="hakkimizda-biz-trigger"
            className="px-5 pb-5 pt-0 border-t border-slate-100"
          >
            <div className="prose prose-slate max-w-none space-y-4 text-[var(--foreground)] pt-4 text-[15px] leading-relaxed">
              <p>
                <strong>GezginKitap</strong>, okuma kültürünü dijital dünyanın imkânlarıyla birleştiren, kitapların
                raflarda hapsolmak yerine elden ele, şehirden şehre gezmesini sağlayan interaktif bir kültür
                hareketidir.
              </p>
              <p>
                Bu proje, her kitabın bir ruhu ve anlatacak bir hikâyesi olduğuna inanır. GezginKitap ile bir eser
                yalnızca okunmakla kalmaz; üzerine notlar düşülür, anılar eklenir ve yeni bir okura ulaşmak üzere
                yolculuğa uğurlanır.
              </p>
              <p>
                <strong>Kitaplar nasıl çalışır?</strong> Her kitabın üzerinde bir QR kod bulunur. Kitabı bulduğunuz
                yerde kodu okutup konumunuzu, bir mesajınızı ve isteğe bağlı bir fotoğrafınızı ekleyebilirsiniz.
              </p>
              <p>
                <strong>QR kod okutunca ne olur?</strong> Kitabın kayıt sayfası açılır; bulduğunuz il/ilçeyi seçip
                paylaşımınızı gönderirsiniz. Böylece kitabın yolculuk hikayesine siz de katkıda bulunursunuz.
              </p>
              <p>
                Bu platform, kullanıcıların kayıt yaparak içerik ürettiği, kitapların Türkiye içindeki yolculuğunu
                harita üzerinde gösteren bir hikaye platformudur.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setErkanOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-semibold text-[var(--foreground)] hover:bg-slate-50/90 transition-colors"
          aria-expanded={erkanOpen}
          id="hakkimizda-erkan-trigger"
          aria-controls="hakkimizda-erkan-panel"
        >
          <span>Erkan Ayçam kimdir</span>
          <Chevron open={erkanOpen} />
        </button>
        {erkanOpen && (
          <div
            id="hakkimizda-erkan-panel"
            role="region"
            aria-labelledby="hakkimizda-erkan-trigger"
            className="px-5 pb-5 pt-0 border-t border-slate-100"
          >
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pt-5 items-stretch">
              <div className="relative mx-auto sm:mx-0 w-44 h-44 sm:w-48 sm:h-48 shrink-0 rounded-2xl overflow-hidden ring-2 ring-[var(--primary)]/20 shadow-md bg-slate-100">
                <Image
                  src="/about/erkan-aycam.jpg"
                  alt="Erkan Ayçam"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 176px, 192px"
                  priority
                />
              </div>
              <blockquote className="flex-1 text-[var(--foreground)] text-[15px] sm:text-base leading-relaxed border-l-4 border-[var(--primary)]/50 pl-4 sm:pl-5 py-1 italic text-slate-700">
                Bir de baktım ki elimde kalem, fotoğraf makinesi, kamera, kitaplar ve daha da uzaklara bakınca güzel
                ülkemin doyulmaz nicelikleri… Olmaz dedim! Sorumlusun! Git! Yaz! Çek! Anlat. Anlat ki gelecek kuşaklara
                aktarılsın tüm bu güzellikler.
              </blockquote>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
