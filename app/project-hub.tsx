/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";

export type ProjectHubLocale = "it" | "en" | "fr" | "es" | "de";

const siteUrl = "https://www.kreluna.it";
export const projectHubPaths: Record<ProjectHubLocale, string> = {
  it: "/progetti",
  en: "/en/projects",
  fr: "/fr/projects",
  es: "/es/projects",
  de: "/de/projects",
};

const copy = {
  it: { lang: "it-IT", title: "Progetti Kreluna | Prodotti e concept in sviluppo", description: "Scopri i progetti pubblici di Kreluna, il loro stato e le pagine dedicate.", eyebrow: "Progetti Kreluna", headingA: "Poche idee in vista.", headingB: "Ognuna con il suo spazio.", intro: "Qui raccogliamo soltanto i progetti che possiamo raccontare con chiarezza. Quelli non ancora pronti restano privati fino al momento giusto.", home: "Home", contact: "Parliamone", discover: "Scopri il progetto", cityStatus: "Pre-lancio", velvetStatus: "Concept in sviluppo", cityCategory: "Pubblicità sui maxi-schermi", velvetCategory: "Esperienza gastronomica", cityTagline: "Il tuo momento sui grandi schermi del mondo.", velvetTagline: "La serata scelta attraverso atmosfera, occasione e tavolo." },
  en: { lang: "en-GB", title: "Kreluna Projects | Products and concepts in development", description: "Explore Kreluna’s public projects, their current status and dedicated pages.", eyebrow: "Kreluna projects", headingA: "A few ideas in view.", headingB: "Each with its own space.", intro: "We publish only the projects we can explain clearly. Everything else remains private until it is ready.", home: "Home", contact: "Contact", discover: "Explore the project", cityStatus: "Pre-launch", velvetStatus: "Concept in development", cityCategory: "Digital out-of-home", velvetCategory: "Dining experience", cityTagline: "Your moment on the world’s biggest screens.", velvetTagline: "Choose the evening through atmosphere, occasion and table." },
  fr: { lang: "fr-FR", title: "Projets Kreluna | Produits et concepts en développement", description: "Découvrez les projets publics de Kreluna, leur état actuel et leurs pages dédiées.", eyebrow: "Projets Kreluna", headingA: "Quelques idées en vue.", headingB: "Chacune avec son espace.", intro: "Nous publions uniquement les projets que nous pouvons expliquer clairement. Les autres restent privés jusqu’au bon moment.", home: "Accueil", contact: "Contact", discover: "Découvrir le projet", cityStatus: "Pré-lancement", velvetStatus: "Concept en développement", cityCategory: "Affichage numérique extérieur", velvetCategory: "Expérience gastronomique", cityTagline: "Votre moment sur les plus grands écrans du monde.", velvetTagline: "Choisissez la soirée selon l’ambiance, l’occasion et la table." },
  es: { lang: "es-ES", title: "Proyectos Kreluna | Productos y conceptos en desarrollo", description: "Descubre los proyectos públicos de Kreluna, su estado actual y sus páginas dedicadas.", eyebrow: "Proyectos Kreluna", headingA: "Pocas ideas a la vista.", headingB: "Cada una con su espacio.", intro: "Publicamos solo los proyectos que podemos explicar con claridad. Los demás permanecen privados hasta que estén preparados.", home: "Inicio", contact: "Contacto", discover: "Descubrir el proyecto", cityStatus: "Prelanzamiento", velvetStatus: "Concepto en desarrollo", cityCategory: "Publicidad exterior digital", velvetCategory: "Experiencia gastronómica", cityTagline: "Tu momento en las pantallas más grandes del mundo.", velvetTagline: "Elige la noche por ambiente, ocasión y mesa." },
  de: { lang: "de-DE", title: "Kreluna Projekte | Produkte und Konzepte in Entwicklung", description: "Entdecke Krelunas öffentliche Projekte, ihren aktuellen Status und die jeweiligen Projektseiten.", eyebrow: "Kreluna Projekte", headingA: "Wenige Ideen im Blick.", headingB: "Jede mit ihrem eigenen Raum.", intro: "Wir zeigen nur Projekte, die wir klar erklären können. Alles andere bleibt privat, bis es bereit ist.", home: "Startseite", contact: "Kontakt", discover: "Projekt entdecken", cityStatus: "Vor dem Start", velvetStatus: "Konzept in Entwicklung", cityCategory: "Digitale Außenwerbung", velvetCategory: "Gastronomieerlebnis", cityTagline: "Dein Moment auf den größten Bildschirmen der Welt.", velvetTagline: "Wähle den Abend nach Atmosphäre, Anlass und Tisch." },
} as const;

const cityBeamPaths: Record<ProjectHubLocale, string> = { it: "/citybeam", en: "/en/citybeam", fr: "/fr/citybeam", es: "/es/citybeam", de: "/de/citybeam" };
const velvetPaths: Record<ProjectHubLocale, string> = { it: "/velvet-table", en: "/en/velvet-table", fr: "/fr/velvet-table", es: "/es/velvet-table", de: "/de/velvet-table" };

export function projectHubMetadata(locale: ProjectHubLocale): Metadata {
  const t = copy[locale];
  const canonical = `${siteUrl}${projectHubPaths[locale]}`;
  const languages = Object.fromEntries(Object.entries(projectHubPaths).map(([language, path]) => [language, `${siteUrl}${path}`]));
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical, languages: { ...languages, "x-default": `${siteUrl}/progetti` } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { title: t.title, description: t.description, url: canonical, siteName: "Kreluna", locale: t.lang.replace("-", "_"), type: "website", images: [{ url: `${siteUrl}/og-kreluna.jpg`, width: 1200, height: 630, type: "image/jpeg", alt: t.title }] },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [`${siteUrl}/og-kreluna.jpg`] },
  };
}

export default function ProjectHub({ locale }: { locale: ProjectHubLocale }) {
  const t = copy[locale];
  const canonical = `${siteUrl}${projectHubPaths[locale]}`;
  const contactHref = {it:"/contatti",en:"/en/contact",fr:"/fr/contact",es:"/es/contacto",de:"/de/kontakt"}[locale];
  const projects = [
    { name: "CityBeam", status: t.cityStatus, category: t.cityCategory, tagline: t.cityTagline, href: cityBeamPaths[locale], image: "/citybeam-hero-1200.webp", slug: "citybeam" },
    { name: "Velvet Table", status: t.velvetStatus, category: t.velvetCategory, tagline: t.velvetTagline, href: velvetPaths[locale], image: "/velvet-table/hero-1200.webp", slug: "velvet-table" },
  ];
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Kreluna", url: `${siteUrl}/`, logo: `${siteUrl}/kreluna-logo.png` },
    { "@type": "CollectionPage", "@id": `${canonical}#webpage`, url: canonical, name: t.title, description: t.description, inLanguage: t.lang, about: { "@id": `${siteUrl}/#organization` } },
    { "@type": "ItemList", itemListElement: projects.map((project, index) => ({ "@type": "ListItem", position: index + 1, name: project.name, url: `${siteUrl}${project.href}` })) },
  ] };

  return (
    <div className="projects-page" lang={t.lang}>
      <header className="projects-page-header">
        <Link className="projects-page-brand" href={locale === "it" ? "/" : `/${locale}`} aria-label="Kreluna projects"><img src="/kreluna-logo-64.webp" alt="" width="34" height="34" /><span>KRELUNA</span></Link>
        <nav aria-label="Projects navigation"><Link href={locale === "it" ? "/" : `/${locale}`}>{t.home}</Link><a href={cityBeamPaths[locale]}>CityBeam</a><a className="button button-small button-primary" href={contactHref}>{t.contact}</a></nav>
      </header>
      <main>
        <section className="projects-page-hero"><div className="eyebrow"><i /> {t.eyebrow}</div><h1>{t.headingA}<br /><em>{t.headingB}</em></h1><p>{t.intro}</p></section>
        <section className="projects-page-grid" aria-label={t.eyebrow}>{projects.map((project, index) => <article className={`projects-page-card project-${project.slug}`} key={project.slug}><img src={project.image} alt="" width="1200" height="760" /><div className="projects-page-card-overlay" /><div className="projects-page-card-copy"><div className="projects-page-card-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{project.status}</span></div><div><p>{project.category}</p><h2>{project.name}</h2><h3>{project.tagline}</h3><a href={project.href}>{t.discover} <span aria-hidden="true">↗</span></a></div></div></article>)}</section>
      </main>
      <footer className="projects-page-footer"><span>© 2026 Kreluna</span><span>P. IVA 02114130475 · REA PT-622714</span></footer>
      <script id="projects-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
