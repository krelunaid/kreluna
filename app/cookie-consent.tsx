"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  COOKIE_PREFERENCE_KEY,
} from "./meta-pixel";

type Copy = {
  label: string;
  text: string;
  policy: string;
  necessary: string;
  accept: string;
  settings: string;
};

const copyByLanguage: Record<string, Copy> = {
  it: {
    label: "Preferenze cookie",
    text: "Con il tuo consenso usiamo il Meta Pixel per misurare visite e iscrizioni provenienti dalle campagne. Il sito funziona anche senza cookie di marketing.",
    policy: "Cookie policy",
    necessary: "Solo necessari",
    accept: "Accetta misurazione",
    settings: "Gestisci cookie",
  },
  en: {
    label: "Cookie preferences",
    text: "With your consent, we use the Meta Pixel to measure visits and sign-ups from campaigns. The website also works without marketing cookies.",
    policy: "Cookie policy",
    necessary: "Necessary only",
    accept: "Accept measurement",
    settings: "Cookie settings",
  },
  fr: {
    label: "Préférences de cookies",
    text: "Avec votre accord, nous utilisons le pixel Meta pour mesurer les visites et inscriptions issues des campagnes. Le site fonctionne aussi sans cookies marketing.",
    policy: "Politique cookies",
    necessary: "Nécessaires uniquement",
    accept: "Accepter la mesure",
    settings: "Gérer les cookies",
  },
  es: {
    label: "Preferencias de cookies",
    text: "Con tu consentimiento usamos el píxel de Meta para medir visitas y registros procedentes de campañas. El sitio funciona también sin cookies de marketing.",
    policy: "Política de cookies",
    necessary: "Solo necesarias",
    accept: "Aceptar medición",
    settings: "Gestionar cookies",
  },
  de: {
    label: "Cookie-Einstellungen",
    text: "Mit Ihrer Einwilligung verwenden wir das Meta-Pixel, um Besuche und Anmeldungen aus Kampagnen zu messen. Die Website funktioniert auch ohne Marketing-Cookies.",
    policy: "Cookie-Richtlinie",
    necessary: "Nur notwendige",
    accept: "Messung akzeptieren",
    settings: "Cookies verwalten",
  },
};

function languageForPath(pathname: string) {
  const match = pathname.match(/^\/(en|fr|es|de)(?:\/|$)/);
  return match?.[1] ?? "it";
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [language, setLanguage] = useState("it");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLanguage(languageForPath(window.location.pathname));
      try {
        setVisible(!window.localStorage.getItem(COOKIE_PREFERENCE_KEY));
      } catch {
        setVisible(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const choose = (choice: "technical" | "accepted") => {
    try {
      window.localStorage.setItem(COOKIE_PREFERENCE_KEY, choice);
    } catch {
      // Consent remains valid for the current page even if storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { choice } }));
    setVisible(false);
  };

  const copy = copyByLanguage[language] ?? copyByLanguage.it;
  const policyHref = language === "en" ? "/en/cookies.html" : "/cookie.html";

  if (!visible) {
    return <button className="cookie-settings-trigger" type="button" onClick={() => setVisible(true)}>{copy.settings}</button>;
  }

  return (
    <aside className="cookie-banner" aria-label={copy.label}>
      <p>{copy.text} <a href={policyHref}>{copy.policy}</a>.</p>
      <div>
        <button type="button" onClick={() => choose("technical")}>{copy.necessary}</button>
        <button type="button" className="accept" onClick={() => choose("accepted")}>{copy.accept}</button>
      </div>
    </aside>
  );
}
