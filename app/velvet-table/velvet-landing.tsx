import Link from "next/link";
import { siteUrl, velvetCopy, velvetUrls, type VelvetLocale } from "./velvet-content";
import { velvetIntentContent, velvetSeoDescriptions } from "./velvet-intents";
import { velvetMethodology } from "./velvet-methodology";
import VelvetWaitlist from "./velvet-waitlist";

const languageNames: Record<VelvetLocale, string> = { it: "IT", en: "EN", fr: "FR", es: "ES", de: "DE" };

export default function VelvetLanding({ locale }: { locale: VelvetLocale }) {
  const copy = velvetCopy[locale];
  const intentContent = velvetIntentContent[locale];
  const methodology = velvetMethodology[locale];
  const description = velvetSeoDescriptions[locale];
  const faqs = [...copy.faqs, ...intentContent.faqs];
  const pageUrl = velvetUrls[locale];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Kreluna", legalName: "Gadducci Andrea", url: `${siteUrl}/`, taxID: "02114130475", identifier: { "@type": "PropertyValue", propertyID: "REA", value: "PT-622714" }, address: { "@type": "PostalAddress", addressLocality: "Chiesina Uzzanese", addressRegion: "PT", addressCountry: "IT" } },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: `${siteUrl}/`, name: "Kreluna", publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: Object.values(velvetCopy).map((item) => item.locale) },
      { "@type": "WebPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: copy.title, description, inLanguage: copy.locale, isPartOf: { "@id": `${siteUrl}/#website` }, about: { "@id": `${pageUrl}#service` }, primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/velvet-table/hero.jpg`, width: 1600, height: 1067 }, dateModified: "2026-08-25" },
      { "@type": "Service", "@id": `${pageUrl}#service`, name: "Velvet Table", alternateName: "Velvet Table by Kreluna", serviceType: copy.serviceType, description, provider: { "@id": `${siteUrl}/#organization` }, url: pageUrl, areaServed: "Worldwide", availableLanguage: Object.values(velvetCopy).map((item) => item.locale), audience: { "@type": "Audience", audienceType: copy.audience }, additionalProperty: { "@type": "PropertyValue", name: "Created with", value: "Helix" } },
      { "@type": "ItemList", "@id": `${pageUrl}#occasions`, name: intentContent.title, inLanguage: copy.locale, itemListElement: intentContent.intents.map((intent, index) => ({ "@type": "ListItem", position: index + 1, name: intent.title, description: intent.body })) },
      { "@type": "ItemList", "@id": `${pageUrl}#methodology`, name: methodology.title, inLanguage: copy.locale, itemListElement: methodology.items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, description: item.body })) },
      { "@type": "BreadcrumbList", "@id": `${pageUrl}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Kreluna", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: "Velvet Table", item: pageUrl }] },
      { "@type": "FAQPage", "@id": `${pageUrl}#faq`, inLanguage: copy.locale, mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    ],
  };

  return (
    <div className="velvet-page" lang={copy.locale}>
      <a className="skip-link" href="#velvet-main">{copy.skip}</a>
      <header className="velvet-page-header">
        <Link className="velvet-page-brand" href="/" aria-label={copy.brandAria}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/kreluna-logo.png" width="46" height="46" alt="" /><span>KRELUNA</span></Link>
        <nav className="velvet-section-nav" aria-label={copy.navAria}><a href="#come-funziona">{copy.nav[0]}</a><a href="#atmosfere">{copy.nav[1]}</a><a href="#faq">{copy.nav[2]}</a></nav>
        <div className="velvet-header-actions">
          <nav className="velvet-language-nav" aria-label="Language selector">{(Object.keys(languageNames) as VelvetLocale[]).map((lang) => <a key={lang} href={velvetUrls[lang]} hrefLang={lang} lang={lang} aria-current={lang === locale ? "page" : undefined}>{languageNames[lang]}</a>)}</nav>
          <a className="button button-small velvet-page-button" href={locale === "it" ? "#lista-attesa" : "mailto:krelunaid@gmail.com?subject=Velvet%20Table"}>{copy.follow}</a>
        </div>
      </header>
      <main id="velvet-main">
        <section className="velvet-page-hero section-shell">
          <div className="velvet-page-glow" aria-hidden="true" />
          <div className="velvet-page-hero-copy"><div className="eyebrow velvet-text"><i /> {copy.kicker}</div><h1>{copy.hero[0]}<br /><em>{copy.hero[1]}</em></h1><p>{copy.lead}</p><div className="hero-actions"><a className="button velvet-page-button" href="#come-funziona">{copy.discover}</a><Link className="button button-secondary" href="/">{copy.back}</Link></div><p className="velvet-disclosure">{copy.disclosure}</p></div>
          <figure className="velvet-app-hero">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/velvet-table/hero.jpg" width="1600" height="1067" alt={copy.heroAlt} fetchPriority="high" /><figcaption><span>01</span><strong>{copy.heroCaption[0]}</strong><small>{copy.heroCaption[1]}</small></figcaption></figure>
        </section>
        <section className="velvet-definition section-shell"><div className="eyebrow velvet-text"><i /> {copy.definitionKicker}</div><div className="velvet-definition-grid"><h2>{copy.definitionTitle}</h2><div><p>{copy.definition[0]}</p><p>{copy.definition[1]}</p></div></div></section>
        <section className="velvet-process section-shell" id="come-funziona"><div className="velvet-section-heading"><div className="eyebrow velvet-text"><i /> {copy.processKicker}</div><h2>{copy.processTitle}</h2></div><ol className="velvet-process-grid">{copy.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol></section>
        <section className="velvet-atmospheres section-shell" id="atmosfere"><div className="velvet-section-heading"><div className="eyebrow velvet-text"><i /> {copy.moodsKicker}</div><h2>{copy.moodsTitle[0]}<br />{copy.moodsTitle[1]}</h2></div><p className="velvet-original-note">{copy.originalNote}</p><div className="velvet-atmosphere-grid">{copy.moods.map((mood, index) => <article key={mood.name}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={mood.image} width="1400" height="933" loading="lazy" alt={mood.alt} /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{mood.name}</h3><p>{mood.copy}</p></div></article>)}</div></section>
        <section className="velvet-intents section-shell" id="occasioni"><div className="velvet-section-heading"><div className="eyebrow velvet-text"><i /> {intentContent.kicker}</div><h2>{intentContent.title}</h2><p className="velvet-intents-intro">{intentContent.intro}</p></div><div className="velvet-intent-grid">{intentContent.intents.map((intent, index) => <article key={intent.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{intent.title}</h3><p>{intent.body}</p></article>)}</div></section>
        <section className="velvet-methodology section-shell" id="criteri"><div className="velvet-section-heading"><div className="eyebrow velvet-text"><i /> {methodology.kicker}</div><h2>{methodology.title}</h2><p className="velvet-intents-intro">{methodology.intro}</p></div><ol className="velvet-process-grid">{methodology.items.map((item, index) => <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol><p className="velvet-methodology-note">{methodology.note}</p></section>
        {locale === "it" && <VelvetWaitlist />}
        <section className="velvet-faq section-shell" id="faq"><div className="velvet-section-heading"><div className="eyebrow velvet-text"><i /> {copy.faqKicker}</div><h2>{copy.faqTitle}</h2></div><div className="velvet-faq-list">{faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div></section>
        <section className="velvet-closing section-shell"><div><div className="eyebrow velvet-text"><i /> Velvet Table by Kreluna</div><h2>{copy.closingTitle}</h2><p>{copy.closingBody}</p></div><a className="button velvet-page-button" href={locale === "it" ? "#lista-attesa" : "mailto:krelunaid@gmail.com?subject=Velvet%20Table%20project"}>{copy.closingCta}</a></section>
      </main>
      <footer className="velvet-page-footer"><Link href="/">Kreluna</Link><span>{copy.footer}</span><a href="/privacy.html">Privacy</a></footer>
      <script id="velvet-table-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
