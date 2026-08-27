import type { Metadata } from "next";
import "../risonix.css";
import "../commerce.css";

export const metadata: Metadata = { title: "Rimborsi Risonix | Kreluna", robots: { index: true, follow: true } };

export default function RisonixRefundsPage() {
  return <main className="rx-account-page"><header className="rx-nav"><a className="rx-brand" href="/risonix"><span className="rx-mark">⌁</span><b>RISONIX</b></a></header><article className="rx-legal-card"><p className="rx-kicker"><i /> Politica di rimborso</p><h1>Acquista con informazioni chiare.</h1><p>Prima del download e dell’attivazione vengono mostrati prezzo, compatibilità, requisiti online e condizioni della licenza.</p><h2>Diritto di recesso</h2><p>Per i consumatori si applicano i diritti inderogabili previsti dalla legge. Quando l’esecuzione o il download del contenuto digitale inizia immediatamente, l’eventuale consenso espresso e la relativa presa d’atto vengono raccolti durante il checkout quando richiesto.</p><h2>Software difettoso</h2><p>Se Risonix non si avvia o una funzione dichiarata non opera su un sistema supportato, contatta Kreluna indicando versione, sistema e messaggio di errore. Kreluna tenterà prima la correzione o la sostituzione e valuterà il rimborso quando dovuto.</p><h2>Effetto del rimborso</h2><p>Un rimborso completo disattiva automaticamente la licenza associata all’ordine.</p><h2>Contatti</h2><p>Usa i contatti pubblicati sul sito Kreluna e conserva il riferimento dell’ordine.</p><small>Versione del 27 agosto 2026. La politica deve essere verificata da un professionista prima della vendita al pubblico.</small></article></main>;
}
