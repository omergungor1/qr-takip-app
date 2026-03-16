export const metadata = {
  title: 'Proje Hakkında | GezginKitap',
  description: 'GezginKitap projesi: Kitaplar Türkiye\'yi geziyor. Bir kitabı bul, check-in yap ve başka bir şehre bırak.',
}

export default function HakkimizdaPage() {
  return (
    <div className="py-12 sm:py-16 bg-[var(--background)]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Proje Hakkında
        </h1>
        <div className="prose prose-slate max-w-none space-y-4 text-[var(--foreground)]">
          <p className="leading-relaxed">
            <strong>GezginKitap</strong>, Türkiye genelinde dolaşan kitapların yolculuğunu QR kod ile takip etmenizi sağlayan bir projedir.
            Kitaplar şehirler arası yol alır; her durakta QR kodu okutan gezginler mesaj ve fotoğraf bırakır.
          </p>
          <p className="leading-relaxed">
            <strong>Kitaplar nasıl çalışır?</strong> Her kitabın üzerinde bir QR kod bulunur. Kitabı bulduğunuz yerde
            kodu okutup konumunuzu, bir mesajınızı ve isteğe bağlı bir fotoğrafınızı ekleyebilirsiniz.
          </p>
          <p className="leading-relaxed">
            <strong>QR kod okutunca ne olur?</strong> Kitabın check-in sayfası açılır; bulduğunuz il/ilçeyi seçip paylaşımınızı
            gönderirsiniz. Böylece kitabın yolculuk hikayesine siz de katkıda bulunursunuz.
          </p>
          <p className="leading-relaxed">
            Bu platform, kullanıcıların check-in yaparak içerik ürettiği, kitapların Türkiye içindeki yolculuğunu
            harita üzerinde gösteren bir hikaye platformudur.
          </p>
        </div>
      </div>
    </div>
  )
}
