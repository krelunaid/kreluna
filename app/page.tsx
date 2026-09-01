"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "./marketplace-data";

const visibleProducts = products.filter((product) =>
  ["velvet-table", "citybeam"].includes(product.slug),
);

const assetBasePath = process.env.NEXT_PUBLIC_ARUBA_BASE_PATH ?? "";
const homeSiteUrl = "https://www.kreluna.it";
const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${homeSiteUrl}/#organization`,
      name: "Kreluna",
      alternateName: "Kreluna Ecosystem",
      taxID: "02114130475",
      identifier: { "@type": "PropertyValue", propertyID: "REA", value: "PT-622714" },
      url: `${homeSiteUrl}/`,
      logo: { "@type": "ImageObject", url: `${homeSiteUrl}/kreluna-logo.png`, width: 128, height: 128 },
    },
    {
      "@type": "WebSite",
      "@id": `${homeSiteUrl}/#website`,
      url: `${homeSiteUrl}/`,
      name: "Kreluna",
      publisher: { "@id": `${homeSiteUrl}/#organization` },
      inLanguage: ["it-IT", "en-GB"],
    },
    {
      "@type": "WebPage",
      "@id": `${homeSiteUrl}/#webpage`,
      url: `${homeSiteUrl}/`,
      name: "Kreluna | Software, automazione e progetti digitali",
      isPartOf: { "@id": `${homeSiteUrl}/#website` },
      about: { "@id": `${homeSiteUrl}/#organization` },
      inLanguage: "it-IT",
    },
    {
      "@type": "FAQPage",
      "@id": `${homeSiteUrl}/#faq`,
      mainEntity: [{
        "@type": "Question",
        name: "Che cos’è Kreluna?",
        acceptedAnswer: { "@type": "Answer", text: "Kreluna è uno studio tecnologico italiano che realizza software, automazioni e progetti digitali, con attenzione al controllo umano e alla chiarezza." },
      }],
    },
  ],
};

const principles = [
  ["01", "Una visione comune", "Ogni prodotto nasce per risolvere un problema reale e condivide la stessa cura Kreluna."],
  ["02", "Identità propria", "Ogni progetto può avere colori, voce e movimento propri senza perdere la firma della casa madre."],
  ["03", "Crescita naturale", "Un nuovo progetto si aggiunge all'ecosistema senza dover ripensare ogni volta l'intero sito."],
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function MockupBar({ domain }: { domain: string }) {
  return (
    <div className="mockup-bar">
      <i /><i /><i />
      <span>{domain}</span>
    </div>
  );
}

function MockupScreen({ variant }: { variant: string }) {
  if (variant === "ai") {
    return (
      <div className="mockup-body mockup-ai">
        <div className="bubble"><span className="mline" /><span className="mline" /></div>
        <div className="bubble user"><span className="mline" /></div>
        <div className="bubble"><span className="mline" /><span className="typing"><i /><i /><i /></span></div>
      </div>
    );
  }
  if (variant === "office") {
    return (
      <div className="mockup-body mockup-office">
        <div className="mrow"><span className="mdot filled" /><span className="mline" style={{ width: "72%" }} /></div>
        <div className="mrow"><span className="mdot" /><span className="mline soft" style={{ width: "58%" }} /></div>
        <div className="mrow"><span className="mdot filled" /><span className="mline" style={{ width: "80%" }} /></div>
        <div className="mrow"><span className="mdot" /><span className="mline soft" style={{ width: "45%" }} /></div>
      </div>
    );
  }
  if (variant === "cyber") {
    return (
      <div className="mockup-body mockup-cyber">
        <div className="radar"><span className="sweep" /></div>
        <div className="chips"><span className="mchip">OK</span><span className="mchip">OK</span><span className="mchip">···</span></div>
      </div>
    );
  }
  if (variant === "helix") {
    return (
      <div className="mockup-body mockup-helix">
        <div className="code">
          <span className="mline" style={{ "--w": "40%" } as React.CSSProperties} />
          <span className="mline" style={{ "--w": "72%" } as React.CSSProperties} />
          <span className="mline" style={{ "--w": "55%" } as React.CSSProperties} />
          <span className="mline" style={{ "--w": "65%" } as React.CSSProperties} />
        </div>
        <div className="preview"><div className="p-bar" /><div className="p-body"><span className="mline" /><span className="mline" style={{ width: "70%" }} /></div></div>
      </div>
    );
  }
  if (variant === "risonix") {
    return (
      <div className="mockup-body mockup-risonix" role="img" aria-label="Risonix, riconoscimento musicale">
        <div className="risonix-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="risonix-match"><strong>98</strong><span>% MATCH</span><small>CANZONE TROVATA</small></div>
      </div>
    );
  }
  if (variant === "citybeam") {
    return (
      <div className="mockup-body mockup-citybeam" role="img" aria-label="CityBeam, anteprima concettuale di maxi-schermi urbani">
        <span className="mchip">PRE-LANCIO</span>
      </div>
    );
  }
  if (variant === "projects") {
    return (
      <div className="mockup-body mockup-projects" role="img" aria-label="Progetti pubblici Kreluna">
        <div><span>CityBeam</span><i>PRE-LANCIO</i></div>
        <div><span>Velvet Table</span><i>CONCEPT</i></div>
      </div>
    );
  }
  return (
    <div className="mockup-body mockup-velvet" role="img" aria-label="Velvet Table, foto originale del progetto">
      <span className="mchip">Tavolo confermato</span>
    </div>
  );
}

function HeroDevices() {
  return (
    <div className="hero-devices" aria-hidden="true">
      <div className="mockup-window hd-back">
        <MockupBar domain="kreluna.it/citybeam" />
        <MockupScreen variant="citybeam" />
      </div>
      <div className="mockup-window hd-mid">
        <MockupBar domain="kreluna.it/velvet-table" />
        <MockupScreen variant="velvet" />
      </div>
      <div className="mockup-window hd-front">
        <MockupBar domain="kreluna.it/progetti" />
        <MockupScreen variant="projects" />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Kreluna, torna all'inizio">
      {/* The logo is a tiny local decorative asset with fixed intrinsic dimensions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${assetBasePath}/kreluna-logo.png`} alt="" width="128" height="128" decoding="async" />
      <span>KRELUNA</span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <div
      id="top"
      style={{ "--sphere-image": `url('${assetBasePath}/kreluna-sphere.jpg')` } as React.CSSProperties}
    >
      <script id="kreluna-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }} />
      <a className="skip-link" href="#main-content">Vai al contenuto</a>
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Navigazione principale">
          <a href="#come-lavoriamo">Cosa facciamo</a>
          <a href="/progetti">Progetti</a>
          <a href="/citybeam">CityBeam</a>
          <a href="https://www.kreluna.it/azienda.html">Azienda</a>
        </nav>
        <div className="nav-actions">
          <a className="contact-link" href="https://www.kreluna.it/contatti.html">Contatti</a>
          <a className="button button-small button-primary" href="https://www.kreluna.it/contatti.html">Parliamone</a>
          <button
            ref={menuButtonRef}
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Apri il menu"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </header>

      {menuOpen && (
        <div id="mobile-navigation" className="mobile-menu open" role="dialog" aria-modal="true" aria-label="Navigazione mobile">
          <button
            onClick={() => {
              setMenuOpen(false);
              window.requestAnimationFrame(() => menuButtonRef.current?.focus());
            }}
            aria-label="Chiudi il menu"
          >×</button>
          <a href="#come-lavoriamo" onClick={() => setMenuOpen(false)}>Cosa facciamo</a>
          <a href="/progetti" onClick={() => setMenuOpen(false)}>Progetti</a>
          <a href="/citybeam" onClick={() => setMenuOpen(false)}>CityBeam</a>
          <a href="https://www.kreluna.it/azienda.html">Azienda</a>
          <a href="https://www.kreluna.it/contatti.html">Contatti</a>
        </div>
      )}

      <main id="main-content">

      <section className="hero section-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="cosmic-grid" />
        <div className="spark spark-one" aria-hidden="true">✦</div>
        <div className="spark spark-two" aria-hidden="true">✦</div>
        <div className="hero-copy reveal visible">
          <div className="eyebrow"><i /> Kreluna · software, automazione e AI</div>
          <h1>Tecnologia utile.<br />{" "}<em>Progetti che prendono forma.</em></h1>
          <p>
            Aiutiamo imprese e professionisti a trasformare processi e idee in strumenti
            digitali concreti. In parallelo sviluppiamo prodotti originali, come CityBeam.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/citybeam">Scopri CityBeam <ArrowIcon /></a>
            <a className="button button-secondary" href="#come-lavoriamo">Cosa facciamo</a>
          </div>
          <div className="hero-capabilities">
            <span>Siti</span>
            <span>App</span>
            <span>Software</span>
            <span>Intelligenza artificiale</span>
          </div>
        </div>

        <HeroDevices />

        <a className="scroll-cue" href="#products">Il progetto del momento <span>↓</span></a>
      </section>

      <section className="statement section-shell" id="vision">
        <h2 className="statement-line reveal">
          <span>Un partner tecnologico.</span>
          <strong>Più chiarezza, meno complessità.</strong>
        </h2>
        <p className="reveal">
          Partiamo da un bisogno reale, definiamo cosa deve funzionare e costruiamo
          soltanto ciò che serve. Ogni progetto resta comprensibile, verificabile e umano.
        </p>
      </section>

      <section className="featured-projects section-shell" id="products">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow"><i /> Il progetto del momento</div>
            <h2>CityBeam.<br /><em>Dal mondo allo schermo.</em></h2>
          </div>
          <p>
            Stiamo costruendo un accesso europeo agli schermi digitali più iconici,
            partendo da Times Square e da relazioni dirette con operatori autorizzati.
          </p>
        </div>

        <article className="citybeam-feature reveal">
          <div className="citybeam-feature-copy">
            <span className="project-state"><i /> Pre-lancio</span>
            <h3>Il tuo momento sui grandi schermi del mondo.</h3>
            <p>
              Un percorso più semplice per aziende, creator e persone: richiesta,
              approvazione del contenuto, pubblicazione e prova della messa in onda.
            </p>
            <div className="citybeam-feature-actions">
              <a className="button button-primary" href="/citybeam">Scopri CityBeam <ArrowIcon /></a>
              <a className="button button-secondary" href="https://www.kreluna.it/contatti.html">Parla con noi</a>
            </div>
          </div>
          <div className="citybeam-feature-place"><span>Prima destinazione prevista</span><strong>Times Square · New York</strong></div>
        </article>

        <div className="projects-secondary reveal">
          <article className="velvet-project-card">
            <div><span className="project-state"><i /> Concept in sviluppo</span><h3>Velvet Table</h3><p>Prenota l’atmosfera, non soltanto il tavolo.</p></div>
            <a href="/velvet-table">Scopri il concept <ArrowIcon /></a>
          </article>
          <div className="projects-index-card">
            <span>Archivio in crescita</span>
            <h3>Ogni progetto ha il suo spazio.</h3>
            <p>La homepage mostra solo ciò che conta adesso. La pagina Progetti è pronta a crescere senza diventare confusa.</p>
            <a href="/progetti">Vedi tutti i progetti <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="editorial-home section-shell" id="come-lavoriamo">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow"><i /> Dal problema al progetto</div>
            <h2>Tecnologia applicata<br />al <em>lavoro reale.</em></h2>
          </div>
          <p>
            Kreluna parte da un processo osservabile, dalle informazioni autorizzate e da una
            persona responsabile del risultato. Le applicazioni qui descritte sono casi d’uso da
            valutare: disponibilità e integrazioni vengono confermate solo sul perimetro concreto.
          </p>
        </div>
        <div className="editorial-home-grid">
          <article className="editorial-home-card reveal">
            <span>AI · Aziende</span>
            <h3>Conoscenza e attività operative</h3>
            <p>
              Ricerca su procedure approvate, preparazione di brief, classificazione di documenti
              e supporto alle richieste interne. Fonti, permessi ed escalation devono essere
              definiti prima di collegare CRM, ERP, posta o archivi.
            </p>
            <a href="https://www.kreluna.it/intelligenza-artificiale-aziende.html">AI per aziende <ArrowIcon /></a>
          </article>
          <article className="editorial-home-card reveal">
            <span>AI · Professionisti</span>
            <h3>Pratiche, fascicoli e approvazioni</h3>
            <p>
              Documenti, email e scadenze possono essere preparati in un flusso più leggibile.
              Pareri, atti, comunicazioni e decisioni restano al professionista, con separazione
              tra clienti e fonti verificabili.
            </p>
            <a href="https://www.kreluna.it/ai-studi-professionali.html">AI per studi professionali <ArrowIcon /></a>
          </article>
          <article className="editorial-home-card reveal">
            <span>Workflow</span>
            <h3>Automazione con gestione delle eccezioni</h3>
            <p>
              Un’automazione utile coordina ingresso, regole, responsabilità e casi fuori
              standard. Prima del pilota vengono definiti baseline, arresto sicuro, approvazioni
              e costo di gestione, non soltanto il tempo che si spera di risparmiare.
            </p>
            <a href="https://www.kreluna.it/automazione-processi-aziendali.html">Automazione dei processi <ArrowIcon /></a>
          </article>
          <article className="editorial-home-card reveal">
            <span>Cybersecurity</span>
            <h3>Rischi comprensibili e priorità pratiche</h3>
            <p>
              Identità, vulnerabilità, email, backup e risposta agli incidenti richiedono un
              perimetro autorizzato. Un rapporto tecnico aiuta a decidere, ma non viene presentato
              come certificazione o monitoraggio continuo se non espressamente concordato.
            </p>
            <a href="https://www.kreluna.it/cybersecurity-pmi-studi-professionali.html">Cybersecurity per PMI <ArrowIcon /></a>
          </article>
        </div>
      </section>

      <section className="editorial-method section-shell">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow"><i /> Un percorso verificabile</div>
            <h2>Prima il perimetro.<br /><em>Poi la tecnologia.</em></h2>
          </div>
          <p>
            Il metodo evita promesse astratte: un progetto procede solo quando obiettivo, dati,
            responsabilità e criteri di accettazione sono abbastanza chiari da poter essere testati.
          </p>
        </div>
        <ol className="home-steps">
          <li className="reveal"><span>01</span><div><h3>Descrivere il lavoro</h3><p>Ingresso, persone, sistemi, attese, eccezioni e risultato atteso vengono messi sulla stessa mappa.</p></div></li>
          <li className="reveal"><span>02</span><div><h3>Definire i confini</h3><p>Fonti consentite, azioni vietate, permessi, approvazioni e condizioni di arresto diventano espliciti.</p></div></li>
          <li className="reveal"><span>03</span><div><h3>Provare su scala ridotta</h3><p>Il pilota usa dati sintetici, minimizzati o autorizzati e criteri stabiliti prima della prova.</p></div></li>
          <li className="reveal"><span>04</span><div><h3>Misurare e decidere</h3><p>Tempo, qualità, rilavorazioni ed eccezioni vengono confrontati con la situazione iniziale.</p></div></li>
        </ol>
      </section>

      <section className="editorial-trust section-shell">
        <div className="trust-panel reveal">
          <div>
            <div className="eyebrow"><i /> Dati, AI Act e GDPR</div>
            <h2>Controllo umano non è una frase decorativa.</h2>
            <p>
              Significa assegnare una persona al risultato, limitare gli accessi, mostrare le
              fonti quando servono e impedire al sistema di eseguire azioni importanti senza il
              passaggio previsto. Fornitore, conservazione, subprocessori e trasferimenti devono
              essere valutati sulla configurazione effettiva.
            </p>
            <p>
              AI Act e GDPR dipendono da ruolo, dati e utilizzo concreto. Kreluna non dichiara una
              conformità automatica e non sostituisce la valutazione di professionisti legali,
              privacy o di sicurezza.
            </p>
            <div className="trust-links">
              <a href="https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=it">AI Act — testo ufficiale</a>
              <a href="https://www.edpb.europa.eu/sme/be-compliant/be-compliant_en">EDPB — guida per PMI</a>
              <a href="https://www.nist.gov/itl/ai-risk-management-framework">NIST AI RMF</a>
            </div>
          </div>
          <div className="home-faq">
            <h3>Domande frequenti</h3>
            <details><summary>Che cos’è Kreluna?</summary><p>Kreluna è un ecosistema digitale italiano dedicato ad AI, automazione, cybersecurity ed esperienze digitali.</p></details>
            <details><summary>I prodotti sono già acquistabili?</summary><p>Non viene dichiarata una disponibilità generale. Accesso, funzioni, integrazioni e condizioni vengono confermati per ogni richiesta.</p></details>
            <details><summary>Kreluna sostituisce software o professionisti?</summary><p>No in modo automatico. Il ruolo proposto è preparare e collegare il lavoro mantenendo sistemi ufficiali, responsabilità e approvazioni sotto controllo umano.</p></details>
            <details><summary>Posso inviare documenti per una valutazione?</summary><p>Nel primo contatto no: descrivi il contesto senza allegare dati personali, credenziali o documenti riservati. Un eventuale campione viene concordato dopo aver definito il perimetro.</p></details>
          </div>
        </div>
      </section>

      <section className="resources-home section-shell reveal">
        <div>
          <div className="eyebrow"><i /> Kreluna Risorse</div>
          <h2>Guide per decidere prima di acquistare.</h2>
          <p>
            Protezione dei dati riservati, scelta del primo processo da automatizzare e controlli
            essenziali contro phishing e ransomware: contenuti pratici con fonti istituzionali.
          </p>
        </div>
        <a className="button button-secondary" href="https://www.kreluna.it/risorse.html">Esplora le guide <ArrowIcon /></a>
      </section>

      <section className="principles section-shell">
        <div className="section-heading compact reveal">
          <div>
            <div className="eyebrow"><i /> Il modo Kreluna</div>
            <h2>Una firma che<br />{" "}<em>si riconosce.</em></h2>
          </div>
        </div>
        <div className="principles-grid">
          {principles.map(([number, title, text]) => (
            <article className="principle reveal" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing section-shell reveal">
        <div className="closing-orb" aria-hidden="true" />
        <div className="eyebrow"><i /> Kreluna</div>
        <h2>Questo è solo<br />{" "}<em>l’inizio.</em></h2>
        <p>Scopri ciò che stiamo costruendo e segui l’evoluzione dell’ecosistema.</p>
        <a className="button button-primary" href="https://www.kreluna.it/contatti.html">Parliamone <ArrowIcon /></a>
      </section>
      </main>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>Software, automazione e progetti digitali costruiti con chiarezza.</p>
          </div>
          <div className="footer-column">
            <p className="footer-heading">Progetti</p>
            <a href="/progetti">Tutti i progetti</a>
            {visibleProducts.map((product) => <a key={product.slug} href={product.href}>{product.name}</a>)}
          </div>
          <div className="footer-column">
            <p className="footer-heading">Kreluna</p>
            <a href="https://www.kreluna.it/azienda.html">Azienda</a>
            <a href="https://www.kreluna.it/risorse.html">Risorse</a>
            <a href="https://www.kreluna.it/contatti.html">Contatti</a>
            <a href="https://www.kreluna.it/en/" hrefLang="en" lang="en">English</a>
          </div>
          <div className="footer-column">
            <p className="footer-heading">Legale</p>
            <a href="https://www.kreluna.it/privacy.html">Privacy</a>
            <a href="https://www.kreluna.it/termini.html">Termini</a>
            <a href="https://www.kreluna.it/cookie.html">Cookie</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Kreluna</span>
          <span>P. IVA 02114130475 · REA PT-622714</span>
        </div>
      </footer>

    </div>
  );
}
