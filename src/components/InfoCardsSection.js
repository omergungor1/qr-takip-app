'use client'

import { useState } from 'react'

const INFO_ITEMS = [
  {
    id: 'nedir',
    title: 'Gezgin kitap nedir?',
    icon: '📖',
    content: `Gezgin Kitap, okuma kültürünü dijital dünyanın imkanlarıyla birleştiren, kitapların raflarda hapsolmak yerine elden ele, şehirden şehre gezmesini sağlayan interaktif bir kültür hareketidir. 
    
    Bu proje, her kitabın bir ruhu ve anlatacak bir hikayesi olduğuna inanır. Gezgin Kitap ile bir eser sadece okunmakla kalmaz; üzerine notlar düşülür, anılar eklenir ve yeni bir okura ulaşmak üzere bir yolculuğa uğurlanır.`,
  },
  {
    id: 'nasil-calisir',
    title: 'Gezgin kitap nasıl çalışır?',
    icon: '🔄',
    content: `Gezgin Kitap’ın işleyişi oldukça basit ve teknoloji odaklıdır:

Kayıt ve Takip: Her Gezgin Kitap, kendisine özel bir QR kod ve takip numarasına sahiptir.

Okuma ve Not Bırakma: Kitabı bulan okur, QR kodu taratarak kitabın o ana kadar hangi şehirleri gezdiğini görebilir. Kitabın içine kendi duygu ve düşüncelerini içeren kısa bir not veya tarih bırakabilir.

Yolculuğa Devam: Okuma süreci bittikten sonra, kitap bir banka, kafe masasına veya belirlenen bir "durak noktasına" bırakılarak yeni yolcusunu beklemeye başlar.

Dijital İz: Kitabı her bulan kişi sistemi güncellediğinde, kitabın rotası harita üzerinden anlık olarak izlenebilir.`,
  },
  {
    id: 'kurallar',
    title: 'Gezgin kitabın kuralları',
    icon: '✅',
    content: `Kitabın yolculuğunun aksamaması ve topluluk ruhunun korunması için temel kurallarımız şunlardır:

Sahiplenme, Paylaş: Kitap size ait değildir; o bir gezgindir. Okumanız bittiğinde onu mutlaka başka birinin bulabileceği güvenli bir yere bırakın.

Sistemi Güncelle: Kitabı bulduğunuzda ve yeni bir yere bıraktığınızda mutlaka üzerindeki QR kodu okutarak sisteme bilgi girişi yapın.

İz Bırak: Kitabın içine nezaket kuralları çerçevesinde küçük bir not veya bir ayraç bırakarak sonraki okura selam gönderin.

Özen Göster: Kitabın sayfalarına zarar vermemeye ve onu hava şartlarından koruyacak şekilde bırakmaya dikkat edin.`,
  },
  {
    id: 'oduller',
    title: 'Gezgin kitap ödülleri',
    icon: '🏆',
    content: `Gezgin Kitap topluluğunun bir parçası olmak sadece manevi bir haz değil, aynı zamanda sürpriz fırsatlar da sunuyor! En çok kitap paylaşan, en uzak rotaya ulaşan veya sistemimizi aktif kullanan okurlarımızı gelecekte muhteşem ödüller bekliyor.

Sizleri Bekleyen Olası Ödüller:

Yurt içi ve yurt dışı tatil paketleri,

Seçkin restoranlarda akşam yemekleri ve ziyafetler,

En sevilen sanatçıların konser biletleri,

Sezonun en iyi oyunları için tiyatro biletleri ve çok daha fazlası.

Önemli Not: Ödül kategorileri ve kazananlar belirlendikten sonra güncel duyurularımız www.gezginkitap.com web sitemizden ve resmi sosyal medya hesaplarımızdan ilan edilecektir. Takipte kalın, kitabınız gezdikçe siz kazanın!`,
  },
]

function InfoModal({ item, onClose }) {
  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-start gap-3">
          <span className="text-3xl shrink-0" aria-hidden="true">{item.icon}</span>
          <div className="min-w-0 flex-1">
            <h2 id="info-modal-title" className="text-xl font-bold text-[var(--foreground)]">
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 shrink-0"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="info-modal-content text-[var(--foreground)] text-[15px] leading-relaxed space-y-4">
            {item.content.split('\n\n').map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                  part.startsWith('**') && part.endsWith('**')
                    ? <strong key={j} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>
                    : part
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InfoCardsSection() {
  const [openItem, setOpenItem] = useState(null)

  return (
    <section className="py-2 sm:py-6 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center mb-8">
          <aside className="order-2 lg:order-1 w-full max-w-xl mx-auto lg:max-w-none rounded-xl border-2 border-dashed border-[var(--foreground)]/15 bg-[var(--background)]/70 px-4 py-3 text-center">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-light)]/80">Reklam alanı</span>
            <span className="block text-xs sm:text-sm text-[var(--text-light)] mt-1">Sol banner (728x90 / 320x100)</span>
          </aside>

          <div className="order-1 lg:order-2 text-center px-1 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
              Gezgin Kitap Rehberi
            </h2>
            <p className="text-[var(--text-light)] max-w-xl mx-auto text-sm sm:text-base">
              Merak edilen gezgin kitap rehber yazıları aşağıda...
            </p>
          </div>

          <aside className="order-3 w-full max-w-xl mx-auto lg:max-w-none rounded-xl border-2 border-dashed border-[var(--foreground)]/15 bg-[var(--background)]/70 px-4 py-3 text-center">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-light)]/80">Reklam alanı</span>
            <span className="block text-xs sm:text-sm text-[var(--text-light)] mt-1">Sağ banner (728x90 / 320x100)</span>
          </aside>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {INFO_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenItem(item)}
              className="group text-left bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:ring-offset-2"
            >
              <span className="text-2xl sm:text-3xl block mb-3" aria-hidden="true">{item.icon}</span>
              <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--text-light)] mt-1">
                Detay için tıklayın
              </p>
            </button>
          ))}
        </div>
      </div>
      {openItem && (
        <InfoModal item={openItem} onClose={() => setOpenItem(null)} />
      )}
    </section>
  )
}
