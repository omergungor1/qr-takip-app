export const metadata = {
  title: 'Gizlilik Sözleşmesi | GezginKitap',
  description: 'GezginKitap projesi gizlilik sözleşmesi ve kişisel veri işleme koşulları.',
}

export default function GizlilikPage() {
  return (
    <div className="py-12 sm:py-16 bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Gizlilik Sözleşmesi
        </h1>
        <p className="text-sm text-[var(--text-light)] text-center mb-8">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
        <div className="prose prose-slate max-w-none space-y-6 text-[var(--foreground)] text-[15px] leading-relaxed">
          <p>
            Bu gizlilik sözleşmesi, <strong>GezginKitap</strong> web sitesi ve ilgili hizmetler kapsamında
            kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
            6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuata uygun hareket edilmektedir.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">1. Toplanan Veriler</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Kayıt verileri:</strong> Seçtiğiniz il, ilçe (konum), mesaj metni, yüklediğiniz fotoğraflar.</li>
            <li><strong>Teknik veriler:</strong> Gönderim tarihi, cihaz ve tarayıcı bilgileri, gerekirse IP adresi (güvenlik / log amaçlı).</li>
            <li><strong>İletişim verileri:</strong> E-posta bülteni aboneliği gibi durumlarda e-posta adresi.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">2. Verilerin Kullanım Amaçları</h2>
          <p>
            Toplanan veriler; gezgin kitapların yolculuğunu haritada ve kitap pasaportu sayfalarında göstermek,
            kullanıcı paylaşımlarını (mesaj ve fotoğraflar) web sitemizde ve gezgin kitapla ilgili tüm mecralarda
            (sosyal medya, tanıtım, haberler vb.) yayınlamak amacıyla kullanılır.
          </p>
          <p>
            <strong>Paylaştığınız fotoğraf, isim ve mesajlar KVKK yönetmeliği çerçevesinde web sitemizde ve
              gezgin kitapla ilgili tüm mecralarda yayınlanabilir.</strong> Formu göndererek bu kullanımı onaylamış kabul edilirsiniz.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">3. Verilerin Paylaşımı</h2>
          <p>
            Paylaşımlarınız (mesaj, fotoğraf, konum) herkese açık içerik olarak sitede ve projeyle ilişkili
            kanallarda gösterilir. Verileriniz üçüncü taraflara satılmaz; yalnızca hizmet sağlayıcılar
            (hosting, veritabanı vb.) ile gerekli hallerde paylaşılabilir ve sözleşmelerle güvence altına alınır.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">4. Çerezler ve Teknolojiler</h2>
          <p>
            Site deneyimini iyileştirmek için çerezler kullanılabilir. Zorunlu çerezler olmadan site
            işlevselliği kısıtlanabilir; analitik çerezler ise tercihe bağlıdır.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">5. Veri Güvenliği</h2>
          <p>
            Verileriniz teknik ve idari tedbirlerle korunur; yetkisiz erişim, kayıp veya değişikliğe
            karşı önlemler alınmaktadır.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">6. Saklama Süresi</h2>
          <p>
            Verileriniz, proje faaliyeti ve yasal saklama süreleri boyunca muhafaza edilir. Proje
            sona erdiğinde veya talep etmeniz halinde silinebilir veya anonim hale getirilebilir.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">7. Haklarınız</h2>
          <p>
            KVKK’ya göre kişisel verilerinize erişim, düzeltme, silme ve işlemenin kısıtlanması gibi
            taleplerde bulunabilirsiniz. Talepleriniz için: <a href="mailto:gezginkitaptv@gmail.com" className="text-[var(--primary)] underline">gezginkitaptv@gmail.com</a>.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">8. Değişiklikler</h2>
          <p>
            Bu metin güncellendiğinde sayfa üzerinde son güncelleme tarihi yansıtılacaktır. Önemli
            değişikliklerde mümkün olduğunca site veya e-posta ile bilgilendirme yapılacaktır.
          </p>

          <p className="mt-8 text-sm text-[var(--text-light)]">
            KVKK kapsamındaki aydınlatma metni için <a href="/kvkk" className="text-[var(--primary)] underline">KVKK Aydınlatma Metni</a> sayfamıza bakabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
