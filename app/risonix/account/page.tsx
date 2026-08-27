import { chatGPTSignOutPath, requireChatGPTUser } from "../../chatgpt-auth";
import { loadRisonixLicenses } from "../license-bridge";
import { loadRisonixCustomerOrders } from "../commerce";
import "../risonix.css";
import "../commerce.css";

/* eslint-disable @next/next/no-html-link-for-pages */

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "Mai";
  return new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function RisonixAccountPage() {
  const user = await requireChatGPTUser("/risonix/account");
  let licenses = [] as Awaited<ReturnType<typeof loadRisonixLicenses>>;
  let orders = [] as Awaited<ReturnType<typeof loadRisonixCustomerOrders>>;
  let unavailable = false;
  try {
    licenses = await loadRisonixLicenses(user.email);
  } catch {
    unavailable = true;
  }
  try {
    orders = await loadRisonixCustomerOrders(user);
  } catch {
    unavailable = true;
  }

  return (
    <main className="rx-account-page">
      <header className="rx-nav"><a className="rx-brand" href="/risonix"><span className="rx-mark">⌁</span><b>RISONIX</b></a><nav><a href="/risonix">Prodotto</a><a href={chatGPTSignOutPath("/risonix")}>Esci</a></nav></header>
      <section className="rx-account-head"><p className="rx-kicker"><i /> Area cliente protetta</p><h1>La mia <em>licenza.</em></h1><p>Accesso: {user.email}</p></section>
      <section className="rx-order-list" aria-labelledby="orders-title">
        <div className="rx-account-section-head"><div><p className="rx-kicker"><i /> Ordini</p><h2 id="orders-title">Stato degli acquisti</h2></div><a className="rx-secondary" href="/risonix/acquista">Acquista Risonix</a></div>
        {orders.length === 0 ? <p className="rx-empty-order">Nessun ordine associato a questo account.</p> : orders.map((order) => <article key={order.id}><div><span className={`rx-order-status ${order.status}`}>{order.status}</span><strong>Ordine {order.id.slice(0, 8).toUpperCase()}</strong></div><dl><div><dt>Importo</dt><dd>{order.price ?? "In attesa"}</dd></div><div><dt>Licenza</dt><dd>{order.status === "fulfilled" ? "Generata" : order.status === "refunded" ? "Disattivata" : "In preparazione"}</dd></div><div><dt>Email</dt><dd>{order.emailStatus}</dd></div><div><dt>Data</dt><dd>{formatDate(order.createdAt)}</dd></div></dl></article>)}
      </section>
      {unavailable ? (
        <section className="rx-account-message"><span>⌁</span><div><h2>Servizio momentaneamente non disponibile</h2><p>Il server licenze Kreluna non ha risposto. Riprova tra poco o contatta l’assistenza.</p></div></section>
      ) : licenses.length === 0 ? (
        <section className="rx-account-message"><span>0</span><div><h2>Nessuna licenza associata</h2><p>Una licenza appare qui quando l’email usata nell’acquisto coincide con questo account.</p></div></section>
      ) : (
        <section className="rx-license-list">
          {licenses.map((license) => (
            <article key={license.license_id}>
              <div className="rx-license-top"><span className={license.online ? "online" : "offline"}><i />{license.online ? "ONLINE" : license.device_label ? "OFFLINE" : "NON ATTIVATA"}</span><small>RIX-{license.license_id.slice(0, 8).toUpperCase()}</small></div>
              <h2>Risonix 1.0</h2><dl><div><dt>Stato</dt><dd>{license.status}</dd></div><div><dt>Dispositivo</dt><dd>{license.device_label ?? "Nessun dispositivo"}</dd></div><div><dt>Versione</dt><dd>{license.app_version ?? "—"}</dd></div><div><dt>Ultimo contatto</dt><dd>{formatDate(license.last_seen)}</dd></div></dl>
              {license.device_label ? <form method="post" action={`/api/risonix/licenses/${license.license_id}/release`}><button type="submit">Libera questo dispositivo</button></form> : <p className="rx-ready">Pronta per una nuova attivazione.</p>}
            </article>
          ))}
        </section>
      )}
      <p className="rx-account-note">Liberare il dispositivo disattiva subito l’installazione corrente. Il codice potrà poi essere usato sul nuovo Mac o PC.</p>
    </main>
  );
}
