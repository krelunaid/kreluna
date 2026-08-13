"use client";

import { useEffect, useState } from "react";

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
    href: "https://www.kreluna.it/cybersecurity-pmi-studi-professionali.html",
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
    eyebrow: "Utility token · KRL",
    tagline: "L'utilità dell'ecosistema, su Base.",
    description:
      "KRL è il modulo token a offerta fissa progettato per un futuro utilizzo nei servizi Kreluna. L'utilità concreta non è ancora attiva né definita.",
    color: "mint",
    status: "Base tecnica pronta",
    href: "#krl",
    features: ["Base · ERC-20", "Offerta fissa", "Vendita non attiva"],
  },
] as const;

const principles = [
  ["01", "Una visione comune", "Ogni prodotto nasce per risolvere un problema reale e condivide la stessa cura Kreluna."],
  ["02", "Identità propria", "Ogni progetto può avere colori, voce e movimento propri senza perdere la firma della casa madre."],
  ["03", "Crescita naturale", "Un nuovo progetto si aggiunge all'ecosistema senza dover ripensare ogni volta l'intero sito."],
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Kreluna, torna all'inizio">
      {/* The logo is a tiny local decorative asset with fixed intrinsic dimensions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kreluna-logo.png" alt="" width="128" height="128" decoding="async" />
      <span>KRELUNA</span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem("kreluna-cookie-choice");
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

  const chooseCookies = (choice: string) => {
    window.localStorage.setItem("kreluna-cookie-choice", choice);
    setCookieVisible(false);
  };

  return (
    <main id="top">
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Navigazione principale">
          <a href="#products">Prodotti</a>
          <a href="#vision">Visione</a>
          <a href="#likecash">LikeCash</a>
          <a href="#krl">KRL</a>
          <a href="https://www.kreluna.it/azienda.html">Azienda</a>
        </nav>
        <div className="nav-actions">
          <a className="contact-link" href="https://www.kreluna.it/contatti.html">Contatti</a>
          <a className="button button-small button-primary" href="#products">Esplora</a>
          <button
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

      <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <button onClick={() => setMenuOpen(false)} aria-label="Chiudi il menu">×</button>
        <a href="#products" onClick={() => setMenuOpen(false)}>Prodotti</a>
        <a href="#vision" onClick={() => setMenuOpen(false)}>Visione</a>
        <a href="#likecash" onClick={() => setMenuOpen(false)}>LikeCash</a>
        <a href="#krl" onClick={() => setMenuOpen(false)}>KRL</a>
        <a href="https://www.kreluna.it/azienda.html">Azienda</a>
        <a href="https://www.kreluna.it/contatti.html">Contatti</a>
      </div>

      <section className="hero section-shell">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="cosmic-grid" />
        <div className="spark spark-one">✦</div>
        <div className="spark spark-two">✦</div>
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
          <div className="orbit orbit-three"><i className="satellite cyan" /><i className="satellite coral" /></div>
          <i className="satellite mint hero-mint" />
          <div className="hero-sphere" />
          <span className="orb-label">Kreluna<br />Core</span>
        </div>

        <a className="scroll-cue" href="#products">Scopri l’ecosistema <span>↓</span></a>
      </section>

      <section className="statement section-shell" id="vision">
        <div className="statement-line reveal">
          <span>Un marchio.</span>
          <strong>Più possibilità.</strong>
        </div>
        <p className="reveal">
          Kreluna non è soltanto un prodotto. È la casa in cui idee diverse diventano
          esperienze utili, coerenti e riconoscibili.
        </p>
      </section>

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
            <h2>L’utilità prende forma.<br />{" "}<em>In modo verificabile.</em></h2>
            <p>
              KRL è il token previsto per l’ecosistema Kreluna: un modulo tecnico
              a offerta fissa progettato per la rete Base e per una futura integrazione
              con servizi come abbonamenti e marketplace.
            </p>
            <div className="krl-facts" aria-label="Caratteristiche di KRL">
              <span><b>Base</b>Rete prevista</span>
              <span><b>1 miliardo</b>Offerta fissa</span>
              <span><b>ERC-20</b>Standard token</span>
            </div>
            <div className="krl-notice">
              <i />
              <p><b>Stato: sviluppo tecnico.</b> La base è verificata localmente, ma KRL non è pubblicato su Base, non ha ancora un’utilità attiva e non è in vendita.</p>
            </div>
          </div>
          <div className="krl-visual" aria-hidden="true">
            <div className="ledger-grid" />
            <div className="token-ring token-ring-a" />
            <div className="token-ring token-ring-b" />
            <div className="krl-token"><span>KRL</span><small>BY KRELUNA</small></div>
            <span className="chain-label label-base">BASE</span>
            <span className="chain-label label-supply">FIXED SUPPLY</span>
            <span className="chain-label label-dev">IN DEVELOPMENT</span>
          </div>
        </div>
        <p className="krl-disclaimer reveal">
          Informazioni preliminari: non costituiscono un’offerta o un invito all’acquisto.
          Nessuna garanzia di valore o rendimento. Un eventuale lancio resta subordinato a utilità
          reale e dimostrabile, audit indipendente e verifiche legali e regolamentari.
        </p>
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

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>Tecnologia e intelligenza artificiale per ciò che viene dopo.</p>
          </div>
          <div className="footer-column">
            <h5>Prodotti</h5>
            {products.map((product) => <a key={product.slug} href={product.href}>{product.name}</a>)}
          </div>
          <div className="footer-column">
            <h5>Kreluna</h5>
            <a href="https://www.kreluna.it/azienda.html">Azienda</a>
            <a href="https://www.kreluna.it/risorse.html">Risorse</a>
            <a href="https://www.kreluna.it/contatti.html">Contatti</a>
            <a href="https://www.kreluna.it/en/" hrefLang="en" lang="en">English</a>
          </div>
          <div className="footer-column">
            <h5>Legale</h5>
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
    </main>
  );
}
