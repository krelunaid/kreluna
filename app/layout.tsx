import type { Metadata, Viewport } from "next";
import CookieConsent from "./cookie-consent";
import MetaPixel from "./meta-pixel";
import "./globals.css";

const assetBasePath = process.env.NEXT_PUBLIC_ARUBA_BASE_PATH ?? "";
const isArubaPreview = assetBasePath.length > 0;
const siteUrl = "https://www.kreluna.it";
const siteTitle = "Kreluna | AI, automazione e cybersecurity";
const siteDescription =
  "Kreluna progetta AI, automazione dei processi e cybersecurity intorno al lavoro reale, con controllo umano, dati protetti e limiti dichiarati.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Kreluna",
  creator: "Kreluna",
  publisher: "Kreluna",
  category: "technology",
  alternates: {
    canonical: `${siteUrl}/`,
    languages: {
      it: `${siteUrl}/`,
      en: `${siteUrl}/en/`,
      "x-default": `${siteUrl}/`,
    },
  },
  robots: isArubaPreview
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
  icons: {
    icon: [
      { url: `${assetBasePath}/favicon-32.png`, type: "image/png", sizes: "32x32" },
      { url: `${assetBasePath}/favicon-192.png`, type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: `${assetBasePath}/favicon-192.png`, type: "image/png", sizes: "192x192" }],
  },
  manifest: `${assetBasePath}/site.webmanifest`,
  openGraph: {
    title: siteTitle,
    description: "AI, automazione e cybersecurity progettate intorno a lavoro reale, responsabilità umana e limiti verificabili.",
    siteName: "Kreluna",
    locale: "it_IT",
    alternateLocale: ["en_GB"],
    type: "website",
    url: `${siteUrl}/`,
    images: [
      {
        url: `${assetBasePath}/og-kreluna.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: "AI, automazione e cybersecurity progettate intorno a lavoro reale, responsabilità umana e limiti verificabili.",
    images: [`${assetBasePath}/og-kreluna.jpg`],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a10",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it-IT" suppressHydrationWarning>
      <head>
        <link rel="preload" href={`${assetBasePath}/fonts/inter-latin.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${assetBasePath}/fonts/space-grotesk-latin.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${assetBasePath}/fonts/newsreader-500-italic.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${assetBasePath}/fonts/ibm-plex-mono-500.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <MetaPixel />
        <CookieConsent />
      </body>
    </html>
  );
}
