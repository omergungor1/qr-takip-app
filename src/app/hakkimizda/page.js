export const metadata = {
  title: 'Proje Hakkında | GezginKitap',
  description: 'GezginKitap projesi: Kitaplar Türkiye\'yi geziyor. Bir kitabı bul, kayıt yap ve başka bir şehre bırak.',
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
            <strong>GezginKitap</strong>, okuma kültürünü dijital dünyanın imkânlarıyla birleştiren, kitapların raflarda
            hapsolmak yerine elden ele, şehirden şehre gezmesini sağlayan interaktif bir kültür hareketidir.
          </p>
          <p className="leading-relaxed">
            Bu proje, her kitabın bir ruhu ve anlatacak bir hikâyesi olduğuna inanır. GezginKitap ile bir eser yalnızca
            okunmakla kalmaz; üzerine notlar düşülür, anılar eklenir ve yeni bir okura ulaşmak üzere yolculuğa uğurlanır.
          </p>
          <p className="leading-relaxed">
            <strong>Kitaplar nasıl çalışır?</strong> Her kitabın üzerinde bir QR kod bulunur. Kitabı bulduğunuz yerde
            kodu okutup konumunuzu, bir mesajınızı ve isteğe bağlı bir fotoğrafınızı ekleyebilirsiniz.
          </p>
          <p className="leading-relaxed">
            <strong>QR kod okutunca ne olur?</strong> Kitabın kayıt sayfası açılır; bulduğunuz il/ilçeyi seçip paylaşımınızı
            gönderirsiniz. Böylece kitabın yolculuk hikayesine siz de katkıda bulunursunuz.
          </p>
          <p className="leading-relaxed">
            Bu platform, kullanıcıların kayıt yaparak içerik ürettiği, kitapların Türkiye içindeki yolculuğunu
            harita üzerinde gösteren bir hikaye platformudur.
          </p>
        </div>
      </div>
    </div>
  )
}
