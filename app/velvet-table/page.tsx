import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.kreluna.it";
const pageUrl = `${siteUrl}/velvet-table/`;
const title = "Velvet Table | Prenota il ristorante partendo dall’atmosfera";
const description =
  "Velvet Table è il concept Kreluna per trovare e prenotare un ristorante partendo dall’atmosfera desiderata, dall’occasione e dalla compagnia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: pageUrl,
    languages: {
      it: pageUrl,
      "x-default": pageUrl,
    },
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    locale: "it_IT",
    images: [
      {
        url: `${siteUrl}/og-kreluna.jpg`,
        width: 1200,
        height: 630,
        alt: "Velvet Table — prenota l’atmosfera, non solo il tavolo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og-kreluna.jpg`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "it-IT",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${pageUrl}#service` },
      dateModified: "2026-08-23",
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Velvet Table",
      alternateName: "Velvet Table by Kreluna",
      serviceType: "Ricerca e prenotazione di ristoranti in base all’atmosfera",
      description,
      provider: { "@id": `${siteUrl}/#organization` },
      url: pageUrl,
      areaServed: "IT",
      audience: {
        "@type": "Audience",
        audienceType: "Persone che scelgono un ristorante in base all’esperienza desiderata",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kreluna", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Velvet Table", item: pageUrl },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Che cos’è Velvet Table?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Velvet Table è un concept Kreluna in sviluppo per trovare e prenotare ristoranti partendo dall’atmosfera desiderata, dall’occasione e dalla compagnia, oltre che da cucina, zona, budget e disponibilità.",
          },
        },
        {
          "@type": "Question",
          name: "In cosa è diverso da una normale prenotazione di ristorante?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Una normale ricerca parte spesso da luogo, cucina e orario. Velvet Table parte dal tipo di serata che la persona vuole vivere e usa i filtri pratici per arrivare a una selezione coerente e prenotabile.",
          },
        },
        {
          "@type": "Question",
          name: "Velvet Table è già disponibile?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Velvet Table è attualmente un concept in sviluppo. Funzioni, copertura geografica, locali disponibili e modalità di prenotazione saranno comunicate quando confermate.",
          },
        },
      ],
    },
  ],
};

const moods = [
  ["Intima", "Luci morbide, ritmo tranquillo e spazio per parlare."],
  ["Vivace", "Energia, musica e una sala adatta a una serata dinamica."],
  ["Panoramica", "Una vista che diventa parte dell’esperienza."],
  ["Rilassata", "Informale, accogliente e senza fretta."],
  ["Elegante", "Cura del servizio e atmosfera per un’occasione speciale."],
  ["Sorprendente", "Un luogo capace di rendere la serata memorabile."],
] as const;

export default function VelvetTablePage() {
  return (
    <div className="velvet-page">
      <a className="skip-link" href="#velvet-main">Vai al contenuto</a>
      <header className="velvet-page-header">
        <Link className="velvet-page-brand" href="/" aria-label="Kreluna, torna alla home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kreluna-logo.png" width="46" height="46" alt="" />
          <span>KRELUNA</span>
        </Link>
        <nav aria-label="Navigazione Velvet Table">
          <a href="#come-funziona">Come funziona</a>
          <a href="#atmosfere">Atmosfere</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="button button-small velvet-page-button" href="mailto:krelunaid@gmail.com?subject=Velvet%20Table">
          Segui il progetto
        </a>
      </header>

      <main id="velvet-main">
        <section className="velvet-page-hero section-shell">
          <div className="velvet-page-glow" aria-hidden="true" />
          <div className="velvet-page-hero-copy">
            <div className="eyebrow velvet-text"><i /> Concept Kreluna · in sviluppo</div>
            <h1>Prenota l’atmosfera.<br /><em>Non solo il tavolo.</em></h1>
            <p>
              Velvet Table nasce per trovare un ristorante partendo da come vuoi sentirti:
              una cena intima, una serata vivace, una vista speciale o un momento rilassato.
              L’esperienza desiderata viene prima; disponibilità e prenotazione completano la scelta.
            </p>
            <div className="hero-actions">
              <a className="button velvet-page-button" href="#come-funziona">Scopri come funziona ↓</a>
              <Link className="button button-secondary" href="/">Torna a Kreluna</Link>
            </div>
            <p className="velvet-disclosure">
              Velvet Table non è ancora un servizio attivo. Il concept, le funzioni e la copertura
              vengono presentati con trasparenza mentre il progetto prende forma.
            </p>
          </div>
          <div className="velvet-compass" aria-label="Atmosfere considerate da Velvet Table">
            <span className="velvet-compass-center">La tua<br /><strong>serata</strong></span>
            <span className="mood mood-one">Intima</span>
            <span className="mood mood-two">Vivace</span>
            <span className="mood mood-three">Panoramica</span>
            <span className="mood mood-four">Rilassata</span>
          </div>
        </section>

        <section className="velvet-definition section-shell">
          <div className="eyebrow velvet-text"><i /> Che cos’è Velvet Table</div>
          <div className="velvet-definition-grid">
            <h2>La prenotazione diventa una scelta di esperienza.</h2>
            <div>
              <p>
                Le piattaforme tradizionali aiutano a trovare un tavolo per cucina, zona, prezzo e
                orario. Velvet Table aggiunge la domanda che spesso viene prima di tutte: che tipo
                di serata vuoi vivere?
              </p>
              <p>
                Atmosfera, occasione e compagnia diventano criteri espliciti. Il risultato immaginato
                è una selezione breve di locali in sintonia, accompagnata dal motivo per cui ciascuno
                può essere adatto a quel momento.
              </p>
            </div>
          </div>
        </section>

        <section className="velvet-process section-shell" id="come-funziona">
          <div className="velvet-section-heading">
            <div className="eyebrow velvet-text"><i /> Come funzionerebbe</div>
            <h2>Dal desiderio alla prenotazione.</h2>
          </div>
          <ol className="velvet-process-grid">
            <li><span>01</span><h3>Racconta il momento</h3><p>Indica atmosfera, occasione, compagnia e ciò che renderebbe giusta la serata.</p></li>
            <li><span>02</span><h3>Aggiungi i confini pratici</h3><p>Zona, cucina, budget, orario, esigenze alimentari e preferenze essenziali.</p></li>
            <li><span>03</span><h3>Confronta pochi locali</h3><p>Una selezione motivata, pensata per ridurre rumore e liste interminabili.</p></li>
            <li><span>04</span><h3>Conferma il tavolo</h3><p>Solo dopo aver scelto l’esperienza si passa a disponibilità e prenotazione.</p></li>
          </ol>
        </section>

        <section className="velvet-atmospheres section-shell" id="atmosfere">
          <div className="velvet-section-heading">
            <div className="eyebrow velvet-text"><i /> Il linguaggio dell’atmosfera</div>
            <h2>Non una categoria.<br />Una sensazione riconoscibile.</h2>
          </div>
          <div className="velvet-atmosphere-grid">
            {moods.map(([name, copy], index) => (
              <article key={name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{name}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="velvet-faq section-shell" id="faq">
          <div className="velvet-section-heading">
            <div className="eyebrow velvet-text"><i /> Domande frequenti</div>
            <h2>Il concept, senza promesse premature.</h2>
          </div>
          <div className="velvet-faq-list">
            <article><h3>Che cos’è Velvet Table?</h3><p>È un concept Kreluna per trovare e prenotare ristoranti partendo dall’atmosfera desiderata, dall’occasione e dalla compagnia, oltre che dai filtri pratici.</p></article>
            <article><h3>In cosa è diverso da una normale prenotazione?</h3><p>La ricerca non inizia da una lista di locali: parte dal tipo di serata che vuoi vivere e usa zona, cucina, prezzo e orario per rendere concreta quella scelta.</p></article>
            <article><h3>È già disponibile?</h3><p>No. Velvet Table è in sviluppo. Copertura geografica, locali, funzioni e modalità di prenotazione saranno comunicate soltanto quando confermate.</p></article>
          </div>
        </section>

        <section className="velvet-closing section-shell">
          <div>
            <div className="eyebrow velvet-text"><i /> Velvet Table by Kreluna</div>
            <h2>Una serata non comincia dal tavolo.</h2>
            <p>Comincia dall’atmosfera che stai cercando.</p>
          </div>
          <a className="button velvet-page-button" href="mailto:krelunaid@gmail.com?subject=Velvet%20Table%20-%20voglio%20seguire%20il%20progetto">
            Segui l’evoluzione ↗
          </a>
        </section>
      </main>

      <footer className="velvet-page-footer">
        <Link href="/">Kreluna</Link>
        <span>Velvet Table · concept in sviluppo</span>
        <a href="https://www.kreluna.it/privacy.html">Privacy</a>
      </footer>

      <script
        id="velvet-table-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
