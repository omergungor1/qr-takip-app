PROJE ADI: GezginKitap

Amaç: QR kodlu gezgin kitapların Türkiye içinde dolaşmasını ve bu yolculuğun web sitesinde harita, fotoğraf ve kullanıcı notları ile gösterilmesini sağlayan bir platform.

Mevcut stack:

* Supabase
* PostgreSQL
* Supabase Storage
* Supabase Auth (sadece admin panel için)
* Frontend: mevcut proje korunacak fakat UI/UX geliştirilecek

---

GENEL TASARIM DİLİ

Proje eğlenceli, keşif temalı ve sıcak bir tasarıma sahip olmalı.

Maskot: Gezgin kitap karakteri (sırt çantalı, kameralı kitap)

Renk paleti:

Primary: #FF6B3D  (kitap kırmızısı)
Secondary: #FFB347 (turuncu)
Accent: #2F855A (doğa yeşili)
Background: #FFF8F2
Dark text: #2D3748
Light text: #718096

UI hissi:

* eğlenceli
* keşif
* seyahat
* topluluk

Font önerisi:
Başlıklar: Poppins
Metin: Inter

Buton stili:
rounded-xl
shadow-sm
hover animasyon

---

GLOBAL COMPONENTLER

Header

Logo
Menü:

Ana Sayfa
Harita
Blog
Haberler
Proje Hakkında

Sağ tarafta:

"Kitap Bul" butonu

---

GLOBAL EMAIL ABONELİK COMPONENT

Her sayfanın altında bulunacak.

Başlık:

"GezginKitap yolculuğunu kaçırmayın"

Metin:

"GezginKitap projesinin en güncel hareketlerini, yeni kitap yolculuklarını ve sürpriz etkinlikleri öğrenmek için mail listemize katılın."

Input:
Email

Buton:
Abone Ol

Veri:
Supabase settings tablosuna değil
yeni bir table:

subscribers

id
email
created_at

Check-in sayfasında bu component olmayacak.

Teşekkür sayfasında olacak.

---

ANA SAYFA

Hero alanı:

Başlık:

"Kitaplar Türkiye’yi Geziyor"

Alt metin:

"Bir kitabı bul, check-in yap ve başka bir şehre bırak. Türkiye’nin en ilginç kitap yolculuğunu birlikte yazıyoruz."

[Harita] -> Kitapl için oynat özelliği eklemiştik. Buna gerek kalmadı. Yapmamız gereken her kitabın yaptığı yolculuğu arkasında bir iz şeklinde göstermek. Oynatılabilir bir özelliğe gerek yok. Kitaplar yine son konumunda gösterilecek. Arkasında bir iz ile gezdiği rota gösterilecek. Kitap üzerine tıklayınca açılan popup ile Kitap pasaportu sayfa (kitabın detay sayfası) açılmalıdır. Şuanki versiyonda modal açılıyor orda listeleniyor ancak böyle olmamalı. Yeni versiyonda tüm kitapların detay sayfası olacak. Bu sayfa açılmalıdır. Kitabın üzerine tıklayınca açılan popup içinde Detay sayfa linki dışında kitap hakkında kısa bilgiler de yazsın. Örn: toplam check-in sayısı, toplam yapılan km, ziyaret edilen şehir sayısı gibi...

CTA:

Haritayı Keşfet -> Detaylı harita sayfası

---

PROJE İSTATİSTİKLERİ

Supabase query ile hesaplanacak:

Toplam Kitap
Toplam Check-in
Gezilen Şehir Sayısı
Toplam KM

KM hesaplama:

Check-in koordinatları arası mesafe hesaplanacak.

---

CANLI HAREKETLER

Slider şeklinde:

Örnek içerikler:

"015 nolu kitap Tokat’a ulaştı"
"024 nolu kitap üçüncü kez bulundu"
"055 nolu kitap Antalya’da check-in aldı"

Veri:
package_scans tablosundan.

---

HARİTA BÖLÜMÜ

Türkiye haritası.

Her kitap için marker.

Marker tıklanınca:

Kitap kodu
Son bulunduğu şehir
Kitap detayına git

---

SON FOTOĞRAFLAR

Grid:

Son check-in fotoğrafları.

Supabase storage üzerinden.

---

WANTED KİTAPLAR

14 gün check-in almayan kitaplar.

Metin:

"Bu kitaptan uzun süredir haber alınamıyor. Bulan ilk kişi sürpriz ödül kazanabilir."

---

BLOG

blogs tablosu kullanılacak.

Liste sayfası
detay sayfası.

---

HABERLER

news tablosu kullanılacak.

---

KİTAP PASAPORT SAYFASI

URL:

/book/{code}

İçerik:

Başlık:

"055 Nolu Gezgin Kitap"

Bilgiler:

İlk check-in tarihi
Toplam check-in
Gezilen şehir sayısı
Toplam km

---

ROTA HARİTASI

Leaflet veya Mapbox kullanılabilir.

Check-in noktaları çizgi ile bağlanacak.

---

FOTOĞRAF GALERİ

Check-in fotoğrafları

---

CHECK-IN LİSTESİ

Her kayıt:

şehir
mesaj
tarih

---

SPONSOR BİLGİSİ

packages tablosuna ek alan:

sponsor_name
sponsor_logo
sponsor_url

Varsa gösterilecek.

---

QR CHECK-IN SAYFASI

URL:

/qr/{slug}

Bu sayfa kitap QR kodundan açılır.

Form:

Konum (gps)
İsim (opsiyonel)
Mesaj
Fotoğraf

Ayrıca manuel konum seçme opsiyonu.

---

FOTOĞRAF YÜKLEME

Supabase Storage.

---

KVKK UYARISI

Form altında:

"Yüklediğiniz fotoğraf ve notlar kitabın dijital yolculuğu içerisinde herkese açık olarak yayınlanabilir."

---

SUBMIT SONRASI

Teşekkür sayfası.

Başlık:

"Teşekkürler!"

Metin:

"Bu kitabın yolculuğuna katkıda bulunduğunuz için teşekkür ederiz. Lütfen kitabı farklı bir noktaya bırakarak yolculuğuna devam etmesini sağlayın."

Butonlar:

Kitabın Yolculuğunu Gör
Ana Sayfaya Dön

Altında email abonelik componenti.

---

ADMIN PANEL

Supabase auth ile login.

Admin işlemleri:

Kitap ekleme
QR slug oluşturma
Blog ekleme
Haber ekleme
Sponsor bilgisi ekleme

---

PERFORMANS

Harita marker clustering kullanılmalı.

---

SEO

Her kitap sayfası indexlenebilir olmalı.

Meta title:

"055 Nolu Gezgin Kitap Yolculuğu"

---

EKSTRA ÖZELLİK

Kitap pasaportu tasarımı.

Her şehir bir damga gibi gösterilecek.

---

SON HEDEF

Bu platform kullanıcıların check-in yaparak içerik ürettiği,
kitapların Türkiye içindeki yolculuğunu harita üzerinde gösteren
viral bir hikaye platformu olacak.



Bu bir mvp sürüm. Bu nedenle bazı özellikler statik olabilir. Her şeyi dinamik yapmak zorunda değilsin. Amacımız Siteyi ve özellikleri belirlemek. Daha sonra tüm özellikleri aktif hale getiririz. Bazı şeyler sabit olabilir. 

public>sponsors altına örnek 3 logo ekledim. Özdilek, opet ve decathlon. Bunları da örnek kitap sayfaları için kullanabilirsin. 

Not: Eğer supabase tablolarda bir güncelleme yapılması gerekiyorsa gerekli alter ve sql komutlarını ver. Örnek kayıt eklemek istiyorsan da gerekli sql leri vermelisin.