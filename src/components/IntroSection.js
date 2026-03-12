export default function IntroSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
          Gezgin Paket Projesi Nedir?
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Bu proje, Türkiye genelinde dolaşan özel paketlerin yolculuğunu QR kod ile takip etmenizi sağlar.
          Paketler şehirler arası yol alır; her durakta QR kodu okutan gezginler mesaj ve fotoğraf bırakır.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          <strong>Paketler nasıl çalışır?</strong> Her paketin üzerinde bir QR kod bulunur. Paketi bulduğunuz yerde
          kodu okutup konumunuzu, bir mesajınızı ve isteğe bağlı bir fotoğrafınızı ekleyebilirsiniz.
        </p>
        <p className="text-slate-600 leading-relaxed">
          <strong>QR kod okutunca ne olur?</strong> Paketin sayfası açılır; bulduğunuz il/ilçeyi seçip paylaşımınızı
          gönderirsiniz. Böylece paketin yolculuk hikayesine siz de katkıda bulunursunuz.
        </p>
      </div>
    </section>
  )
}
