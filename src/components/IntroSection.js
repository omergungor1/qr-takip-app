export default function IntroSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
          GezginKitap Projesi Nedir?
        </h2>
        <p className="text-[var(--text-light)] leading-relaxed mb-4">
          Bu proje, Türkiye genelinde dolaşan kitapların yolculuğunu QR kod ile takip etmenizi sağlar.
          Kitaplar şehirler arası yol alır; her durakta QR kodu okutan gezginler mesaj ve fotoğraf bırakır.
        </p>
        <p className="text-[var(--text-light)] leading-relaxed mb-4">
          <strong>Kitaplar nasıl çalışır?</strong> Her kitabın üzerinde bir QR kod bulunur. Kitabı bulduğunuz yerde
          kodu okutup konumunuzu, bir mesajınızı ve isteğe bağlı bir fotoğrafınızı ekleyebilirsiniz.
        </p>
        <p className="text-[var(--text-light)] leading-relaxed">
          <strong>QR kod okutunca ne olur?</strong> Kitabın check-in sayfası açılır; bulduğunuz il/ilçeyi seçip paylaşımınızı
          gönderirsiniz. Böylece kitabın yolculuk hikayesine siz de katkıda bulunursunuz.
        </p>
      </div>
    </section>
  )
}
