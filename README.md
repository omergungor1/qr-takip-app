# Gezgin Paket – QR Turizm Takip

Next.js ve Supabase ile QR kod takipli gezgin paket projesi. Harita üzerinde paket konumları, kullanıcı paylaşımları, blog ve haberler.

## Kurulum

1. Bağımlılıklar: `npm install`
2. `.env.local` içinde:
   - `NEXT_PUBLIC_SUPABASE_URL` – Supabase proje URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` veya `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` – Supabase anon key
   - `NEXT_PUBLIC_MAPBOX_TOKEN` – [Mapbox](https://www.mapbox.com/) access token (harita için)
3. Supabase’te `db.sql` dosyasını çalıştırın (tablolar, RLS, storage bucket).
4. Geliştirme: `npm run dev`

## Özellikler

- **Ana sayfa:** Türkiye haritası (Mapbox), paket konumları, istatistikler, kullanıcı galerisi, blog ve haber kartları
- **QR sayfası** (`/p/[slug]`): Paket bilgisi, il/ilçe seçimi, mesaj ve fotoğraf paylaşımı
- **Admin** (`/admin`): Giriş (Supabase Auth), paket/haber/blog yönetimi, domain ayarı (QR URL), paket hareketleri, kullanıcı görselleri

## Storage yolları

- `uploads/scan-images/` – kullanıcı tarama görselleri
- `uploads/news/` – haber kapak görselleri
- `uploads/blogs/` – blog kapak görselleri
