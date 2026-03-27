import { Poppins, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import SiteContentProtection from "@/components/SiteContentProtection";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GezginKitap",
  description: "Kitaplar Türkiye'yi geziyor. Bir kitabı bul, kayıt yap ve başka bir şehre bırak. Türkiye'nin en ilginç kitap yolculuğunu birlikte yazıyoruz.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body
        className={`${poppins.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <SiteContentProtection />
        <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
      </body>
    </html>
  );
}
