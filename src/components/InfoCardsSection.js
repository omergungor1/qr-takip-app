'use client'

import { useState } from 'react'

const INFO_ITEMS = [
  {
    id: 'nedir',
    title: 'Gezgin kitap nedir?',
    icon: '📖',
    content: `Gezgin kitap, bir okurdan diğerine yolculuk eden fiziksel bir kitaptır. Kitabın kapağında veya içinde yer alan QR kodu okutarak check-in yaparsınız; kitabı okuduktan sonra başka bir yere (kafe, bank, kütüphane, otobüs durağı vb.) bırakırsınız. Bir sonraki bulan kişi aynı kitabı alır, check-in yapar ve yolculuk böyle devam eder.

Bu proje sayesinde kitaplar şehir şehir, el ele dolaşır. Haritada her kitabın izlediği rota ve son konumu görülebilir. Hem okuma alışkanlığını yaygınlaştırmak hem de insanları kitaplar etrafında bir araya getirmek hedeflenir.`,
  },
  {
    id: 'nasil-calisir',
    title: 'Gezgin kitap nasıl çalışır?',
    icon: '🔄',
    content: `1. **Bir gezgin kitap bulun** – Kütüphane, kafe, park veya başka bir kamusal alanda QR kodlu bir kitap görürseniz alabilirsiniz.

2. **QR kodu okutun** – Telefonunuzla kitaptaki QR kodu tarayın. Otomatik olarak check-in sayfasına yönlendirilirsiniz.

3. **Check-in yapın** – Bulunduğunuz şehir/ilçe bilgisini girin, isterseniz kısa bir mesaj veya fotoğraf ekleyin. Bu sayede kitabın yolculuğu haritada güncellenir.

4. **Kitabı okuyun** – Keyfini çıkarın, isterseniz not alın.

5. **Bırakın** – Kitabı başka bir yere (bank, kafe, otobüs, tren vb.) bırakın. Bir sonraki okur bulsun diye görünür bir yere koyun.`,
  },
  {
    id: 'kurallar',
    title: 'Gezgin kitabın kuralları',
    icon: '✅',
    content: `• **Kitaba zarar vermeyin** – Okuyun, paylaşın; yırtmayın, karalamayın.

• **Check-in yapın** – Kitabı bulduğunuzda mutlaka QR ile check-in alın. Böylece harita güncel kalır ve kitap “kayıp” sayılmaz.

• **Uygun yere bırakın** – Kitabı yağmur almayacak, başkalarının bulabileceği bir yere bırakın (masa, raf, bank).

• **Sahiplenmeyin** – Gezgin kitap herkese aittir. Evinize götürüp saklamayın; okuduktan sonra bırakın.

• **Saygılı olun** – Mesaj ve fotoğraflarınızda herkese saygılı olun.`,
  },
  {
    id: 'oduller',
    title: 'Gezgin kitap ödülleri',
    icon: '🏆',
    content: `Projemizde düzenli aralıklarla ödüllü etkinlikler düzenlenebilir:

• **En çok check-in** – Belirli bir dönemde en çok check-in alan kitapların okurları veya kitaplar ödüllendirilebilir.

• **En uzun rota** – En fazla şehir gezen veya en çok km yapan kitaplar öne çıkarılabilir.

• **Sürpriz ödüller** – “Wanted” (uzun süredir check-in almayan) kitapları bulan ilk kişiye sürpriz ödül verilebilir.

Ödül duyuruları web sitemiz ve sosyal medya hesaplarımızdan paylaşılır. Katılım koşulları her etkinlikte ayrıca belirtilir.`,
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
    <section className="py-12 sm:py-16 bg-[var(--background)]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)] mb-2">
          Gezgin Kitap Rehberi
        </h2>
        <p className="text-[var(--text-light)] text-center mb-8 max-w-xl mx-auto text-sm sm:text-base">
          Merak ettikleriniz için aşağıdaki kutulara tıklayın.
        </p>
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
