import type { Metadata } from "next";
import "./globals.css";

const assetBasePath = process.env.NEXT_PUBLIC_ARUBA_BASE_PATH ?? "";
const isArubaPreview = assetBasePath.length > 0;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kreluna.it"),
  title: "Kreluna — Creiamo prodotti per ciò che viene dopo",
  description: "Kreluna progetta software e intelligenza artificiale. Scopri Kreluna AI, Office, Cyber, LikeCash, Kreluna Token (KRL) e i prossimi progetti dell'ecosistema.",
  alternates: { canonical: isArubaPreview ? `${assetBasePath}/` : "/" },
  robots: isArubaPreview ? { index: false, follow: false } : undefined,
  other: {
    "application-name": "Kreluna",
  },
  icons: { icon: `${assetBasePath}/kreluna-logo.png`, apple: `${assetBasePath}/kreluna-logo.png` },
  openGraph: {
    title: "Kreluna — Creiamo prodotti per ciò che viene dopo",
    description: "Un'unica visione. Progetti diversi. Scopri l'ecosistema Kreluna.",
    url: isArubaPreview ? `${assetBasePath}/` : "/",
    siteName: "Kreluna",
    locale: "it_IT",
    type: "website",
    images: [{ url: `${assetBasePath}/og-v2.png`, width: 1731, height: 909, alt: "Kreluna — Creiamo prodotti per ciò che viene dopo" }],
  },
  twitter: { card: "summary_large_image", title: "Kreluna", description: "Creiamo prodotti per ciò che viene dopo.", images: [`${assetBasePath}/og-v2.png`] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.kreluna.it/#organization",
        name: "Kreluna",
        url: "https://www.kreluna.it/",
        logo: "https://www.kreluna.it/kreluna-logo.png",
        email: "krelunaid@gmail.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.kreluna.it/#website",
        url: "https://www.kreluna.it/",
        name: "Kreluna",
        publisher: { "@id": "https://www.kreluna.it/#organization" },
        inLanguage: "it-IT",
      },
    ],
  };

  return (
    <html lang="it">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
