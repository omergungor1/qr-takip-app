export const metadata = {
  title: 'KVKK Aydınlatma Metni | GezginKitap',
  description: 'GezginKitap projesi Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni.',
}

export default function KvkkPage() {
  return (
    <div className="py-12 sm:py-16 bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          KVKK Aydınlatma Metni
        </h1>
        <p className="text-sm text-[var(--text-light)] text-center mb-8">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
        <div className="prose prose-slate max-w-none space-y-6 text-[var(--foreground)] text-[15px] leading-relaxed">
          <p>
            <strong>GezginKitap</strong> olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında,
            check-in ve paylaşım sırasında toplanan kişisel verilerinize ilişkin aydınlatma yükümlülüğümüzü aşağıda yerine getirmekteyiz.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">1. Veri Sorumlusu</h2>
          <p>
            Kişisel verileriniz, veri sorumlusu sıfatıyla GezginKitap projesi tarafından işlenmektedir.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">2. İşlenen Kişisel Veriler</h2>
          <p>
            Check-in formu aracılığıyla paylaştığınız <strong>il / ilçe (konum bilgisi)</strong>, <strong>mesaj metni</strong>,
            <strong> yüklediğiniz fotoğraflar</strong> ve form gönderimine ilişkin teknik veriler (tarih, IP vb.) işlenmektedir.
            İsim veya rumuz paylaşıyorsanız bu bilgiler de kişisel veri kapsamındadır.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">3. İşleme Amaçları</h2>
          <p>
            Toplanan veriler; gezgin kitapların yolculuğunu harita ve kitap pasaportu sayfalarında göstermek,
            kullanıcı paylaşımlarını (mesaj ve fotoğraflar) web sitemizde ve gezgin kitapla ilgili tüm mecralarda
            (sosyal medya, tanıtım materyalleri vb.) yayınlamak amacıyla kullanılmaktadır.
          </p>
          <p>
            <strong>Paylaştığınız fotoğraf, isim ve mesajlar KVKK yönetmeliği çerçevesinde web sitemizde ve
              gezgin kitapla ilgili tüm mecralarda yayınlanabilir.</strong> Check-in göndererek bu kullanımı kabul etmiş sayılırsınız.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">4. Hukuki Sebep</h2>
          <p>
            Verileriniz, açık rızanız (check-in formundaki onay kutuları) ve KVKK’nın 5. maddesinde sayılan
            meşru menfaat (proje tanıtımı, kitap yolculuğu hikayesi) kapsamında işlenmektedir.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">5. Aktarım</h2>
          <p>
            Paylaşımlarınız yalnızca web sitesi ve projeyle ilişkili kanallarda herkese açık şekilde
            gösterilebilir; ticari veri satışı yapılmamaktadır.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">6. Saklama Süresi</h2>
          <p>
            Verileriniz, proje süresi boyunca ve yasal saklama yükümlülükleri çerçevesinde muhafaza edilir.
            Proje sona ererse veya talep ederseniz silinme / anonimleştirme işlemleri yapılabilir.
          </p>

          <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-2">7. Haklarınız</h2>
          <p>
            KVKK’nın 11. maddesi uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse
            buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını
            öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış
            işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme haklarına sahipsiniz.
            İlgili talepleriniz için: <a href="mailto:gezginkitaptv@gmail.com" className="text-[var(--primary)] underline">gezginkitaptv@gmail.com</a>.
          </p>

          <p className="mt-8 text-sm text-[var(--text-light)]">
            Detaylı işleme koşulları için <a href="/gizlilik" className="text-[var(--primary)] underline">Gizlilik Sözleşmesi</a> sayfamızı inceleyebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
