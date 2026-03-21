const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata = {
  title: {
    template: '%s | Türkiye’yi Keşfet | GezginKitap',
    default: 'Türkiye’yi Keşfet | GezginKitap',
  },
  description:
    'Görmelisin, tatmalısın, almalısın, gitmeli ve kalmalısın kategorilerinde Türkiye rotaları, kültür ve turizm yazıları.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
  },
  metadataBase: new URL(defaultUrl),
}

export default function TurizmLayout({ children }) {
  return children
}
