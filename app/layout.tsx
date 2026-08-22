import type { Metadata, Viewport } from "next";
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
      knowsAbout: [
        "Artificial intelligence",
        "Business process automation",
        "Cybersecurity",
        "Professional services workflows",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Kreluna",
      alternateName: "Kreluna Ecosystem",
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: ["it-IT", "en-GB"],
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: siteTitle,
      description: siteDescription,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: "it-IT",
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Che cos’è Kreluna?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kreluna è un progetto italiano in sviluppo dedicato ad AI, automazione e cybersecurity. I dati societari e fiscali saranno pubblicati quando disponibili.",
          },
        },
        {
          "@type": "Question",
          name: "I prodotti Kreluna sono già acquistabili?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non viene dichiarata una disponibilità generale. Accesso, funzioni, integrazioni e condizioni vengono confermati per ogni richiesta.",
          },
        },
        {
          "@type": "Question",
          name: "Kreluna sostituisce software o professionisti?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No in modo automatico. Il ruolo proposto è preparare e collegare il lavoro mantenendo sistemi ufficiali, responsabilità e approvazioni sotto controllo umano.",
          },
        },
        {
          "@type": "Question",
          name: "Posso inviare documenti per una valutazione?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nel primo contatto no. È sufficiente descrivere il contesto senza allegare dati personali, credenziali o documenti riservati.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it-IT" suppressHydrationWarning>
      <head>
        <link rel="preload" href={`${assetBasePath}/fonts/inter-latin.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${assetBasePath}/fonts/space-grotesk-latin.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={`${assetBasePath}/fonts/newsreader-500-italic.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
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
