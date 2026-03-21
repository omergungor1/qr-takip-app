import data from '../../data/blogs.json'

function escapeHtml(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Mock liste + detay için tek kaynak */
export function getMockTurizmBlogs() {
  return (data.blogs || []).map((b) => ({
    ...b,
    cover_image: b.image,
    excerpt: b.description,
  }))
}

export function getMockBlogBySlug(slug) {
  return getMockTurizmBlogs().find((b) => b.slug === slug) || null
}

/**
 * JSON’da sadece kısa açıklama olduğu için detay sayfasını zenginleştirir (mock).
 */
export function buildMockArticleHtml(blog, categoryLabel) {
  const desc = escapeHtml(blog.description)
  const cat = escapeHtml(categoryLabel)

  return `
<p class="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">${desc}</p>
<p class="mt-6 text-slate-700 leading-relaxed">
  Bu içerik, <strong>${cat}</strong> başlığı altında Türkiye’nin farklı bölgelerinden seçilmiş durakları ve deneyimleri öne çıkarır.
  Rota planlarken mevsimi, yerel etkinlikleri ve ulaşım seçeneklerini bir arada düşünmek keyifli bir geziyi garanti eder.
</p>

<h2 class="!mt-10 !mb-4 text-2xl font-bold text-slate-900" style="font-family: var(--font-heading), ui-sans-serif, system-ui, sans-serif;">Bu durağı neden keşfetmelisiniz?</h2>
<p class="text-slate-700 leading-relaxed">
  Türkiye’nin kültürel ve doğal mirası, her köşesinde farklı bir hikâye sunar. Bu noktayı ziyaret etmek; hem fotoğraf hem de hafıza için güçlü bir durak olabilir.
  Yerel rehberler ve müze kartları gibi seçenekler deneyimi derinleştirir; erken rezervasyon ve hafta içi ziyaretler kalabalığı azaltır.
</p>

<h2 class="!mt-10 !mb-4 text-2xl font-bold text-slate-900" style="font-family: var(--font-heading), ui-sans-serif, system-ui, sans-serif;">Ziyaret ipuçları</h2>
<ul class="list-disc pl-5 space-y-2 text-slate-700">
  <li>Rahat ayakkabı ve katmanlı giyim; hava bir günde bile değişebilir.</li>
  <li>Yerel mutfağı denemek için küçük işletmeleri ve semt pazarlarını keşfedin.</li>
  <li>Kültürel alanlarda fotoğraf kurallarına ve sessiz alan işaretlerine dikkat edin.</li>
  <li>Toplu taşıma veya bisiklet kiralama ile çevreye duyarlı alternatifler değerlendirin.</li>
</ul>

<blockquote class="my-8 border-l-4 border-[var(--primary)] pl-5 py-1 text-slate-600 italic bg-slate-50 rounded-r-xl pr-4">
  “GezginKitap yolculuğunuzda kitapları şehirden şehire taşırken, Türkiye’nin bu güzergâhlarında mola vermek hem dinlendirici hem ilham verici.”
</blockquote>

<h2 class="!mt-10 !mb-4 text-2xl font-bold text-slate-900" style="font-family: var(--font-heading), ui-sans-serif, system-ui, sans-serif;">Yakın rotalar ve kombinasyonlar</h2>
<p class="text-slate-700 leading-relaxed">
  Aynı bölgede birden fazla durak planlayarak günü verimli kullanabilirsiniz. Akşamüstü ışığında kısa bir yürüyüş veya gün doğumunda sakin bir tur, aynı mekânı bambaşka gösterir.
  Seyahat sonrası notlarınızı GezginKitap pasaportu veya günlüğünüzle birleştirmek, anıları kalıcı kılar.
</p>

<h2 class="!mt-10 !mb-4 text-2xl font-bold text-slate-900" style="font-family: var(--font-heading), ui-sans-serif, system-ui, sans-serif;">Sık sorulanlar</h2>
<dl class="space-y-4 text-slate-700">
  <div>
    <dt class="font-semibold text-slate-900">En iyi ziyaret zamanı ne zaman?</dt>
    <dd class="mt-1">İlkbahar ve sonbahar genelde ılıman hava ve daha az yoğunluk sunar; yaz aylarında erken saatler tercih edilebilir.</dd>
  </div>
  <div>
    <dt class="font-semibold text-slate-900">Erişilebilirlik için ne düşünmeliyim?</dt>
    <dd class="mt-1">Resmi sitelerden rampa, asansör ve rehberli tur bilgilerini kontrol etmek faydalıdır.</dd>
  </div>
</dl>
`
}
