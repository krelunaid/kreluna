import type { Metadata } from "next";
import { requireChatGPTUser } from "../../chatgpt-auth";
import { loadRisonixConfirmation } from "../commerce";
import "../risonix.css";
import "../commerce.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conferma ordine Risonix | Kreluna",
  robots: { index: false, follow: false },
};

async function ConfirmationContent({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const sessionId = (await searchParams).session_id ?? "";
  const returnTo = sessionId ? `/risonix/conferma?session_id=${encodeURIComponent(sessionId)}` : "/risonix/conferma";
  const user = await requireChatGPTUser(returnTo);
  const order = await loadRisonixConfirmation(sessionId, user);
  return (
    <main className="rx-account-page rx-confirmation-page">
      <header className="rx-nav"><a className="rx-brand" href="/risonix"><span className="rx-mark">⌁</span><b>RISONIX</b></a><nav><a href="/risonix/account">Area cliente</a></nav></header>
      <section className="rx-confirmation-card">
        {!order ? <><p className="rx-kicker"><i /> Verifica ordine</p><h1>Conferma non disponibile.</h1><p>L’ordine non appartiene a questo account oppure il riferimento Stripe non è valido.</p></> : order.status !== "fulfilled" ? <><p className="rx-kicker"><i /> Pagamento ricevuto</p><h1>Stiamo preparando la licenza.</h1><p>Stato ordine: <strong>{order.status}</strong>. La pagina può essere aggiornata dopo la conferma del webhook Stripe.</p><a className="rx-secondary" href="/risonix/account">Controlla nell’area cliente</a></> : <><p className="rx-kicker"><i /> Ordine completato</p><h1>Risonix è <em>pronta.</em></h1><p>La licenza è associata al tuo account ed è stata inviata anche via email.</p><div className="rx-license-delivery"><span>Codice licenza</span><code>{order.licenseKey}</code></div><div className="rx-actions"><a className="rx-primary" href={order.macDownload ?? "#"}>Scarica per Mac</a><a className="rx-secondary" href={order.windowsDownload ?? "#"}>Scarica per Windows</a></div><small>Conserva il codice in un luogo sicuro. La licenza può essere attiva su un solo dispositivo.</small></>}
      </section>
    </main>
  );
}

export default function RisonixConfirmationPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  return <ConfirmationContent searchParams={searchParams} />;
}
