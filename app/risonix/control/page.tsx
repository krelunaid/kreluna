"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import "../risonix.css";
import "./control.css";

type License = { license_id: string; status: string; order_reference: string | null; created_at: string; activation: null | { device_label: string; platform: string; app_version: string; status: string; last_seen: string } };
type Order = { id: string; status: string; amount_total: number | null; currency: string | null; email_status: string; license_id: string | null; created_at: string; paid_at: string | null; refunded_at: string | null };

export default function RisonixControlPage() {
  const [licenses, setLicenses] = useState<License[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    const [licenseResponse, orderResponse] = await Promise.all([
      fetch("/api/risonix/v1/control/licenses", { cache: "no-store" }),
      fetch("/api/risonix/orders", { cache: "no-store" }),
    ]);
    setLicenses(licenseResponse.ok ? await licenseResponse.json() as License[] : null);
    setOrders(orderResponse.ok ? await orderResponse.json() as Order[] : []);
  }, []);
  useEffect(() => {
    // The initial server check decides whether the protected login or dashboard is shown.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function login(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/risonix/v1/control/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    setMessage(response.ok ? "Accesso riuscito." : "Password non valida.");
    if (response.ok) { setPassword(""); await load(); }
  }
  async function create(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/risonix/v1/control/licenses", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ customer_email: email, order_reference: order }) });
    const body = await response.json() as { license_key?: string; error?: string };
    setMessage(response.ok ? `Nuova licenza (copiala ora): ${body.license_key}` : body.error ?? "Creazione non riuscita.");
    if (response.ok) { setEmail(""); setOrder(""); await load(); }
  }
  async function mutate(id: string, action: "release-device" | "disable") {
    if (action === "disable" && !window.confirm("Disattivare definitivamente questa licenza?")) return;
    const response = await fetch(`/api/risonix/v1/control/licenses/${id}/${action}`, { method: "POST" });
    setMessage(response.ok ? (action === "disable" ? "Licenza disattivata." : "Dispositivo liberato.") : "Operazione non riuscita.");
    if (response.ok) await load();
  }
  async function refund(orderId: string) {
    if (!window.confirm("Richiedere a Stripe il rimborso completo? La licenza verrà disattivata dopo la conferma del webhook.")) return;
    const response = await fetch(`/api/risonix/orders/${orderId}/refund`, { method: "POST" });
    const body = await response.json() as { error?: string };
    setMessage(response.ok ? "Rimborso richiesto. In attesa della conferma Stripe." : body.error ?? "Rimborso non riuscito.");
    if (response.ok) await load();
  }
  return <main className="rx-page rx-control">
    <header className="rx-nav"><a className="rx-brand" href="/risonix"><span className="rx-mark">⌁</span><b>RISONIX CONTROL</b></a><nav><a href="/risonix">Prodotto</a></nav></header>
    <section className="rx-account-head"><p className="rx-kicker"><i /> Dashboard privata Kreluna</p><h1>Licenze sempre <em>sotto controllo.</em></h1><p>Attivazioni, dispositivi e ultima verifica online in un’unica schermata.</p></section>
    {licenses === null ? <form className="rx-control-form" onSubmit={login}><h2>Accesso amministratore</h2><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password dashboard" required /><button className="rx-primary">Entra</button></form> : <>
      <form className="rx-control-form" onSubmit={create}><h2>Crea una licenza</h2><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email cliente" required /><input value={order} onChange={(e) => setOrder(e.target.value)} placeholder="Riferimento ordine" /><button className="rx-primary">Genera codice</button></form>
      <section className="rx-control-section"><div className="rx-control-heading"><p className="rx-kicker"><i /> Ciclo commerciale</p><h2>Ordini Stripe</h2></div><div className="rx-order-grid">{orders.length === 0 ? <p>Nessun ordine registrato.</p> : orders.map((item) => <article className="rx-order-card" key={item.id}><div><span className={`rx-status ${item.status}`}>{item.status}</span><code>{item.id}</code></div><h3>{item.amount_total !== null && item.currency ? new Intl.NumberFormat("it-IT", { style: "currency", currency: item.currency.toUpperCase() }).format(item.amount_total / 100) : "Importo in attesa"}</h3><p>Licenza: {item.license_id ?? "non generata"}</p><small>Email: {item.email_status} · {new Date(item.created_at).toLocaleString("it-IT")}</small>{item.status === "fulfilled" ? <button className="danger" onClick={() => void refund(item.id)}>Rimborsa e disattiva</button> : null}</article>)}</div></section>
      <section className="rx-license-grid">{licenses.map((item) => <article className="rx-license-card" key={item.license_id}><div><span className={`rx-status ${item.status}`}>{item.status}</span><h2>{item.order_reference || "Licenza Risonix"}</h2><code>{item.license_id}</code></div><p>{item.activation ? `${item.activation.device_label} · ${item.activation.platform} · ${item.activation.app_version}` : "Nessun dispositivo attivo"}</p>{item.activation && <small>Ultimo controllo: {new Date(item.activation.last_seen).toLocaleString("it-IT")}</small>}<div className="rx-control-actions"><button onClick={() => void mutate(item.license_id, "release-device")}>Libera dispositivo</button><button className="danger" onClick={() => void mutate(item.license_id, "disable")}>Disattiva</button></div></article>)}</section>
    </>}
    {message && <aside className="rx-control-message">{message}</aside>}
  </main>;
}
