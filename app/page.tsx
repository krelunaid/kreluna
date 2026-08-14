"use client";

import { useEffect, useRef, useState } from "react";

const assetBasePath = process.env.NEXT_PUBLIC_ARUBA_BASE_PATH ?? "";
const storePresentationUrl = `${assetBasePath}/store/`;

const products = [
  {
    slug: "kreluna-ai",
    name: "Kreluna AI",
    eyebrow: "Intelligenza artificiale",
    tagline: "Pensa con te, ogni giorno.",
    description:
      "Non solo risposte. Ragionamento adattivo, ricerca, scrittura e pianificazione in un'esperienza naturale.",
    color: "violet",
    status: "In sviluppo",
    href: "https://www.kreluna.it/intelligenza-artificiale-aziende.html",
    features: ["Ragionamento adattivo", "Ricerca e analisi", "Scrittura e studio"],
  },
  {
    slug: "office",
    name: "Kreluna Office",
    eyebrow: "Per professionisti",
    tagline: "Il dipendente digitale del tuo studio.",
    description:
      "Organizza documenti, clienti, pratiche e scadenze. Prepara il lavoro e lascia a te il controllo delle azioni importanti.",
    color: "gold",
    status: "In sviluppo",
    href: "https://www.kreluna.it/ai-studi-professionali.html",
    features: ["Document intelligence", "Pratiche e scadenze", "Approval center"],
  },
  {
    slug: "cyber",
    name: "Kreluna Cyber",
    eyebrow: "Sicurezza informatica",
    tagline: "Intelligence that protects.",
    description:
      "Strumenti dedicati a security assessment, gestione delle vulnerabilità, workflow degli incidenti e conformità tecnica.",
    color: "cyan",
    status: "In sviluppo",
    href: "https://cra24.kreluna.it/",
    features: ["Security assessment", "Vulnerability management", "Compliance tecnica"],
  },
  {
    slug: "likecash",
    name: "LikeCash",
    eyebrow: "Nuovo progetto · by Kreluna",
    tagline: "Un nuovo progetto sta prendendo forma.",
    description:
      "LikeCash è il nuovo progetto firmato Kreluna. Identità, funzioni e disponibilità saranno raccontate qui, man mano che prendono forma.",
    color: "coral",
    status: "Dettagli in arrivo",
    href: "#likecash",
    features: ["by Kreluna", "In progettazione", "Aggiornamenti in arrivo"],
  },
  {
    slug: "krl",
    name: "Kreluna Token",
    eyebrow: "Utility demo · KRL Beta",
    tagline: "L’utilità si simula nella Beta.",
    description:
      "KRL Beta simula crediti AI e prepara il wallet per Base Sepolia. Nessun valore reale e nessuna vendita.",
    color: "mint",
    status: "Beta · Testnet",
    href: `${assetBasePath}/krl/`,
    features: ["Base Sepolia", "100M progettati", "Vendita disattivata"],
  },
] as const;

const principles = [
  ["01", "Una visione comune", "Ogni prodotto nasce per risolvere un problema reale e condivide la stessa cura Kreluna."],
  ["02", "Identità propria", "Ogni progetto può avere colori, voce e movimento propri senza perdere la firma della casa madre."],
  ["03", "Crescita naturale", "Un nuovo progetto si aggiunge all'ecosistema senza dover ripensare ogni volta l'intero sito."],
];

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.kreluna.it/#webpage",
      url: "https://www.kreluna.it/",
      name: "Kreluna | AI, automazione e cybersecurity",
      description:
        "Kreluna progetta AI, automazione dei processi e cybersecurity intorno al lavoro reale, con controllo umano, dati protetti e limiti dichiarati.",
      isPartOf: { "@id": "https://www.kreluna.it/#website" },
      about: { "@id": "https://www.kreluna.it/#organization" },
      inLanguage: "it-IT",
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.kreluna.it/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Che cos’è Kreluna?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kreluna è un progetto italiano in sviluppo dedicato ad AI, automazione e cybersecurity. I dati societari e fiscali saranno pubblicati quando disponibili.",
          },
        },
        {
          "@type": "Question",
          name: "I prodotti Kreluna sono già acquistabili?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non viene dichiarata una disponibilità generale. Accesso, funzioni, integrazioni e condizioni vengono confermati per ogni richiesta.",
          },
        },
        {
          "@type": "Question",
          name: "Kreluna sostituisce software o professionisti?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No in modo automatico. Il ruolo proposto è preparare e collegare il lavoro mantenendo sistemi ufficiali, responsabilità e approvazioni sotto controllo umano.",
          },
        },
        {
          "@type": "Question",
          name: "Posso inviare documenti per una valutazione?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nel primo contatto no. È sufficiente descrivere il contesto senza allegare dati personali, credenziali o documenti riservati.",
          },
        },
      ],
    },
  ],
};

const ecosystemQuickCards = [
  {
    name: "Kreluna AI",
    description: "Intelligenza artificiale progettata intorno al lavoro reale.",
    symbol: "✦",
    tone: "violet",
    href: "https://www.kreluna.it/intelligenza-artificiale-aziende.html",
  },
  {
    name: "Kreluna Office",
    description: "Strumenti professionali per organizzare attività e documenti.",
    symbol: "▰",
    tone: "green",
    href: "https://www.kreluna.it/ai-studi-professionali.html",
  },
  {
    name: "Kreluna Cyber",
    description: "Percorsi e strumenti dedicati alla sicurezza informatica.",
    symbol: "◇",
    tone: "blue",
    href: "https://cra24.kreluna.it/",
  },
  {
    name: "Kreluna Connect",
    description: "Un punto di contatto per collegare esigenze e progetti.",
    symbol: "↗",
    tone: "orange",
    href: "https://www.kreluna.it/contatti.html",
  },
  {
    name: "Kreluna Store",
    description: "Concept di app e strumenti organizzati per bisogno.",
    symbol: "▢",
    tone: "rose",
    href: storePresentationUrl,
  },
] as const;

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
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

function StoreBagMark() {
  return <span className="store-bag-mark" aria-hidden="true"><b>K</b></span>;
}

function EcosystemShowcase() {
  return (
    <section className="ecosystem-showcase reveal" aria-labelledby="ecosystem-showcase-title">
      <div className="ecosystem-showcase-hero">
        <div className="ecosystem-showcase-copy">
          <p className="ecosystem-kicker">Kreluna · un unico ecosistema</p>
          <h2 id="ecosystem-showcase-title">
            Un ecosistema.<br />
            <span>Tutto quello che ti serve.</span>
          </h2>
          <p>
            Kreluna riunisce app, software, servizi e intelligenza artificiale per
            semplificare attività quotidiane e far crescere il lavoro.
          </p>
          <div className="ecosystem-showcase-actions">
            <a className="ecosystem-primary-action" href={storePresentationUrl}>Scopri Kreluna Store <span aria-hidden="true">→</span></a>
            <a className="ecosystem-secondary-action" href="#products">Esplora l’ecosistema <span aria-hidden="true">▶</span></a>
          </div>
        </div>

        <div className="ecosystem-universe" aria-hidden="true">
          <div className="ecosystem-planet" />
          <div className="ecosystem-planet-glow" />
          <div className="ecosystem-universe-label">
            <strong>K R E L U N A</strong>
            <small>Tutto. In un unico universo.</small>
          </div>
        </div>

        <a className="ecosystem-store-feature" href={storePresentationUrl} aria-label="Scopri la presentazione di Kreluna Store">
          <span className="ecosystem-store-feature-copy">
            <strong>Kreluna Store</strong>
            <span>Scopri la visione dello Store e raggiungi il catalogo completo.</span>
            <b>Apri la presentazione <span aria-hidden="true">→</span></b>
          </span>
          <StoreBagMark />
        </a>
      </div>

      <div className="ecosystem-quick-grid" aria-label="Prodotti dell’ecosistema Kreluna">
        {ecosystemQuickCards.map((item) => (
          <a className={`ecosystem-quick-card ${item.tone}`} href={item.href} key={item.name}>
            <span className="ecosystem-quick-icon" aria-hidden="true">{item.symbol}</span>
            <strong>{item.name}</strong>
            <span>{item.description}</span>
            <b>Scopri di più <span aria-hidden="true">→</span></b>
          </a>
        ))}
        <aside className="ecosystem-status-cell" aria-label="Percorso verso Kreluna Store">
          <strong>Due spazi distinti</strong>
          <span><i aria-hidden="true" /> Presentazione sul sito Kreluna</span>
          <span><i aria-hidden="true" /> Catalogo chiaro separato</span>
          <span><i aria-hidden="true" /> Passaggio sempre esplicito</span>
          <span><i aria-hidden="true" /> Un unico percorso</span>
        </aside>
      </div>

      <div className="ecosystem-presentation-bridge">
        <div>
          <p className="ecosystem-kicker">Kreluna Store · Presentazione</p>
          <h3>Scopri la visione. Poi apri il catalogo.</h3>
          <p>
            La presentazione dark vive nel sito Kreluna. Il catalogo completo,
            con la sua interfaccia chiara, resta in uno spazio dedicato.
          </p>
        </div>
        <div className="ecosystem-presentation-route" aria-label="Percorso verso Kreluna Store">
          <span><b>01</b><strong>Presentazione</strong><small>Qui, nel sito Kreluna</small></span>
          <i aria-hidden="true">→</i>
          <span><b>02</b><strong>Catalogo</strong><small>Nello Store chiaro dedicato</small></span>
        </div>
        <a className="ecosystem-primary-action" href={storePresentationUrl}>
          Apri la presentazione <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = window.localStorage.getItem("kreluna-cookie-choice");
    } catch {
      // The page remains usable when browser storage is unavailable.
    }
    const cookieTimer = !seen
      ? window.setTimeout(() => setCookieVisible(true), 0)
      : undefined;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      if (cookieTimer !== undefined) window.clearTimeout(cookieTimer);
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

  const chooseCookies = (choice: string) => {
    try {
      window.localStorage.setItem("kreluna-cookie-choice", choice);
    } catch {
      // Closing the banner does not depend on local storage.
    }
    setCookieVisible(false);
  };

  return (
    <div
      id="top"
      style={{ "--sphere-image": `url('${assetBasePath}/kreluna-sphere.jpg')` } as React.CSSProperties}
    >
      <a className="skip-link" href="#main-content">Vai al contenuto</a>
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Navigazione principale">
          <a href="https://www.kreluna.it/intelligenza-artificiale-aziende.html">AI</a>
          <a href="https://www.kreluna.it/ai-studi-professionali.html">Office</a>
          <a href="https://cra24.kreluna.it/">Cyber</a>
          <a href="https://www.kreluna.it/contatti.html">Connect</a>
          <a href={storePresentationUrl}>Store</a>
        </nav>
        <div className="nav-actions">
          <a className="contact-link" href="https://www.kreluna.it/contatti.html">Contatti</a>
          <a className="button button-small button-primary" href="#products">Esplora</a>
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
          <a href="https://www.kreluna.it/intelligenza-artificiale-aziende.html" onClick={() => setMenuOpen(false)}>AI</a>
          <a href="https://www.kreluna.it/ai-studi-professionali.html" onClick={() => setMenuOpen(false)}>Office</a>
          <a href="https://cra24.kreluna.it/" onClick={() => setMenuOpen(false)}>Cyber</a>
          <a href="https://www.kreluna.it/contatti.html" onClick={() => setMenuOpen(false)}>Connect</a>
          <a href={storePresentationUrl} onClick={() => setMenuOpen(false)}>Store</a>
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
            <a className="button button-primary" href="#products">Esplora i progetti <ArrowIcon /></a>
            <a className="button button-secondary" href="#vision">Conosci Kreluna</a>
          </div>
        </div>

        <div className="orbit-system" aria-hidden="true">
          <div className="orbit orbit-one"><i className="satellite violet" /></div>
          <div className="orbit orbit-two"><i className="satellite gold" /></div>
          <div className="orbit orbit-three"><i className="satellite cyan" /></div>
          <div className="orbit orbit-four"><i className="satellite coral" /></div>
          <div className="orbit orbit-five"><i className="satellite mint hero-mint" /></div>
          <div className="hero-sphere" />
        </div>

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

      <div className="section-shell">
        <EcosystemShowcase />
      </div>

      <section className="products section-shell" id="products">
        <div className="section-heading reveal">
          <div>
            <div className="eyebrow"><i /> L’ecosistema Kreluna</div>
            <h2>Un’unica visione.<br />{" "}<em>Progetti diversi.</em></h2>
          </div>
          <p>
            Dall’intelligenza artificiale al lavoro professionale, dalla sicurezza
            a LikeCash e KRL. Questo spazio è pensato per crescere insieme a Kreluna.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <article className={`product-card ${product.color} reveal`} key={product.slug} style={{ "--delay": `${index * 90}ms` } as React.CSSProperties}>
              <div className="card-topline">
                <span>{product.eyebrow}</span>
                <span className="status"><i /> {product.status}</span>
              </div>
              <div className="product-visual" aria-hidden="true">
                <div className="mini-grid" />
                <div className="product-orbit" />
                <div className="product-orb" />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="card-copy">
                <p className="signature">
                  {product.slug === "likecash" ? "by Kreluna" : product.slug === "krl" ? "KRL · Kreluna ecosystem" : "Kreluna ecosystem"}
                </p>
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
            </article>
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

      <section className="likecash section-shell" id="likecash">
        <div className="likecash-panel reveal">
          <div className="likecash-copy">
            <div className="eyebrow coral-text"><i /> LikeCash · by Kreluna</div>
            <h2>Un nuovo progetto<br />{" "}sta prendendo <em>forma.</em></h2>
            <p>
              LikeCash è un progetto Kreluna in sviluppo. Stiamo definendo esperienza,
              funzionalità e lancio; condivideremo qui informazioni confermate, un passo alla volta.
            </p>
            <span className="development-pill"><i /> In sviluppo · Dettagli in arrivo</span>
          </div>
          <div className="likecash-visual" aria-hidden="true">
            <div className="cash-ring ring-a" />
            <div className="cash-ring ring-b" />
            <div className="cash-orb"><span>LIKE<br />CASH</span></div>
            <div className="cash-glint">✦</div>
          </div>
        </div>
      </section>

      <section className="krl section-shell" id="krl">
        <div className="krl-panel reveal">
          <div className="krl-copy">
            <div className="eyebrow mint-text"><i /> Kreluna Token · KRL</div>
            <h2>La Beta è pronta.<br /><em>Provala senza valore reale.</em></h2>
            <p>
              KRL Beta simula l’aspetto nel wallet e un flusso locale di crediti AI.
              La prova usa Base Sepolia: nessun acquisto, prezzo, rendimento o servizio reale.
            </p>
            <dl className="krl-facts">
              <div><dt>Base Sepolia</dt><dd>Rete di prova</dd></div>
              <div><dt>100 milioni</dt><dd>Fornitura progettata</dd></div>
              <div><dt>Testnet</dt><dd>Nessun valore reale</dd></div>
            </dl>
            <div className="krl-notice">
              <i />
              <p><b>Stato: Beta pubblica.</b> Puoi provare interfaccia, wallet e simulatore AI. Il contratto testnet non è ancora pubblicato e la vendita resta disattivata.</p>
            </div>
            <a className="button button-primary krl-beta-link" href={`${assetBasePath}/krl/`}>Apri KRL Beta <ArrowIcon /></a>
          </div>
          <div className="krl-visual" aria-hidden="true">
            <div className="ledger-grid" />
            <div className="token-ring token-ring-a" />
            <div className="token-ring token-ring-b" />
            <div className="krl-token"><span>KRL</span><small>BY KRELUNA</small></div>
            <span className="chain-label label-base">BASE</span>
            <span className="chain-label label-supply">SUPPLY PROGETTATA</span>
            <span className="chain-label label-dev">IN DEVELOPMENT</span>
          </div>
        </div>
        <p className="krl-disclaimer reveal">
          Solo testnet: KRL Beta non ha valore monetario, non è acquistabile e non attribuisce
          rendimenti o diritti economici. Un eventuale deployment on-chain sarà indicato soltanto con un
          indirizzo Base Sepolia pubblicamente verificabile.
        </p>
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
            <details><summary>Che cos’è Kreluna?</summary><p>Kreluna è un progetto italiano in sviluppo dedicato ad AI, automazione e cybersecurity. I dati societari e fiscali saranno pubblicati quando disponibili.</p></details>
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
        <a className="button button-primary" href="#products">Esplora i progetti <ArrowIcon /></a>
      </section>
      </main>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>Tecnologia e intelligenza artificiale per ciò che viene dopo.</p>
          </div>
          <div className="footer-column">
            <p className="footer-heading">Prodotti</p>
            <a href={storePresentationUrl}>Kreluna Store</a>
            {products.map((product) => <a key={product.slug} href={product.href}>{product.name}</a>)}
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
          <span>© 2026 Kreluna. Tutti i diritti riservati.</span>
          <span>Un marchio. Un ecosistema.</span>
        </div>
      </footer>

      {cookieVisible && (
        <aside className="cookie-banner" aria-label="Preferenze cookie">
          <p>Questo sito usa solo memoria tecnica nel browser per ricordare questa scelta. <a href="https://www.kreluna.it/cookie.html">Scopri di più</a>.</p>
          <div>
            <button onClick={() => chooseCookies("technical")}>Solo tecnici</button>
            <button className="accept" onClick={() => chooseCookies("accepted")}>Va bene</button>
          </div>
        </aside>
      )}
      <script
        id="kreluna-home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
    </div>
  );
}
