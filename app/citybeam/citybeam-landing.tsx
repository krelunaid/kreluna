/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { cityBeamFaq } from "./citybeam-faq";
import { cityBeamContent as translations } from "./citybeam-content";
import LaunchSignup from '../launch-signup';

export type CityBeamLocale = "it" | "en" | "fr" | "es" | "de";

const siteUrl = "https://www.kreluna.it";
const localePath: Record<CityBeamLocale, string> = {
  it: "/citybeam",
  en: "/en/citybeam",
  fr: "/fr/citybeam",
  es: "/es/citybeam",
  de: "/de/citybeam",
};

const openGraphLocale: Record<CityBeamLocale, string> = {
  it: "it_IT",
  en: "en_GB",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
};

const photoStory = {
  it: {
    kicker: "Scatti reali · Times Square",
    title: "Lo schermo, dentro la città.",
    intro: "Queste fotografie mostrano campagne apparse sul display digitale NY-D020 a Times Square: la scala dello schermo, la strada e la vita intorno.",
    credit: "Fotografie fornite da Heritage Outdoor.",
    note: "I marchi e i contenuti appartengono ai rispettivi proprietari. Le immagini documentano lo schermo e non indicano offerte, approvazioni o prenotazioni attive tramite CityBeam.",
    heroAlt: "Campagna ASOS sul display digitale NY-D020 a Times Square, fotografata da Heritage Outdoor.",
    images: [
      { file: "ny-d020-soundcloud-wiz-khalifa", brand: "SoundCloud · Wiz Khalifa", alt: "Campagna SoundCloud con Wiz Khalifa sul display NY-D020 a Times Square." },
      { file: "ny-d020-soundcloud", brand: "SoundCloud", alt: "Campagna SoundCloud sul display digitale NY-D020 a Times Square." },
      { file: "ny-d020-the-economist", brand: "The Economist", alt: "Campagna The Economist sul display NY-D020, vista dalla strada." },
      { file: "ny-d020-asos-times-square", brand: "ASOS", alt: "Campagna ASOS sul display NY-D020, tra i negozi di Times Square." },
      { file: "ny-d020-times-square-context", brand: "NY-D020 · Times Square", alt: "Il display digitale NY-D020 nel flusso urbano di Times Square." },
    ],
  },
  en: {
    kicker: "Real photographs · Times Square",
    title: "The screen, in the city.",
    intro: "These photographs show campaigns that appeared on the NY-D020 digital display in Times Square, with the street and city life around it.",
    credit: "Photographs provided by Heritage Outdoor.",
    note: "Brands and creative content remain the property of their respective owners. These images document the screen and do not imply active CityBeam inventory, endorsement or booking.",
    heroAlt: "An ASOS campaign on the NY-D020 digital display in Times Square, photographed by Heritage Outdoor.",
    images: [
      { file: "ny-d020-soundcloud-wiz-khalifa", brand: "SoundCloud · Wiz Khalifa", alt: "A SoundCloud campaign featuring Wiz Khalifa on the NY-D020 display in Times Square." },
      { file: "ny-d020-soundcloud", brand: "SoundCloud", alt: "A SoundCloud campaign on the NY-D020 digital display in Times Square." },
      { file: "ny-d020-the-economist", brand: "The Economist", alt: "A The Economist campaign on the NY-D020 display, seen from the street." },
      { file: "ny-d020-asos-times-square", brand: "ASOS", alt: "An ASOS campaign on the NY-D020 display among Times Square shops." },
      { file: "ny-d020-times-square-context", brand: "NY-D020 · Times Square", alt: "The NY-D020 digital display in the flow of Times Square." },
    ],
  },
  fr: {
    kicker: "Photos réelles · Times Square",
    title: "L’écran, au cœur de la ville.",
    intro: "Ces photos montrent des campagnes diffusées sur l’écran numérique NY-D020 à Times Square, avec la rue et la vie autour.",
    credit: "Photographies fournies par Heritage Outdoor.",
    note: "Les marques et les créations restent la propriété de leurs propriétaires respectifs. Ces images documentent l’écran et ne signifient ni offre, ni approbation, ni réservation CityBeam active.",
    heroAlt: "Campagne ASOS sur l’écran numérique NY-D020 à Times Square, photographiée par Heritage Outdoor.",
    images: [
      { file: "ny-d020-soundcloud-wiz-khalifa", brand: "SoundCloud · Wiz Khalifa", alt: "Campagne SoundCloud avec Wiz Khalifa sur l’écran NY-D020 à Times Square." },
      { file: "ny-d020-soundcloud", brand: "SoundCloud", alt: "Campagne SoundCloud sur l’écran numérique NY-D020 à Times Square." },
      { file: "ny-d020-the-economist", brand: "The Economist", alt: "Campagne The Economist sur l’écran NY-D020, vue depuis la rue." },
      { file: "ny-d020-asos-times-square", brand: "ASOS", alt: "Campagne ASOS sur l’écran NY-D020 parmi les boutiques de Times Square." },
      { file: "ny-d020-times-square-context", brand: "NY-D020 · Times Square", alt: "L’écran numérique NY-D020 dans le flux urbain de Times Square." },
    ],
  },
  es: {
    kicker: "Fotografías reales · Times Square",
    title: "La pantalla, en plena ciudad.",
    intro: "Estas fotografías muestran campañas emitidas en la pantalla digital NY-D020 de Times Square, con la calle y la vida que la rodean.",
    credit: "Fotografías facilitadas por Heritage Outdoor.",
    note: "Las marcas y las creatividades pertenecen a sus respectivos propietarios. Las imágenes documentan la pantalla y no implican disponibilidad, aprobación ni reserva activa en CityBeam.",
    heroAlt: "Campaña de ASOS en la pantalla digital NY-D020 de Times Square, fotografiada por Heritage Outdoor.",
    images: [
      { file: "ny-d020-soundcloud-wiz-khalifa", brand: "SoundCloud · Wiz Khalifa", alt: "Campaña de SoundCloud con Wiz Khalifa en la pantalla NY-D020 de Times Square." },
      { file: "ny-d020-soundcloud", brand: "SoundCloud", alt: "Campaña de SoundCloud en la pantalla digital NY-D020 de Times Square." },
      { file: "ny-d020-the-economist", brand: "The Economist", alt: "Campaña de The Economist en la pantalla NY-D020, vista desde la calle." },
      { file: "ny-d020-asos-times-square", brand: "ASOS", alt: "Campaña de ASOS en la pantalla NY-D020 entre las tiendas de Times Square." },
      { file: "ny-d020-times-square-context", brand: "NY-D020 · Times Square", alt: "La pantalla digital NY-D020 en el movimiento urbano de Times Square." },
    ],
  },
  de: {
    kicker: "Echte Fotos · Times Square",
    title: "Der Screen mitten in der Stadt.",
    intro: "Diese Fotos zeigen Kampagnen auf dem digitalen Display NY-D020 am Times Square, mit der Straße und dem Stadtleben ringsum.",
    credit: "Fotos von Heritage Outdoor.",
    note: "Marken und Werbemotive gehören den jeweiligen Rechteinhabern. Die Bilder dokumentieren den Screen und bedeuten weder verfügbares CityBeam-Inventar noch Empfehlung oder aktive Buchung.",
    heroAlt: "Eine ASOS-Kampagne auf dem digitalen Display NY-D020 am Times Square, fotografiert von Heritage Outdoor.",
    images: [
      { file: "ny-d020-soundcloud-wiz-khalifa", brand: "SoundCloud · Wiz Khalifa", alt: "SoundCloud-Kampagne mit Wiz Khalifa auf dem Display NY-D020 am Times Square." },
      { file: "ny-d020-soundcloud", brand: "SoundCloud", alt: "SoundCloud-Kampagne auf dem digitalen Display NY-D020 am Times Square." },
      { file: "ny-d020-the-economist", brand: "The Economist", alt: "The-Economist-Kampagne auf dem Display NY-D020, von der Straße aus gesehen." },
      { file: "ny-d020-asos-times-square", brand: "ASOS", alt: "ASOS-Kampagne auf dem Display NY-D020 zwischen den Geschäften am Times Square." },
      { file: "ny-d020-times-square-context", brand: "NY-D020 · Times Square", alt: "Das digitale Display NY-D020 im Stadtleben am Times Square." },
    ],
  },
} as const;

function CityBeamProofPhoto({ file, alt, brand, scene, label, hero = false }: { file: string; alt: string; brand: string; scene: string; label: string; hero?: boolean }) {
  const base = `/citybeam/ny-d020/${file}`;
  const sizes = hero ? '(max-width: 800px) 90vw, 54vw' : '(max-width: 700px) 90vw, 30vw';
  return <figure className={hero ? 'citybeam-visual' : 'citybeam-proof-photo'}>
    <a className="citybeam-photo-link" href={`${base}-1200.webp`} data-cb-photo data-caption={`${brand} · NY-D020 · Heritage Outdoor`} aria-label={`${label}: ${brand}`}>
      <picture><source type="image/avif" srcSet={`${base}-640.avif 640w, ${base}-1200.avif 1200w`} sizes={sizes} />
        <img src={`${base}-1200.webp`} srcSet={`${base}-640.webp 640w, ${base}-1200.webp 1200w`} sizes={sizes} alt={alt} width="1200" height="800" loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : undefined} decoding="async" />
      </picture><span className="citybeam-photo-expand" aria-hidden="true">↗</span>
    </a>
    <figcaption><div><span>{scene}</span><strong>{hero ? '1530 Broadway · Times Square' : brand}</strong></div><span className="citybeam-photo-number">{hero ? 'NY-D020 / NYC' : 'NY-D020'}</span></figcaption>
  </figure>;
}

export function cityBeamMetadata(locale: CityBeamLocale): Metadata {
  const t = translations[locale];
  const proof = photoStory[locale];
  const canonical = `${siteUrl}${localePath[locale]}`;
  const languages = Object.fromEntries(Object.entries(localePath).map(([language, path]) => [language, `${siteUrl}${path}`]));
  return {
    title: t.title,
    description: t.description,
    applicationName: "CityBeam by Kreluna",
    creator: "Kreluna",
    publisher: "Kreluna",
    category: "digital out-of-home advertising",
    alternates: { canonical, languages: { ...languages, "x-default": `${siteUrl}/citybeam` } },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: canonical,
      siteName: "Kreluna",
      locale: openGraphLocale[locale],
      alternateLocale: Object.entries(openGraphLocale)
        .filter(([language]) => language !== locale)
        .map(([, value]) => value),
      type: "website",
      images: [{ url: `${siteUrl}/citybeam-ny-d020-og.jpg`, width: 1200, height: 630, type: "image/jpeg", alt: proof.heroAlt }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [`${siteUrl}/citybeam-ny-d020-og.jpg`] },
  };
}

export default function CityBeamLanding({ locale }: { locale: CityBeamLocale }) {
  const t = translations[locale];
  const proof = photoStory[locale];
  const faq = cityBeamFaq[locale];
  const canonical = `${siteUrl}${localePath[locale]}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", "@id": `${canonical}#faq`, inLanguage: locale, mainEntity: faq.questions.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Kreluna",
        url: `${siteUrl}/`,
        logo: { "@type": "ImageObject", url: `${siteUrl}/kreluna-logo.png`, width: 128, height: 128 },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Kreluna",
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: Object.values(translations).map((item) => item.lang),
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: t.title,
        description: t.description,
        inLanguage: t.lang,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${canonical}#project` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/citybeam/ny-d020/ny-d020-the-economist-1200.webp`,
          width: 1200,
          height: 800,
        },
        dateModified: "2026-09-30",
      },
      {
        "@type": "Service",
        "@id": `${canonical}#project`,
        name: "CityBeam",
        alternateName: "CityBeam by Kreluna",
        description: t.description,
        provider: { "@id": `${siteUrl}/#organization` },
        url: canonical,
        availableLanguage: Object.values(translations).map((item) => item.lang),
        serviceType: "Digital out-of-home advertising enquiry service",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kreluna", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "CityBeam", item: canonical },
        ],
      },
    ],
  };
  const access = { it: ['Vai al contenuto', 'Scegli la lingua'], en: ['Skip to content', 'Choose language'], fr: ['Aller au contenu', 'Choisir la langue'], es: ['Ir al contenido', 'Elegir idioma'], de: ['Zum Inhalt', 'Sprache wählen'] }[locale];
  return (
    <div className="citybeam-page" lang={t.lang}>
      <a className="skip-link" href="#main-content">{access[0]}</a>
      <header className="citybeam-header">
        <a className="citybeam-brand" href={locale === "it" ? "/" : `/${locale}`} aria-label={`Kreluna · CityBeam — ${t.navHome}`}><svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="6" fill="#c4f455" /><g fill="none" stroke="#121212" strokeWidth="2.2" strokeLinecap="round"><path d="M12 6v12M17.196 9 6.804 15m0-6 10.392 6" /></g></svg><span>CITYBEAM <small>BY KRELUNA</small></span></a>
        <nav aria-label="CityBeam"><a href="#come-funziona">{t.navHow}</a><a href="#formule">{t.navFor}</a><a href="#richiesta">{t.navContact} ↗</a></nav>
        <nav className="citybeam-language" aria-label={access[1]}>
          {(Object.keys(localePath) as CityBeamLocale[]).map((code) => <a key={code} href={localePath[code]} lang={code} aria-label={{it:'Italiano',en:'English',fr:'Français',es:'Español',de:'Deutsch'}[code]} aria-current={code === locale ? "page" : undefined} hrefLang={code}>{code.toUpperCase()}</a>)}
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className="citybeam-hero">
          <div className="citybeam-copy"><span className="citybeam-kicker">{t.kicker}</span><h1>{t.h1a}<em>{t.h1b}</em></h1><p>{t.intro}</p>
            <div className="citybeam-actions"><a className="button citybeam-primary" href="#richiesta">{t.info} <span aria-hidden="true">↗</span></a><a className="citybeam-text-link" href="#schermo">{t.discover} <span aria-hidden="true">↓</span></a></div><span className="citybeam-micro">{t.micro}</span>
          </div>
          <CityBeamProofPhoto {...proof.images[2]} hero scene={t.destination} label={t.enlarge} />
          <div className="citybeam-facts">{t.facts.map((fact, index) => <span key={fact}><i aria-hidden="true">{['↗', '▣', '◉'][index]}</i>{fact}</span>)}<span className="citybeam-source">{proof.credit}</span></div>
        </section>
        <section className="citybeam-section citybeam-why" aria-labelledby="citybeam-why-title">
          <div className="citybeam-section-heading"><span className="citybeam-kicker">{t.whyKicker}</span><h2 id="citybeam-why-title">{t.whyTitle}</h2></div>
          <div className="citybeam-benefits">{t.benefits.map(([title, text], index) => <article key={title}><span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>
        <section className="citybeam-section citybeam-photo-story" id="schermo" aria-labelledby="citybeam-photo-title">
          <div className="citybeam-photo-intro"><div className="citybeam-section-heading"><span className="citybeam-kicker">{t.galleryKicker}</span><h2 id="citybeam-photo-title">{t.galleryTitle}</h2></div><p>{t.galleryIntro}</p></div>
          <div className="citybeam-proof-grid">{[proof.images[0], proof.images[3], proof.images[4]].map((photo, index) => <CityBeamProofPhoto key={photo.file} {...photo} scene={t.scenes[index]} label={t.enlarge} />)}</div>
          <p className="citybeam-photo-note">{proof.credit} {proof.note}</p>
        </section>
        <section className="citybeam-formats" id="formule" aria-labelledby="citybeam-formats-title"><div className="citybeam-section">
          <div className="citybeam-section-heading"><span className="citybeam-kicker">{t.formatsKicker}</span><h2 id="citybeam-formats-title">{t.formatsTitle}</h2><p>{t.formatsIntro}</p></div>
          <div className="citybeam-plan-grid">{t.plans.map(([name, headline, body, footnote], index) => <article className="citybeam-plan" key={name}><span className="citybeam-plan-name">{name}</span><h3>{headline}</h3><p>{body}</p><div className="citybeam-plan-footer"><span>{footnote}</span><strong>{t.quote}</strong><a className="button" href="#richiesta" data-cb-plan={index === 0 ? 'daily' : 'roadblock'}>{t.choose} <span aria-hidden="true">↗</span></a></div></article>)}</div><p className="citybeam-price-note">{t.priceNote}</p>
        </div></section>
        <section className="citybeam-section" id="come-funziona"><div className="citybeam-section-heading"><span className="citybeam-kicker">{t.howKicker}</span><h2>{t.howTitle}</h2><p>{t.howIntro}</p></div><ol className="citybeam-steps">{t.steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
        <section className="citybeam-section citybeam-request" id="richiesta" aria-labelledby="citybeam-request-title">
          <div className="citybeam-section-heading"><span className="citybeam-kicker">{t.requestKicker}</span><h2 id="citybeam-request-title">{t.requestTitle}</h2><p>{t.requestText}</p><div className="citybeam-person"><span aria-hidden="true">i</span><div><strong>{t.office}</strong><span>Kreluna · CityBeam</span></div></div><p className="citybeam-direct">{t.direct}<br /><a href={`mailto:info@kreluna.it?subject=${encodeURIComponent(t.emailSubject)}`}>info@kreluna.it ↗</a></p></div>
          <div className="citybeam-request-panel">
            <form className="citybeam-enquiry" data-cb-enquiry hidden data-subject={t.emailSubject} data-intro={t.mailIntro} data-labels={JSON.stringify(t.mailLabels)} data-status={t.emailStatus}>
              <label htmlFor="cb-plan">{t.planLabel}</label><select id="cb-plan" name="format" defaultValue="advice"><option value="advice">{t.undecided}</option><option value="daily">{t.plans[0][0]} — {t.plans[0][1]}</option><option value="roadblock">{t.plans[1][0]} — {t.plans[1][1]}</option></select>
              <label htmlFor="cb-date">{t.dateLabel}</label><input id="cb-date" name="date" type="date" />
              <label htmlFor="cb-idea">{t.ideaLabel}</label><textarea id="cb-idea" name="idea" rows={4} maxLength={1200} required placeholder={t.ideaPlaceholder} />
              <button type="submit" className="button citybeam-primary">{t.emailButton}<span aria-hidden="true">↗</span></button><p className="citybeam-email-note">{t.emailNote}</p><p className="citybeam-email-status" role="status" aria-live="polite" />
            </form>
            <p className="citybeam-note">{t.disclosure}</p>
          </div>
        </section>
        <section className="citybeam-section citybeam-faq" id="faq"><div className="citybeam-section-heading"><h2>{faq.title}</h2></div><div className="home-faq">{faq.questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
        <details className="citybeam-updates"><summary>{t.updates}</summary><LaunchSignup project="citybeam" locale={locale} /></details>
      </main>
      <footer className="citybeam-footer"><span>© 2026 Kreluna · {t.provisional}</span><span>P. IVA 02114130475 · REA PT-622714</span><a href={locale === 'it' ? '/privacy' : '/en/privacy'}>Privacy</a></footer>
      <dialog className="citybeam-lightbox" aria-label={t.enlarge}><button type="button" data-cb-close aria-label={t.close}>×</button><figure><img alt="" /><figcaption /></figure></dialog>
      <script src="/assets/citybeam-experience.js" defer />
      <script id="citybeam-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
