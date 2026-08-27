import type { Metadata } from "next";
import { redirect } from "next/navigation";

const marketplaceUrl = "https://store.kreluna.it";

export const metadata: Metadata = {
  title: "Marketplace Kreluna | App, software e prodotti digitali",
  description: "Scopri Risonix e il software Kreluna realmente disponibile nel marketplace ufficiale.",
  alternates: { canonical: marketplaceUrl },
  openGraph: {
    title: "Marketplace Kreluna",
    description: "Risonix e il software Kreluna disponibile nel marketplace ufficiale.",
    url: marketplaceUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketplace Kreluna",
    description: "Risonix e il software Kreluna disponibile nel marketplace ufficiale.",
  },
};

export default function MarketplacePage() {
  redirect(marketplaceUrl);
}
