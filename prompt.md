Tamam benim için bu qr turizm projesi için türkçe prompt hazırla. Amacımız müşterinin beğeneceği qr projesinin canlı bir demosunu hazırlamak. -> 

- Nextjs ve supabase kullanacağız.
- Tamamen mobil uyumlu olmalıdır
- tailwindcss kullacağız
- Typescrtipt kullanma
- Seo uyumlu bir mimari hazırlayalım
- mapbox kullanacağız
- supabase kullan → auth, storage, psql
- Admin panel ekleyeceğiz
    - Admin panelde haber ve blog ekleme olacak
    - QR ekleme → Otomatik qr oluşturacak
    - Projenin çalıştığı domaini girebileceğim bir alan olmadı → qr oluştururken kullanacaksın
    - qr ekle, sil, aktif-pasif qr, qr koda isim ver vs.
    - Haber ve blog ekleme özelliği olmalıdır
        - Haber ve blogları aktif pasif edebilmelidir
- Ana sayfada tr haritası ve pakenlerin anlık konumları yer alacak.
    - Müşterimin bahsettiği tr haritası ve alt kısımda haber ve bloglar olacak
    - Paketlere tıklanınca modal içinde paket yolculuk geçmişi gösterilmelidir.
    - Ayrıca paket yolculuğu animasyonlu olarak oynatılabilmelidir haritada

supabase için gerekli bağlantıları yap. .evn.local dosyası içine NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY anahtarlarını koydum. 

---
Next.js ve TailwindCSS kullanarak modern ve mobil uyumlu bir web uygulaması tasarlıyoruz. Bu proje QR kod ile takip edilen “gezgin paketler” üzerine kurulu bir turizm projesidir. Amaç, QR kodu okutulan paketlerin şehirler arası yolculuğunu harita üzerinde göstermek ve kullanıcıların bıraktığı mesajları ve görselleri sergilemektir. Ana sayfa başlıkları vs bu turizm projesi için uygun olarak vermelisin. 

Genel Gereksinimler:

* Next.js (App Router) kullan.
* TailwindCSS ile modern, minimal ve turizm temalı bir tasarım dili kullan.
* Tüm sayfalar tamamen mobil uyumlu olmalı (mobile-first).
* Tek sayfalık bir landing yapısı olacak (ana sayfa).
* Kod yapısı temiz, modüler ve genişletilebilir olmalı.

ANA SAYFA (Landing Page)

Ana sayfa tek sayfalık bir yapı olacak ve aşağıdaki bölümlerden oluşacak.

1. Hero + Harita Bölümü

Sayfanın üst kısmında Türkiye haritası olacak. Harita üzerinde paketlerin konumları marker olarak gösterilecek.

Paket marker'ına tıklanınca:

* Paket bilgisi
* Gezdiği şehirler
* Kullanıcı mesajları
* Görseller

gösterilebilir.

Harita için Mapbox harita kütüphanesi kullanılmalıdır!

2. Proje Tanıtım Bölümü

Kısa bir başlık ve açıklama.

Örnek içerik:

* Bu proje nedir
* Paketler nasıl çalışır
* QR kod okutunca ne olur
* Turizm ve keşif hikayesi

3. İstatistikler Bölümü

Sayfanın görsel olarak daha dolu görünmesi için istatistik kartları olacak.

Bu demo için veriler statik olabilir.

Örnek istatistikler:

* Toplam Paket Sayısı
* Ziyaret Edilen Şehir Sayısı
* Toplam Gezilen Kilometre
* Toplam Paylaşım Sayısı

Kart tasarımı modern ve animasyonlu olabilir.

4. Kullanıcı Paylaşımları Galerisi

QR kodu okutan kullanıcıların bıraktığı mesaj ve görsellerin gösterildiği bir galeri olacak.

Tasarım önerisi:

Solda:

* Başlık
* Kullanıcı mesajı
* şehir (city)
* il (province)

Sağda:

* package_scans içindeki görseller

Bu görseller slider / carousel şeklinde yan yana kayabilir.

Alternatif olarak:

* yatay kayan görsel galerisi
* kullanıcı paylaşımları kartlar halinde

Modern ve turizm temalı bir tasarım kullanılmalı.

5. Blog Bölümü

Blog içerikleri kartlar halinde gösterilecek.

Her kartta:

* kapak görseli
* başlık
* kısa açıklama
* devamını oku

6. Haberler Bölümü

Proje ile ilgili haberler.

Örneğin:

* Paket İstanbul'dan Bursa'ya ulaştı
* Paket Kapadokya'da bulundu

Kart yapısında gösterilebilir.

7. Footer

Footer içinde:

* proje hakkında kısa bilgi
* sosyal medya linkleri
* iletişim

olabilir.

---



QR kod okutulduğunda açılacak kullanıcı sayfasını tasarla. Bu sayfa Next.js (App Router) ve TailwindCSS kullanılarak yapılmalı ve tamamen mobil uyumlu olmalıdır.

Route yapısı şu şekilde olabilir:
/p/[slug]

QR kod içindeki URL bu sayfaya yönlendirecek. Slug üzerinden ilgili paket bulunacak.

Sayfa akışı şöyle olmalı:

1. Paket Bilgilendirme Bölümü
   Kullanıcı QR kodu okuttuğunda önce kısa bir bilgilendirme görmeli.

Örnek içerik:

* Bu bir gezgin paket projesidir
* Paketi bulduğunuz şehirde kısa bir mesaj bırakabilirsiniz
* İsterseniz bir fotoğraf da paylaşabilirsiniz

Ayrıca paketin adı veya kodu gösterilebilir.

2. Konum Bilgisi
   Sayfa açıldığında kullanıcıdan konum izni istenebilir veya kullanıcı manuel il-ilçe seçer.
   Konum alınırsa latitude ve longitude form gönderilirken backend’e gönderilir.
   data>turkiye-il-ilce.js>turkiyeIlIlce.provinces ve turkiyeIlIlce.districts tüm Türkiyedeki il ilçe listesine ulaşabilirsin. Eğer kullanıcı konum izni vermezse elle manuel il ilçe seçerse turkiye-il-ilce.js içinde provinces altında lat ve lng alanları var. turkiye-il-ilce listedeki provinces lat lng bilgisini kullanarak package_scans.latitude ve package_scans.longitude alanlarını doldur.

3. Form Alanı

Form aşağıdaki alanlardan oluşabilir:

* Province (il)
* District (ilçe)
* Message (kullanıcı mesajı)
* Image upload (opsiyonel tek görsel)

Form modern ve mobil uyumlu olmalı.

4. Gönder Butonu

Kullanıcı formu gönderdiğinde:

* package_scans tablosuna kayıt yapılır
* görsel varsa storage’a yüklenir

5. Başarı Ekranı

Form başarıyla gönderildikten sonra kullanıcıya bir başarı mesajı gösterilmeli.

Örnek:

“Paylaşımınız başarıyla kaydedildi. Bu paketin yolculuğuna katkıda bulunduğunuz için teşekkür ederiz.”

Altında iki buton olabilir:

* Ana Sayfaya Git
* Haritada Paketi Gör

6. Tasarım

Tasarım:

* modern
* temiz
* mobile-first
* büyük butonlar
* okunabilir form alanları

Ayrıca sayfanın üst kısmında küçük bir paket ikonu veya proje görseli olabilir. Okutulan paketin geçmiş yolculuğu gösterilsin.

Bu sayfa basit, hızlı ve kullanıcı dostu olmalıdır çünkü çoğu kullanıcı QR kodu telefon ile okutacaktır.





---

ADMIN PANEL

Ayrıca bir admin paneli oluşturulacak.

Admin paneli bu QR takip projesinin yönetim alanıdır.

Admin paneli için ayrı bir route kullan:

/admin

Admin panel özellikleri:

1. Paket Yönetimi

Admin şunları yapabilmeli:

* yeni paket ekleme
* QR slug belirleme
* paket başlığı
* açıklama

Ayrıca:

* aktif / pasif yapabilme

Paketler silinmemeli, sadece pasif yapılmalı.

2. Paket Hareketleri

Admin paketlerin scan geçmişini görebilmeli.

Gösterilecek bilgiler:

* tarih
* şehir
* ilçe
* mesaj
* görsel

3. Blog Yönetimi

Admin:

* blog ekleyebilmeli
* blog düzenleyebilmeli
* blog yayınlayabilmeli

Alanlar:

* title
* slug
* content
* cover_image
* published_at

4. Haber Yönetimi

Admin:

* haber ekleyebilmeli
* haber düzenleyebilmeli
* haber yayınlayabilmeli

Alanlar:

* title
* slug
* content
* cover_image
* published_at

5. Görseller

Admin kullanıcıların yüklediği görselleri görebilmeli.

6. Gelecekte Eklenebilecek Ayarlar

Kod mimarisi şu ayarlar için genişletilebilir olmalı:

* site ayarları
* harita ayarları
* paket limitleri
* istatistik ayarları

GENEL TASARIM

* Modern turizm sitesi görünümü
* temiz spacing
* büyük görseller
* yuvarlatılmış kartlar
* soft shadow
* hover animasyonları
* akıcı scroll

Kod yapısı:

* component tabanlı
* reusable UI componentler
* map component
* gallery component
* statistics component
* blog card component

Bu projeyi gelecekte büyütülebilecek şekilde planla.

Şimdilik ana hedef:
Modern, temiz ve etkileyici bir demo MVP oluşturmak.



---




Storage Path Önerisi:
uploads/
scan-images/{scan_id}.jpg
news/{news_id}.jpg
blogs/{blog_id}.jpg





turizm amaçlı bir paketin tr ve dünyayı dolaşması
Dünya paketenti ile ilgili başvurulacak



ilk etapta 300 paket olacak
Ağırlıklı 6-7 büyük şehirde ulaşım noktalarına dağılmış olacak.
ikonumuz var onu yollayacağım. -> paketleri burda göreceğiz , bu paketin hareketini çizgi şeklinde göreceğiz
Trabzondan - ist hareketini göreceğiz

ilk aşamada şöyle yapmak istiyoruz -> tıklayarak değil de yolculuğu insanlar görsün istiyoruz. 


Gezgin paylaşımları isimlendir (Kullanıcı paylaşımları)

Blog deyince -> Gezgin blogları olabilir.
Kullanıcılar kendileri blog yazabilir

Şunu da belirteyim -> kolayca anlaşılabilmek
bu proje sayesinde yol arkadaşlarıma yeni bir mecra ve gelir kaynağı sağlamak

Ayda bir, 15 günde bir toplantı, kalan vaktimde gezi yazısı vs.

istediğim şey şu:
tr haritası vs güzel

qr okutma ekranı hak:
ilçe olarak görmemiz gerekiyor -> 


Otomatik olarak kayan bir slider koyalım -> paket ist, paket şurada vs...

3 tane kendi gazetemiz var -> backlink vericez
timb bursa yalova bölge başk.
meslektaşlarım haber desteği verecek
ads, 

2 kod yeterli
