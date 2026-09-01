import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import CookieConsent from "./cookie-consent";
import MetaPixel from "./meta-pixel";
import "./globals.css";

const assetBasePath = process.env.NEXT_PUBLIC_ARUBA_BASE_PATH ?? "";
const isArubaPreview = assetBasePath.length > 0;
const siteUrl = "https://www.kreluna.it";
const siteTitle = "Kreluna | Software, automazione e progetti digitali";
const siteDescription =
  "Kreluna trasforma processi e idee in software, automazioni e progetti digitali concreti, con controllo umano e obiettivi chiari.";

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
    description: siteDescription,
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
    description: siteDescription,
    images: [`${assetBasePath}/og-kreluna.jpg`],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a10",
};

function documentLanguage(pathname: string): string {
  if (/^\/en(?:\/|$)/.test(pathname)) return "en-GB";
  if (/^\/fr(?:\/|$)/.test(pathname)) return "fr-FR";
  if (/^\/es(?:\/|$)/.test(pathname)) return "es-ES";
  if (/^\/de(?:\/|$)/.test(pathname)) return "de-DE";
  return "it-IT";
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-kreluna-pathname") ?? "/";

  return (
    <html lang={documentLanguage(pathname)} suppressHydrationWarning>
      <head>
        <link rel="preload" href={`${assetBasePath}/fonts/inter-latin.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${assetBasePath}/fonts/space-grotesk-latin.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${assetBasePath}/fonts/newsreader-500-italic.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
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
