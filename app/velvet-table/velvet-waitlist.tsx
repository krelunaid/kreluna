"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type Audience = "customer" | "restaurant";
type FormState = "idle" | "submitting" | "success" | "error";

export default function VelvetWaitlist() {
  const [audience, setAudience] = useState<Audience>("customer");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const source = useMemo(() => {
    if (typeof window === "undefined") return "velvet-page";
    const params = new URLSearchParams(window.location.search);
    return params.get("utm_source")?.slice(0, 80) || "velvet-page";
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");
    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/velvet-waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          audience,
          restaurantName: form.get("restaurantName"),
          city: form.get("city"),
          website: form.get("website"),
          consent: form.get("consent") === "on",
          source,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Iscrizione non completata.");
      setState("success");
      setMessage("Iscrizione completata. Ti avviseremo quando Velvet Table sarà disponibile.");
      formElement.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Iscrizione non completata.");
    }
  }

  return (
    <section className="velvet-waitlist section-shell" id="lista-attesa" aria-labelledby="velvet-waitlist-title">
      <div className="velvet-waitlist-copy">
        <div className="eyebrow velvet-text"><i /> Lista di lancio</div>
        <h2 id="velvet-waitlist-title">Vuoi sapere quando Velvet Table sarà disponibile?</h2>
        <p>Scegli il percorso giusto: avviso di lancio per i clienti oppure aggiornamenti dedicati ai ristoratori interessati al progetto pilota.</p>
      </div>
      <form className="velvet-waitlist-form" onSubmit={submit}>
        <fieldset>
          <legend>Come vuoi partecipare?</legend>
          <div className="velvet-audience-options">
            <label htmlFor="velvet-audience-customer"><input id="velvet-audience-customer" aria-label="Sono un cliente" type="radio" name="audience" value="customer" checked={audience === "customer"} onChange={() => setAudience("customer")} /> <span><strong>Sono un cliente</strong><small>Avvisami quando l’app sarà disponibile.</small></span></label>
            <label htmlFor="velvet-audience-restaurant"><input id="velvet-audience-restaurant" aria-label="Sono un ristoratore" type="radio" name="audience" value="restaurant" checked={audience === "restaurant"} onChange={() => setAudience("restaurant")} /> <span><strong>Sono un ristoratore</strong><small>Voglio conoscere il progetto pilota.</small></span></label>
          </div>
        </fieldset>
        <label className="velvet-field"><span>Email</span><input type="email" name="email" autoComplete="email" required maxLength={254} placeholder="nome@esempio.it" /></label>
        {audience === "restaurant" && <div className="velvet-restaurant-fields"><label className="velvet-field"><span>Nome del locale <small>(facoltativo)</small></span><input type="text" name="restaurantName" autoComplete="organization" maxLength={120} /></label><label className="velvet-field"><span>Città <small>(facoltativa)</small></span><input type="text" name="city" autoComplete="address-level2" maxLength={100} /></label></div>}
        <label className="velvet-honeypot" aria-hidden="true">Sito web<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
        <label className="velvet-consent"><input type="checkbox" name="consent" required /> <span>Accetto che Kreluna utilizzi questa email esclusivamente per aggiornamenti e avvisi sul lancio di Velvet Table. Posso chiedere la cancellazione in qualsiasi momento. <a href="/privacy.html">Informativa privacy</a>.</span></label>
        <button className="button velvet-page-button" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Iscrizione in corso…" : audience === "restaurant" ? "Partecipa come ristoratore" : "Avvisami al lancio"}</button>
        <p className={`velvet-form-status ${state}`} aria-live="polite">{message}</p>
      </form>
    </section>
  );
}
