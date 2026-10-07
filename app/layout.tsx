import type { Metadata, Viewport } from "next";
import { Caveat, Cormorant_Garamond, Nunito } from "next/font/google";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-nunito", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kalleb faz 1 ano",
  description: "Você é nosso convidado para celebrar o primeiro ano do Kalleb.",
  openGraph: {
    title: "Kalleb faz 1 ano",
    description: "Você é nosso convidado para celebrar o primeiro ano do Kalleb.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Placa de madeira com “Kalleb 1 ano” e a Arca de Noé navegando no mar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalleb faz 1 ano",
    description: "Você é nosso convidado para celebrar o primeiro ano do Kalleb.",
    images: ["/og.jpg"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#A8D2E8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${caveat.variable} ${cormorant.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}
