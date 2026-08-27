import type { Metadata } from "next";
import "./store.css";

const assetBasePath = process.env.NEXT_PUBLIC_ARUBA_BASE_PATH ?? "";
const homeUrl = `${assetBasePath}/`;
const catalogUrl = "https://kreluna-store.andreagadducci.chatgpt.site/store";
const pageUrl = "https://www.kreluna.it/store/";

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kreluna.it"),
  title: "Kreluna Store — Presentazione | Kreluna",
  description:
    "Scopri la visione di Kreluna Store sul sito principale Kreluna, poi apri il catalogo completo nello Store chiaro dedicato.",
  alternates: {
    canonical: "/store/",
    languages: {
      it: "/store/",
      "x-default": "/store/",
    },
  },
  openGraph: {
    title: "Kreluna Store — Presentazione",
    description:
      "La presentazione dark premium di Kreluna Store. Il catalogo completo resta separato nello Store chiaro dedicato.",
    url: "/store/",
    siteName: "Kreluna",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${assetBasePath}/store-og.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Kreluna Store — Presentazione",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kreluna Store — Presentazione",
    description:
      "Scopri la visione dello Store, poi apri il catalogo completo nello spazio chiaro dedicato.",
    images: [`${assetBasePath}/store-og.jpg`],
  },
};

const categoryCards = [
  {
    number: "01",
    symbol: "✦",
    title: "Per te",
    text: "Strumenti da esplorare per attività personali e quotidiane.",
    tone: "violet",
  },
  {
    number: "02",
    symbol: "▰",
    title: "Per il lavoro",
    text: "Software pensato per professionisti, team e imprese.",
    tone: "blue",
  },
  {
    number: "03",
    symbol: "◇",
    title: "AI e strumenti",
    text: "Soluzioni organizzate per funzione, piattaforma e bisogno.",
    tone: "pink",
  },
] as const;

const storePageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Kreluna Store — Presentazione",
      description:
        "Presentazione di Kreluna Store nel sito principale Kreluna, con accesso al catalogo esterno dedicato.",
      isPartOf: { "@id": "https://www.kreluna.it/#website" },
      about: { "@id": "https://www.kreluna.it/#organization" },
      inLanguage: "it-IT",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Kreluna",
          item: "https://www.kreluna.it/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Kreluna Store — Presentazione",
          item: pageUrl,
        },
      ],
    },
  ],
};

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

function StoreArt() {
  return (
    <div className="sp-art" aria-hidden="true">
      <span className="sp-star sp-star-one">✦</span>
      <span className="sp-star sp-star-two">✦</span>
      <span className="sp-orbit sp-orbit-one" />
      <span className="sp-orbit sp-orbit-two" />
      <span className="sp-orbit sp-orbit-three" />
      <span className="sp-satellite sp-satellite-cloud">●</span>
      <span className="sp-satellite sp-satellite-ai">A</span>
      <span className="sp-satellite sp-satellite-shield">◇</span>
      <div className="sp-bag">
        <span>K</span>
      </div>
      <span className="sp-platform sp-platform-one" />
      <span className="sp-platform sp-platform-two" />
      <span className="sp-platform-core" />
    </div>
  );
}

export default function StorePresentationPage() {
  return (
    <div className="sp-page" id="top">
      <a className="sp-skip-link" href="#store-main">Vai al contenuto</a>

      <header className="sp-header">
        <a className="sp-brand" href={homeUrl} aria-label="Kreluna, torna alla home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${assetBasePath}/kreluna-logo.png`} alt="" width="128" height="128" decoding="async" />
          <span>KRELUNA</span>
        </a>
        <nav className="sp-nav" aria-label="Navigazione Kreluna Store">
          <a href={homeUrl}>Home</a>
          <a href={`${homeUrl}#products`}>Ecosistema</a>
          <a href="#top" aria-current="page">Store</a>
        </nav>
        <a
          className="sp-header-cta"
          href={catalogUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Apri il catalogo Kreluna Store in una nuova scheda"
        >
          Apri lo Store <ExternalArrow />
        </a>
      </header>

      <main id="store-main">
        <section className="sp-hero" aria-labelledby="store-title">
          <div className="sp-grid" aria-hidden="true" />
          <span className="sp-ambient sp-ambient-blue" aria-hidden="true" />
          <span className="sp-ambient sp-ambient-violet" aria-hidden="true" />

          <div className="sp-hero-copy">
            <p className="sp-eyebrow"><i /> Kreluna Store · Presentazione</p>
            <h1 id="store-title">
              Software e strumenti.<br />
              <span>Più semplici da scoprire.</span>
            </h1>
            <p className="sp-lead">
              Questa è la presentazione dark di Kreluna Store sul sito principale
              Kreluna. Per esplorare il catalogo completo si passa allo Store
              chiaro dedicato.
            </p>
            <div className="sp-actions">
              <a
                className="sp-button sp-button-primary"
                href={catalogUrl}
                target="_blank"
                rel="noreferrer"
              >
                Apri il catalogo completo <ExternalArrow />
              </a>
              <a className="sp-button sp-button-secondary" href={homeUrl}>
                Torna a Kreluna <span aria-hidden="true">←</span>
              </a>
            </div>
            <p className="sp-external-note">
              <span aria-hidden="true">↗</span>
              Si apre in una nuova scheda il catalogo Kreluna Store,
              riconoscibile dall’interfaccia chiara.
            </p>
          </div>

          <StoreArt />

          <aside className="sp-clarity-card" aria-labelledby="clarity-title">
            <p className="sp-panel-label">Due spazi, un unico percorso</p>
            <h2 id="clarity-title">Presentazione qui.<br />Catalogo nello Store.</h2>
            <div className="sp-location-list">
              <div className="is-current">
                <span>01</span>
                <p><strong>Sei nella presentazione</strong><small>Dark premium · sito principale Kreluna</small></p>
                <b>QUI</b>
              </div>
              <div>
                <span>02</span>
                <p><strong>Il catalogo è separato</strong><small>Interfaccia chiara · sito Kreluna Store</small></p>
                <b>↗</b>
              </div>
            </div>
            <a
              className="sp-panel-link"
              href={catalogUrl}
              target="_blank"
              rel="noreferrer"
            >
              Apri il vero Store <ExternalArrow />
            </a>
          </aside>
        </section>

        <section className="sp-path sp-shell" aria-labelledby="path-title">
          <div className="sp-section-heading">
            <p className="sp-eyebrow"><i /> Il percorso</p>
            <h2 id="path-title">Due spazi.<br /><span>Una scelta chiara.</span></h2>
            <p>
              Prima conosci l’idea e il modo in cui lo Store si inserisce
              nell’ecosistema Kreluna. Poi, quando vuoi esplorare, apri il catalogo dedicato.
            </p>
          </div>
          <div className="sp-path-track">
            <article className="is-active">
              <span>01</span>
              <p className="sp-card-label">Sei qui</p>
              <h3>Presentazione Kreluna Store</h3>
              <p>Un ingresso editoriale dark premium, dentro il sito principale.</p>
              <small>www.kreluna.it/store/</small>
            </article>
            <div className="sp-path-arrow" aria-hidden="true"><i />→</div>
            <article>
              <span>02</span>
              <p className="sp-card-label">Passo successivo</p>
              <h3>Catalogo Kreluna Store</h3>
              <p>Lo spazio chiaro separato dove esplorare le schede disponibili.</p>
              <small>kreluna-store…/store</small>
            </article>
          </div>
        </section>

        <section className="sp-categories sp-shell" aria-labelledby="categories-title">
          <div className="sp-section-heading sp-section-heading-inline">
            <div>
              <p className="sp-eyebrow"><i /> Cosa potrai esplorare</p>
              <h2 id="categories-title">Trova il punto di partenza<br /><span>più vicino a ciò che ti serve.</span></h2>
            </div>
            <p>
              Qui mostriamo le aree, non un secondo catalogo. Nomi, schede e contenuti
              completi si trovano soltanto nello Store chiaro.
            </p>
          </div>
          <div className="sp-category-grid">
            {categoryCards.map((category) => (
              <article className={`sp-category-card ${category.tone}`} key={category.title}>
                <div className="sp-category-topline">
                  <span className="sp-category-icon" aria-hidden="true">{category.symbol}</span>
                  <small>{category.number}</small>
                </div>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
                <span className="sp-category-caption">Area del catalogo <i aria-hidden="true">↗</i></span>
              </article>
            ))}
          </div>
        </section>

        <section className="sp-principles sp-shell" aria-labelledby="principles-title">
          <div className="sp-principles-copy">
            <p className="sp-eyebrow"><i /> Un ingresso, senza sovrapposizioni</p>
            <h2 id="principles-title">La presentazione racconta.<br /><span>Lo Store fa esplorare.</span></h2>
            <p>
              La pagina resta parte di Kreluna e ne riprende il linguaggio visivo.
              Il catalogo mantiene invece il proprio spazio chiaro e indipendente.
            </p>
          </div>
          <div className="sp-principles-grid">
            <article><span>01</span><h3>Contesto</h3><p>Capisci che cos’è Kreluna Store prima di entrarvi.</p></article>
            <article><span>02</span><h3>Distinzione</h3><p>Ogni passaggio al catalogo esterno è indicato con chiarezza.</p></article>
            <article><span>03</span><h3>Continuità</h3><p>Un’identità coerente accompagna il percorso senza duplicarlo.</p></article>
            <article><span>04</span><h3>Scelta</h3><p>Decidi tu quando aprire il catalogo completo dedicato.</p></article>
          </div>
        </section>

        <section className="sp-risonix sp-shell" aria-labelledby="risonix-store-title">
          <div className="sp-risonix-mark" aria-hidden="true">⌁</div>
          <div><p className="sp-eyebrow"><i /> Nuovo software · Kreluna</p><h2 id="risonix-store-title">Risonix riconosce<br /><span>la tua musica.</span></h2><p>Impronte acustiche locali, file o microfono, percentuale di corrispondenza e licenza online per un solo dispositivo.</p></div>
          <a className="sp-button sp-button-primary" href={`${assetBasePath}/risonix`}>Scopri Risonix <ExternalArrow /></a>
        </section>

        <section className="sp-closing sp-shell" aria-labelledby="closing-title">
          <div className="sp-closing-glow" aria-hidden="true" />
          <p className="sp-eyebrow"><i /> Catalogo Kreluna Store</p>
          <h2 id="closing-title">Pronto a esplorare?</h2>
          <p>
            Apri il catalogo completo per vedere le schede disponibili nello Store chiaro dedicato.
          </p>
          <a
            className="sp-button sp-button-primary"
            href={catalogUrl}
            target="_blank"
            rel="noreferrer"
          >
            Vai al catalogo completo <ExternalArrow />
          </a>
          <small>Si apre in una nuova scheda. Questa presentazione resta qui, nel sito Kreluna.</small>
        </section>
      </main>

      <footer className="sp-footer sp-shell">
        <a className="sp-brand" href={homeUrl} aria-label="Kreluna, torna alla home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${assetBasePath}/kreluna-logo.png`} alt="" width="128" height="128" decoding="async" />
          <span>KRELUNA</span>
        </a>
        <p>Presentazione Kreluna Store · parte dell’ecosistema Kreluna.</p>
        <div>
          <a href={homeUrl}>Home Kreluna</a>
          <a href={catalogUrl} target="_blank" rel="noreferrer">Catalogo Store <ExternalArrow /></a>
        </div>
      </footer>

      <script
        id="kreluna-store-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storePageStructuredData) }}
      />
    </div>
  );
}
