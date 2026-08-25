import type { Metadata } from "next";
import Link from "next/link";
import RestaurantWaitlist from "./restaurant-waitlist";

const siteUrl = "https://www.kreluna.it";
const pageUrl = `${siteUrl}/en/velvet-table/restaurants`;
const title = "Velvet Table for Restaurants | New York early access";
const description = "Velvet Table is a restaurant booking concept that lets guests book normally or request a specific table through a planned optional €15 table-selection experience.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "restaurant reservation technology",
    "restaurant table selection",
    "restaurant revenue ideas",
    "New York restaurant pilot",
    "Velvet Table for restaurants",
  ],
  robots: { index: true, follow: true, "max-image-preview": "large" },
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    locale: "en_US",
    siteName: "Kreluna",
    images: [{ url: `${siteUrl}/velvet-table/og.jpg`, width: 1200, height: 630, alt: "Velvet Table for Restaurants — early access" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/velvet-table/og.jpg`] },
};

const steps = [
  ["Map the room", "The restaurant defines tables, zones and the characteristics it is willing to make selectable."],
  ["Keep standard booking", "Guests can still request a normal reservation without paying a table-selection fee."],
  ["Offer a specific table", "A guest who wants an eligible exact table can choose the planned €15 selection option."],
  ["Confirm every request", "The restaurant remains responsible for availability, operational constraints and final confirmation."],
];

const safeguards = [
  ["Optional for the guest", "The €15 option applies only when a guest chooses an eligible specific table. A normal reservation path remains available."],
  ["Controlled by the restaurant", "The venue decides which tables can be selected and when. Velvet Table does not promise availability on the restaurant’s behalf."],
  ["Commercial terms first", "The planned customer price is €15. Restaurant participation terms and any revenue allocation will be stated before activation."],
];

const faqs = [
  ["Is Velvet Table live now?", "No. Velvet Table is in development. This page collects interest for a possible New York restaurant pilot."],
  ["Does every booking cost €15?", "No. Guests may still request a normal reservation. The planned €15 charge is only for choosing an eligible specific table."],
  ["Does the restaurant receive the full €15?", "No revenue share is promised on this page. Commercial terms will be communicated clearly before any restaurant joins the pilot."],
  ["Can a restaurant reject or change a table request?", "The restaurant keeps operational control. Availability and any necessary change must be confirmed transparently with the guest."],
];

export default function VelvetRestaurantsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Kreluna", url: `${siteUrl}/` },
      { "@type": "WebPage", "@id": `${pageUrl}#webpage`, url: pageUrl, name: title, description, inLanguage: "en-US", about: { "@id": `${pageUrl}#service` }, dateModified: "2026-08-25" },
      { "@type": "Service", "@id": `${pageUrl}#service`, name: "Velvet Table for Restaurants", serviceType: "Restaurant booking and table-selection concept", description, provider: { "@id": `${siteUrl}/#organization` }, areaServed: { "@type": "City", name: "New York" }, audience: { "@type": "BusinessAudience", audienceType: "Restaurant owners and managers" } },
      { "@type": "FAQPage", "@id": `${pageUrl}#faq`, inLanguage: "en-US", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Kreluna", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: "Velvet Table", item: `${siteUrl}/en/velvet-table` }, { "@type": "ListItem", position: 3, name: "For restaurants", item: pageUrl }] },
    ],
  };

  return (
    <div className="velvet-page restaurant-landing" lang="en-US">
      <a className="skip-link" href="#restaurant-main">Skip to content</a>
      <header className="velvet-page-header restaurant-header">
        <Link className="velvet-page-brand" href="/" aria-label="Kreluna home">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/kreluna-logo.png" width="46" height="46" alt="" /><span>KRELUNA</span></Link>
        <nav className="velvet-section-nav" aria-label="Restaurant page navigation"><a href="#model">How it works</a><a href="#principles">Clear terms</a><a href="#faq">FAQ</a></nav>
        <a className="button button-small velvet-page-button" href="#restaurant-early-access">Join early access</a>
      </header>

      <main id="restaurant-main">
        <section className="restaurant-hero section-shell">
          <div className="restaurant-hero-copy">
            <div className="restaurant-status"><span /> Coming soon · for restaurants</div>
            <h1>Let guests book normally.<br /><em>Let the right table become a choice.</em></h1>
            <p>Velvet Table is exploring a New York pilot for restaurants that want to make selected tables discoverable by atmosphere, position and view—while keeping operational control.</p>
            <div className="hero-actions restaurant-actions"><a className="button velvet-page-button" href="#restaurant-early-access">Join restaurant early access</a><a className="button button-secondary" href="#model">See the model</a></div>
            <p className="velvet-disclosure">Concept in development. No venue, launch date, revenue outcome or table availability is promised.</p>
          </div>
          <div className="restaurant-dashboard" aria-label="Conceptual Velvet Table restaurant dashboard">
            <div className="dashboard-top"><span>VELVET TABLE · ROOM</span><strong>Friday evening</strong></div>
            <div className="room-plan" aria-hidden="true">
              <span className="table-node table-one">A1<small>Window</small></span>
              <span className="table-node table-two">A2<small>Dining room</small></span>
              <span className="table-node table-three selected">T7<small>Terrace · €15</small></span>
              <span className="table-node table-four">G3<small>Garden</small></span>
              <span className="flow-line flow-one" /><span className="flow-line flow-two" />
            </div>
            <div className="dashboard-summary"><span><small>Standard booking</small><strong>Available</strong></span><span><small>Specific table</small><strong>Optional €15</strong></span><span><small>Final control</small><strong>Restaurant</strong></span></div>
            <p>Conceptual interface · not a live reservation screen</p>
          </div>
        </section>

        <section className="restaurant-value section-shell" id="model">
          <div className="restaurant-section-intro"><div className="eyebrow velvet-text"><i /> The proposed model</div><h2>One booking journey.<br />Two clear choices.</h2><p>Velvet Table is designed to separate a standard reservation from the optional selection of an eligible exact table.</p></div>
          <div className="restaurant-choice-grid">
            <article><span>01 · STANDARD</span><h3>Book without selecting a specific table</h3><p>The guest sends a normal reservation request. The restaurant assigns the table according to availability and operations.</p><strong>No table-selection fee</strong></article>
            <article className="featured"><span>02 · OPTIONAL</span><h3>Choose an eligible specific table</h3><p>The guest sees a table’s position or atmosphere and requests that exact option, subject to restaurant confirmation.</p><strong>Planned customer price: €15</strong></article>
          </div>
        </section>

        <section className="restaurant-process section-shell">
          <div className="velvet-section-heading"><div className="eyebrow velvet-text"><i /> Restaurant workflow</div><h2>Designed around real service constraints.</h2></div>
          <ol className="velvet-process-grid">{steps.map(([stepTitle, body], index) => <li key={stepTitle}><span>{String(index + 1).padStart(2, "0")}</span><h3>{stepTitle}</h3><p>{body}</p></li>)}</ol>
        </section>

        <section className="restaurant-principles section-shell" id="principles">
          <div className="restaurant-section-intro"><div className="eyebrow velvet-text"><i /> Clear from the start</div><h2>No hidden fee.<br />No loss of control.</h2><p>The pilot proposition must be understandable before a restaurant—or a guest—takes action.</p></div>
          <div className="restaurant-principle-grid">{safeguards.map(([itemTitle, body], index) => <article key={itemTitle}><span>{String(index + 1).padStart(2, "0")}</span><h3>{itemTitle}</h3><p>{body}</p></article>)}</div>
        </section>

        <section className="restaurant-signup section-shell" id="restaurant-early-access">
          <div className="restaurant-signup-copy"><div className="restaurant-status"><span /> New York pilot · interest list</div><h2>Be among the restaurants we contact first.</h2><p>Join the interest list to receive confirmed information about the pilot, participation requirements and commercial terms. Joining the list does not create an obligation.</p><ul><li>Restaurant-focused pilot updates</li><li>Clear terms before activation</li><li>No generic marketing messages</li></ul></div>
          <RestaurantWaitlist />
        </section>

        <section className="velvet-faq section-shell" id="faq"><div className="velvet-section-heading"><div className="eyebrow velvet-text"><i /> Frequently asked questions</div><h2>The model, without premature promises.</h2></div><div className="velvet-faq-list">{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section>

        <section className="velvet-closing restaurant-closing"><div><div className="restaurant-status"><span /> Coming soon · Velvet Table</div><h2>A better table choice starts with a clearer restaurant model.</h2><p>Explore the customer concept or join restaurant early access.</p></div><div className="restaurant-closing-actions"><a className="button velvet-page-button" href="#restaurant-early-access">Join early access</a><Link className="button button-secondary" href="/en/velvet-table">View the customer concept</Link></div></section>
      </main>
      <footer className="velvet-page-footer section-shell"><Link href="/">Kreluna</Link><span>Velvet Table · restaurant concept in development</span><a href="/en/privacy.html">Privacy</a></footer>
      <script id="velvet-restaurants-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
