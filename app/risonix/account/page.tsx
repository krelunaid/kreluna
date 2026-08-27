import { chatGPTSignOutPath, requireChatGPTUser } from "../../chatgpt-auth";
import Link from "next/link";
import { loadRisonixLicenses } from "../license-bridge";
import "../risonix.css";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "Mai";
  return new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function RisonixAccountPage() {
  const user = await requireChatGPTUser("/risonix/account");
  let licenses = [] as Awaited<ReturnType<typeof loadRisonixLicenses>>;
  let unavailable = false;
  try {
    licenses = await loadRisonixLicenses(user.email);
  } catch {
    unavailable = true;
  }

  return (
    <main className="rx-account-page">
      <header className="rx-nav"><Link className="rx-brand" href="/risonix"><span className="rx-mark">⌁</span><b>RISONIX</b></Link><nav><Link href="/risonix">Prodotto</Link><Link href={chatGPTSignOutPath("/risonix")}>Esci</Link></nav></header>
      <section className="rx-account-head"><p className="rx-kicker"><i /> Area cliente protetta</p><h1>La mia <em>licenza.</em></h1><p>Accesso: {user.email}</p></section>
      {unavailable ? (
        <section className="rx-account-message"><span>⌁</span><div><h2>Collegamento in preparazione</h2><p>L’area è pronta, ma il server licenze pubblico Kreluna non è ancora online. La preview locale continua a funzionare dal Mac autorizzato.</p></div></section>
      ) : licenses.length === 0 ? (
        <section className="rx-account-message"><span>0</span><div><h2>Nessuna licenza associata</h2><p>Una licenza appare qui quando l’email usata nell’acquisto coincide con questo account.</p></div></section>
      ) : (
        <section className="rx-license-list">
          {licenses.map((license) => (
            <article key={license.license_id}>
              <div className="rx-license-top"><span className={license.online ? "online" : "offline"}><i />{license.online ? "ONLINE" : license.device_label ? "OFFLINE" : "NON ATTIVATA"}</span><small>RIX-{license.license_id.slice(0, 8).toUpperCase()}</small></div>
              <h2>Risonix 1.7</h2><dl><div><dt>Stato</dt><dd>{license.status}</dd></div><div><dt>Dispositivo</dt><dd>{license.device_label ?? "Nessun dispositivo"}</dd></div><div><dt>Versione</dt><dd>{license.app_version ?? "—"}</dd></div><div><dt>Ultimo contatto</dt><dd>{formatDate(license.last_seen)}</dd></div></dl>
              {license.device_label ? <form method="post" action={`/api/risonix/licenses/${license.license_id}/release`}><button type="submit">Libera questo dispositivo</button></form> : <p className="rx-ready">Pronta per una nuova attivazione.</p>}
            </article>
          ))}
        </section>
      )}
      <p className="rx-account-note">Liberare il dispositivo disattiva subito l’installazione corrente. Il codice potrà poi essere usato sul nuovo Mac o PC.</p>
    </main>
  );
}
