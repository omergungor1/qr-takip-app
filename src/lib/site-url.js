/** Üretimde canonical ve OG için .env içinde tanımlayın (örn. https://siteadiniz.com) */
export function getPublicSiteBase() {
  return (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
}
