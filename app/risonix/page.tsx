import type { Metadata } from "next";
import { chatGPTSignInPath } from "../chatgpt-auth";
import { risonixPurchasePresentation } from "./commerce";
import "./risonix.css";

/* eslint-disable @next/next/no-html-link-for-pages */

export const metadata: Metadata = {
  title: "Risonix — Riconoscimento musicale | Kreluna",
  description:
    "Risonix riconosce i brani della tua raccolta con impronte acustiche locali, percentuale di corrispondenza, microfono e licenza online per un solo dispositivo.",
  alternates: { canonical: "/risonix" },
  openGraph: {
    title: "Risonix — La tua musica si riconosce",
    description: "Impronte acustiche locali, riconoscimento musicale e controllo licenze Kreluna.",
    url: "/risonix",
    siteName: "Kreluna",
    locale: "it_IT",
    type: "website",
  },
};

const accountUrl = chatGPTSignInPath("/risonix/account");

export default function RisonixPage() {
  const purchase = risonixPurchasePresentation();
  return (
    <main className="rx-page">
      <header className="rx-nav">
        <a className="rx-brand" href="/"><span className="rx-mark">⌁</span><b>KRELUNA</b></a>
        <nav aria-label="Navigazione Risonix"><a href="/">Ecosistema</a><a href="#funzioni">Funzioni</a><a href={accountUrl}>La mia licenza</a></nav>
      </header>

      <section className="rx-hero">
        <div className="rx-grid" aria-hidden="true" />
        <div className="rx-copy">
          <p className="rx-kicker"><i /> Risonix · by Kreluna</p>
          <h1>La tua musica.<br /><em>Riconosciuta.</em></h1>
          <p>Collega una cartella, fai ascoltare un campione e Risonix confronta l’impronta acustica con il tuo database locale. Nome, punto e percentuale compaiono in pochi istanti.</p>
          <div className="rx-actions">
            <a className="rx-primary" href="/risonix/acquista">Acquista Risonix <span>→</span></a>
            <a className="rx-secondary" href={accountUrl}>Gestisci la licenza</a>
          </div>
          <small>Risonix 1.0 · {purchase.priceDisplay} · macOS · Windows in preparazione · licenza online per un dispositivo</small>
        </div>
        <div className="rx-console" aria-label="Anteprima di Risonix">
          <div className="rx-console-top"><span><i /><i /><i /></span><b>RISONIX</b><small>ONLINE</small></div>
          <div className="rx-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
          <div className="rx-result"><div className="rx-score"><strong>98</strong><small>% MATCH</small></div><div><small>CANZONE TROVATA</small><h2>Artista · Titolo</h2><p>Punto riconosciuto 0:08</p></div></div>
          <div className="rx-player"><button aria-label="Esempio pulsante Play">▶</button><span><b>Ascolta il brano riconosciuto</b><i /></span><small>0:08 / 3:42</small></div>
        </div>
      </section>

      <section className="rx-features" id="funzioni">
        <div><p className="rx-kicker"><i /> Come funziona</p><h2>Il riconoscimento resta<br /><em>sul tuo dispositivo.</em></h2></div>
        <div className="rx-feature-grid">
          <article><span>01</span><h3>Database locale</h3><p>Le impronte e i file musicali non vengono caricati sul server Kreluna.</p></article>
          <article><span>02</span><h3>File o microfono</h3><p>Apri MP3, WAV, FLAC e AAC oppure ascolta dieci secondi dal microfono.</p></article>
          <article><span>03</span><h3>Risultato leggibile</h3><p>Risonix mostra nome, percentuale, punto riconosciuto e riproduzione.</p></article>
          <article><span>04</span><h3>Licenza controllata</h3><p>Una sola attivazione online; il dispositivo può essere trasferito dall’area cliente.</p></article>
        </div>
      </section>

      <section className="rx-security">
        <div><p className="rx-kicker"><i /> Kreluna Control</p><h2>Acquisto, dispositivo e licenza.<br /><em>Un unico collegamento.</em></h2><p>La dashboard Kreluna vede attivazioni e heartbeat. L’area cliente permette di liberare il vecchio computer senza conoscere i segreti amministrativi.</p></div>
        <a className="rx-primary" href={accountUrl}>Apri la mia area <span>→</span></a>
      </section>

      <footer className="rx-footer"><span>© 2026 Kreluna · Risonix</span><a href="/risonix/privacy">Privacy Risonix</a><a href="/risonix/termini">Licenza</a><a href="/risonix/rimborsi">Rimborsi</a><span>P. IVA 02114130475 · REA PT-622714</span></footer>
    </main>
  );
}
