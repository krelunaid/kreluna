import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kreluna.it"),
  title: "Kreluna — Creiamo prodotti per ciò che viene dopo",
  description: "Kreluna progetta software e intelligenza artificiale. Scopri Kreluna AI, Office, Cyber, LikeCash, Kreluna Token (KRL) e i prossimi progetti dell'ecosistema.",
  icons: { icon: "/kreluna-logo.png", apple: "/kreluna-logo.png" },
  openGraph: {
    title: "Kreluna — Creiamo prodotti per ciò che viene dopo",
    description: "Un'unica visione. Progetti diversi. Scopri l'ecosistema Kreluna.",
    url: "/",
    siteName: "Kreluna",
    locale: "it_IT",
    type: "website",
    images: [{ url: "/og-v2.png", width: 1731, height: 909, alt: "Kreluna — Creiamo prodotti per ciò che viene dopo" }],
  },
  twitter: { card: "summary_large_image", title: "Kreluna", description: "Creiamo prodotti per ciò che viene dopo.", images: ["/og-v2.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body>{children}</body></html>;
}
