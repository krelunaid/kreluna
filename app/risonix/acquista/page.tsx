import type { Metadata } from "next";
import { chatGPTSignInPath, getChatGPTUser } from "../../chatgpt-auth";
import { risonixPurchasePresentation } from "../commerce";
import "../risonix.css";
import "../commerce.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acquista Risonix | Kreluna",
  description: "Acquisto una tantum di Risonix con licenza personale per un solo dispositivo.",
  robots: { index: false, follow: true },
};

export default async function RisonixPurchasePage({ searchParams }: { searchParams: Promise<{ errore?: string; annullato?: string }> }) {
  const [user, query] = await Promise.all([getChatGPTUser(), searchParams]);
  const presentation = risonixPurchasePresentation();
  return (
    <main className="rx-account-page rx-purchase-page">
      <header className="rx-nav"><a className="rx-brand" href="/risonix"><span className="rx-mark">⌁</span><b>RISONIX</b></a><nav><a href="/risonix">Prodotto</a><a href="/risonix/account">Area cliente</a></nav></header>
      <section className="rx-purchase-shell">
        <div className="rx-purchase-copy">
          <p className="rx-kicker"><i /> Acquisto una tantum</p>
          <h1>Risonix.<br /><em>Una licenza, un dispositivo.</em></h1>
          <p>Riconoscimento musicale locale per Windows 10/11 64 bit e Mac Apple Silicon, con licenza online vincolata al primo dispositivo.</p>
          <ul><li>Nessun abbonamento</li><li>Licenza personale non trasferibile per un solo dispositivo</li><li>Download Mac e Windows dopo il pagamento confermato</li></ul>
        </div>
        <section className="rx-checkout-card" aria-labelledby="checkout-title">
          <span className="rx-test-badge">Stripe · {presentation.stripeMode === "live" ? "pagamento sicuro" : "modalità test"}</span>
          <h2 id="checkout-title">Risonix 1.0</h2>
          <p className="rx-price">{presentation.priceDisplay}</p>
          <p>Pagamento unico. La licenza viene generata soltanto dopo la conferma firmata di Stripe.</p>
          {query.annullato ? <p className="rx-checkout-alert">Checkout annullato: non è stato effettuato alcun pagamento.</p> : null}
          {query.errore ? <p className="rx-checkout-alert error">Il checkout non è disponibile in questo momento. Non è stato effettuato alcun addebito.</p> : null}
          {!presentation.ready ? (
            <div className="rx-checkout-unavailable"><strong>Acquisto non ancora attivo</strong><span>Prezzo, Stripe, download, email e dati del venditore devono essere configurati lato server.</span></div>
          ) : !user ? (
            <a className="rx-primary rx-purchase-action" href={chatGPTSignInPath("/risonix/acquista")}>Accedi per acquistare <span>→</span></a>
          ) : (
            <form method="post" action="/api/risonix/checkout" className="rx-checkout-form">
              <p>Acquisto associato a <strong>{user.email}</strong></p>
              <label><input type="checkbox" name="accept_terms" value="yes" required /> <span>Accetto i <a href={presentation.termsUrl ?? "#"}>termini</a>, la <a href={presentation.privacyUrl ?? "#"}>privacy</a> e la <a href={presentation.refundPolicyUrl ?? "#"}>politica di rimborso</a>.</span></label>
              <button className="rx-primary rx-purchase-action" type="submit">Vai al checkout Stripe <span>→</span></button>
            </form>
          )}
          <small>Venditore: {presentation.sellerName}. Nessun dato di pagamento transita nel frontend Kreluna.</small>
        </section>
      </section>
    </main>
  );
}
