import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://www.kreluna.it";
const siteTitle = "Kreluna — Creiamo prodotti per ciò che viene dopo";
const siteDescription =
  "Kreluna progetta software e intelligenza artificiale. Scopri Kreluna AI, Office, Cyber, LikeCash, Kreluna Token (KRL) e i prossimi progetti dell'ecosistema.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Kreluna",
  creator: "Kreluna",
  publisher: "Kreluna",
  category: "technology",
  alternates: {
    canonical: "/",
    languages: {
      it: "/",
      en: "/en/",
      "x-default": "/",
    },
  },
  robots: {
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
    icon: [{ url: "/kreluna-logo.png", type: "image/png", sizes: "128x128" }],
    apple: [{ url: "/kreluna-logo.png", type: "image/png", sizes: "128x128" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: siteTitle,
    description: "Un'unica visione. Progetti diversi. Scopri l'ecosistema Kreluna.",
    url: "/",
    siteName: "Kreluna",
    locale: "it_IT",
    alternateLocale: ["en_US"],
    type: "website",
    images: [
      {
        url: "/og-kreluna.jpg",
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
    description: "Un'unica visione. Progetti diversi. Scopri l'ecosistema Kreluna.",
    images: ["/og-kreluna.jpg"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a10",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Kreluna",
      alternateName: "Kreluna Ecosystem",
      url: `${siteUrl}/`,
      description: siteDescription,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/kreluna-logo.png`,
        width: 128,
        height: 128,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${siteUrl}/contatti.html`,
        availableLanguage: ["Italian", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Kreluna",
      alternateName: "Kreluna Ecosystem",
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: ["it-IT", "en-US"],
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: siteTitle,
      description: siteDescription,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-kreluna.jpg`,
        width: 1200,
        height: 630,
      },
      inLanguage: "it-IT",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it-IT">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* The root App Router layout is shared by every route in this site. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;600&family=Newsreader:ital,wght@1,500&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <script
          id="kreluna-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
