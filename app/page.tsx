"use client";

import { useEffect, useRef, useState } from "react";
import { marketplaceCategories, products, productsForCategory } from "./marketplace-data";

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
      name: "Kreluna | AI, automazione e cybersecurity",
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
        acceptedAnswer: { "@type": "Answer", text: "Kreluna è un progetto italiano in sviluppo dedicato ad AI, automazione e cybersecurity." },
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
  return (
    <div className="mockup-body mockup-velvet" role="img" aria-label="Velvet Table, foto originale del progetto">
      <span className="mchip">Tavolo confermato</span>
    </div>
  );
}

function ProductMockup({ variant, domain }: { variant: string; domain: string }) {
  return (
    <div className="mockup-window">
      <MockupBar domain={domain} />
      <MockupScreen variant={variant} />
    </div>
  );
}

function HeroDevices() {
  return (
    <div className="hero-devices" aria-hidden="true">
      <div className="mockup-window hd-back">
        <MockupBar domain="cra24.kreluna.it" />
        <MockupScreen variant="cyber" />
      </div>
      <div className="mockup-window hd-mid">
        <MockupBar domain="helix.kreluna.it" />
        <MockupScreen variant="helix" />
      </div>
      <div className="mockup-window hd-front">
        <MockupBar domain="kreluna.ai" />
        <MockupScreen variant="ai" />
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
          <a href="#products">Marketplace</a>
          <a href="#vision">Visione</a>
          <a href="#velvet-table">Velvet Table</a>
          <a href="https://www.kreluna.it/azienda.html">Azienda</a>
        </nav>
        <div className="nav-actions">
          <a className="contact-link" href="https://www.kreluna.it/contatti.html">Contatti</a>
          <a className="button button-small button-primary" href="/marketplace">Apri il Marketplace</a>
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
          <a href="#products" onClick={() => setMenuOpen(false)}>Marketplace</a>
          <a href="#vision" onClick={() => setMenuOpen(false)}>Visione</a>
          <a href="#velvet-table" onClick={() => setMenuOpen(false)}>Velvet Table</a>
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
          <div className="eyebrow"><i /> Kreluna · tecnologia che prende forma</div>
          <h1>Creiamo prodotti<br />{" "}per ciò che <em>viene dopo.</em></h1>
          <p>
            Kreluna progetta software e intelligenza artificiale per persone,
            professionisti e imprese. Ogni progetto ha una propria identità.
            Tutti condividono la stessa visione.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/marketplace">Apri il Marketplace <ArrowIcon /></a>
            <a className="button button-secondary" href="#vision">Conosci Kreluna</a>
          </div>
          <div className="hero-capabilities">
            <span>Siti</span>
            <span>App</span>
            <span>Software</span>
            <span>Intelligenza artificiale</span>
          </div>
        </div>

        <HeroDevices />

        <a className="scroll-cue" href="#products">Scopri l’ecosistema <span>↓</span></a>
      </section>

      <section className="statement section-shell" id="vision">
        <h2 className="statement-line reveal">
          <span>Un marchio.</span>
          <strong>Più possibilità.</strong>
        </h2>
        <p className="reveal">
          Kreluna non è soltanto un prodotto. È la casa in cui idee diverse diventano
          esperienze utili, coerenti e riconoscibili.
        </p>
      </section>

      <section className="products section-shell" id="products">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow"><i /> Marketplace Kreluna</div>
            <h2>Un’unica visione.<br />{" "}<em>Progetti diversi.</em></h2>
          </div>
          <p>
            Il Marketplace è la vetrina ufficiale delle app e dei software Kreluna:
            un unico luogo per capire cosa fanno, dove funzionano e come ottenerli.
          </p>
        </div>

        <div className="marketplace-showcase reveal">
          <div className="marketplace-showcase-copy">
            <div className="eyebrow"><i /> Il catalogo Kreluna</div>
            <h3>Tutte le nostre app.<br /><em>Un solo posto.</em></h3>
            <p>
              Scopri prodotti Kreluna realmente disponibili o in sviluppo, confronta le
              funzioni e verifica subito la compatibilità con il tuo dispositivo.
            </p>
            <div className="marketplace-showcase-points" aria-label="Cosa trovi nel Marketplace">
              <span>Prodotti ufficiali</span>
              <span>Compatibilità chiara</span>
              <span>Aggiornamenti Kreluna</span>
            </div>
            <a className="button button-primary" href="/marketplace">Apri il Marketplace <ArrowIcon /></a>
          </div>

          <div className="marketplace-showcase-ui" role="img" aria-label="Anteprima illustrativa del Marketplace Kreluna con ricerca, categorie e prodotti">
            <div className="marketplace-ui-topbar">
              <span className="marketplace-ui-brand"><i>K</i> KRELUNA <small>MARKETPLACE</small></span>
              <span className="marketplace-ui-window-dots"><i /><i /><i /></span>
            </div>
            <div className="marketplace-ui-body">
              <div className="marketplace-ui-search">
                <span>⌕</span>
                <p>Cerca app, software o funzioni</p>
                <small>Catalogo</small>
              </div>
              <div className="marketplace-ui-filters">
                <span className="active">Tutto</span>
                <span>Musica e audio</span>
                <span>AI e lavoro</span>
                <span>Esperienze</span>
              </div>
              <div className="marketplace-ui-content">
                <div className="marketplace-ui-featured">
                  <div className="marketplace-ui-featured-copy">
                    <small>IN EVIDENZA</small>
                    <strong>Risonix</strong>
                    <p>Riconoscimento musicale locale per Windows e Mac.</p>
                    <span>Scopri il prodotto ↗</span>
                  </div>
                  <div className="marketplace-ui-wave" aria-hidden="true">
                    <i /><i /><i /><i /><i /><i /><i /><i /><i />
                  </div>
                </div>
                <div className="marketplace-ui-side">
                  <div className="marketplace-ui-mini helix-mini"><small>SVILUPPO AI</small><strong>Helix</strong><span>Web</span></div>
                  <div className="marketplace-ui-mini velvet-mini"><small>ESPERIENZE</small><strong>Velvet Table</strong><span>Web</span></div>
                </div>
              </div>
              <div className="marketplace-ui-platforms">
                <p>Disponibilità indicata per ogni prodotto</p>
                <span>⊞ Windows</span><span>● macOS</span><span>◎ Web</span>
              </div>
            </div>
            <p className="marketplace-ui-caption">Anteprima illustrativa · il catalogo reale si apre dal pulsante</p>
          </div>
        </div>

        <nav className="marketplace-categories reveal" aria-label="Categorie del marketplace">
          {marketplaceCategories.map((category, index) => <a href={`#category-${category.id}`} key={category.id}><span>{String(index + 1).padStart(2, "0")}</span>{category.name}</a>)}
        </nav>

        <div className="marketplace-groups">
          {marketplaceCategories.map((category) => (
            <section className="marketplace-group" id={`category-${category.id}`} key={category.id}>
              <header className="marketplace-group-heading reveal">
                <div><span>Categoria</span><h3>{category.name}</h3></div>
                <p>{category.description}</p>
              </header>
              <div className={`product-grid ${category.id === "music-audio" ? "product-grid-featured" : ""}`}>
                {productsForCategory(category.id).map((product) => {
                  const index = products.indexOf(product);
                  return <article id={`product-${product.slug}`} className={`product-card ${product.color} reveal`} key={product.slug} style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}>
                    <div className="card-topline">
                      <span>{product.eyebrow}</span>
                      <span className="status"><i /> {product.status}</span>
                    </div>
                    <div className="product-visual">
                      <div className="mini-grid" aria-hidden="true" />
                      <span className="product-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <ProductMockup variant={product.mockup} domain={product.domain} />
                    </div>
                    <div className="card-copy">
                      <p className="signature">Kreluna marketplace</p>
                      <h3>{product.name}</h3>
                      <h4>{product.tagline}</h4>
                      <p>{product.description}</p>
                      <div className="feature-list">
                        {product.features.map((feature) => <span key={feature}>{feature}</span>)}
                      </div>
                    </div>
                    <a href={product.href} className="card-link" aria-label={`Scopri ${product.name}`}>
                      Scopri {product.name} <ArrowIcon />
                    </a>
                  </article>;
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="future-card reveal">
          <div className="future-mark">＋</div>
          <div>
            <div className="eyebrow"><i /> Il prossimo progetto</div>
            <h3>Lo spazio è già pronto.</h3>
            <p>Nome, identità e racconto: quando nasce una nuova idea Kreluna, il sito cresce senza ricominciare da zero.</p>
          </div>
        </div>
      </section>

      <section className="velvet-table section-shell" id="velvet-table">
        <div className="velvet-panel reveal">
          <div className="velvet-copy">
            <div className="eyebrow velvet-text"><i /> Velvet Table · concept in sviluppo</div>
            <h2>Prima scegli l’atmosfera.<br /><em>Poi il tavolo.</em></h2>
            <p>
              Velvet Table nasce per trasformare la prenotazione in una scelta di esperienza.
              L’idea è descrivere come vuoi vivere la serata — intima, vivace, elegante,
              panoramica o rilassata — e trovare locali coerenti con quel momento.
            </p>
            <p>
              Cucina, zona, budget, orario e disponibilità restano importanti, ma arrivano
              dentro un contesto più umano: con chi sei, che occasione è e quale atmosfera cerchi.
            </p>
            <div className="velvet-moods" aria-label="Esempi di atmosfera">
              <span>Intima</span>
              <span>Vivace</span>
              <span>Panoramica</span>
              <span>Rilassata</span>
            </div>
            <a className="button button-secondary velvet-cta" href="/velvet-table">
              Scopri il concept <ArrowIcon />
            </a>
          </div>
          <ol className="velvet-journey" aria-label="Come funzionerebbe Velvet Table">
            <li><span>01</span><div><strong>Racconta la serata</strong><p>Atmosfera, occasione, compagnia e preferenze essenziali.</p></div></li>
            <li><span>02</span><div><strong>Scopri i locali in sintonia</strong><p>Una selezione breve, con il motivo per cui ogni proposta è adatta.</p></div></li>
            <li><span>03</span><div><strong>Passa alla prenotazione</strong><p>Disponibilità e conferma del tavolo dopo aver scelto l’esperienza.</p></div></li>
          </ol>
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
        <a className="button button-primary" href="/marketplace">Apri il Marketplace <ArrowIcon /></a>
      </section>
      </main>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>Tecnologia e intelligenza artificiale per ciò che viene dopo.</p>
          </div>
          <div className="footer-column">
            <p className="footer-heading">Marketplace</p>
            <a href="/marketplace">Tutti i prodotti</a>
            {products.slice(0, 4).map((product) => <a key={product.slug} href={product.href}>{product.name}</a>)}
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
