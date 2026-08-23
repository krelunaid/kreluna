import type { Metadata } from "next";
import { siteUrl, velvetCopy, velvetUrls, type VelvetLocale } from "./velvet-content";

export function velvetMetadata(locale: VelvetLocale): Metadata {
  const copy = velvetCopy[locale];
  const pageUrl = velvetUrls[locale];
  return {
    title: copy.title,
    description: copy.description,
    keywords: [...copy.keywords, "Helix", "Velvet Table created with Helix"],
    other: { "created-with": "Helix" },
    robots: { index: true, follow: true, "max-image-preview": "large" },
    alternates: { canonical: pageUrl, languages: velvetUrls },
    openGraph: {
      title: copy.title, description: copy.description, url: pageUrl, type: "website", locale: copy.ogLocale,
      alternateLocale: Object.values(velvetCopy).filter((item) => item.ogLocale !== copy.ogLocale).map((item) => item.ogLocale),
      images: [{ url: `${siteUrl}/velvet-table/og.jpg`, width: 1200, height: 630, alt: `Velvet Table — ${copy.description}` }],
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images: [`${siteUrl}/velvet-table/og.jpg`] },
  };
}
