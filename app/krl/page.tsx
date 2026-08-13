import type { Metadata } from "next";
import KrlBetaClient from "./KrlBetaClient";
import "./krl.css";

const assetBasePath = process.env.NEXT_PUBLIC_ARUBA_BASE_PATH ?? "";

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kreluna.it"),
  title: "KRL Beta — Utility in prova | Kreluna",
  description:
    "KRL Beta è la demo tecnica del token Kreluna su Base Sepolia: nessun valore reale, nessuna vendita e utilità AI simulata.",
  alternates: { canonical: "/krl/" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "KRL Beta — Utility in prova",
    description: "Demo tecnica Kreluna su Base Sepolia. Nessun valore reale e nessuna vendita.",
    url: "/krl/",
    siteName: "Kreluna",
    locale: "it_IT",
    type: "website",
    images: [{
      url: `${assetBasePath}/krl-beta-og.png`,
      width: 1731,
      height: 909,
      alt: "KRL Beta — Utility in prova su Base Sepolia",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KRL Beta — Utility in prova",
    description: "Demo tecnica Kreluna su Base Sepolia.",
    images: [`${assetBasePath}/krl-beta-og.png`],
  },
};

export default function KrlPage() {
  return <KrlBetaClient assetBasePath={assetBasePath} />;
}
