import type { Metadata } from "next";
import MarketplaceClient from "./marketplace-client";
import "./marketplace.css";

const marketplaceUrl = "https://www.kreluna.it/marketplace";

export const metadata: Metadata = {
  title: "Marketplace Kreluna | App, software e prodotti digitali",
  description: "Esplora tutte le app, i software e i prodotti digitali Kreluna per categoria. Scopri Risonix, Helix, Velvet Table e i nuovi progetti dell’ecosistema.",
  alternates: { canonical: marketplaceUrl },
  openGraph: {
    title: "Marketplace Kreluna",
    description: "Tutte le app, i software e i prodotti digitali Kreluna in un unico catalogo.",
    url: marketplaceUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketplace Kreluna",
    description: "Tutte le app, i software e i prodotti digitali Kreluna in un unico catalogo.",
  },
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
