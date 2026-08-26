import type { Metadata } from "next";
import Link from "next/link";
import "../../../../velvet-table/velvet.css";

const siteUrl = "https://www.kreluna.it";
const pageUrl = `${siteUrl}/en/velvet-table/restaurants/founding-100`;

export const metadata: Metadata = {
  title: "Velvet Table Founding 100 | Restaurant program summary",
  description: "Summary of the proposed Velvet Table Founding 100 introductory program for eligible New York restaurants.",
  robots: { index: false, follow: true },
  alternates: { canonical: pageUrl },
};

const terms = [
  ["Who can qualify", "The first 100 eligible New York restaurant locations that complete verification, onboarding and written acceptance of the final pilot agreement. An email submission alone does not secure a place."],
  ["Introductory period", "Twelve consecutive months beginning on the restaurant location’s activation date in the Velvet Table pilot."],
  ["Guest price", "The planned U.S. price is $15 for an optional request to select an eligible specific table. A standard reservation remains available without this table-selection fee."],
  ["Founding restaurant allocation", "For each completed paid table selection during the introductory period, the restaurant receives $15 and Kreluna applies a $0 platform fee. Kreluna absorbs standard payment-processing costs during the offer."],
  ["After month 12", "The proposed standard allocation is $12 to the restaurant and a $3 Kreluna platform fee. It will apply only after prior written notice and acceptance of the definitive commercial terms."],
  ["Operational control", "The restaurant decides which tables are eligible and retains control over availability and final confirmation. Velvet Table does not guarantee a table on the restaurant’s behalf."],
  ["Exceptions", "Refunds, chargebacks, reversals, taxes, non-completed reservations, no-shows and exceptional payment costs will be handled under the final pilot agreement and the checkout policy shown to the guest."],
  ["Status of this summary", "Velvet Table is not yet active. This page is a plain-language promotional summary, not the definitive pilot agreement. The final agreement must be provided and accepted before activation."],
];

export default function FoundingTermsPage() {
  return (
    <div className="velvet-page founding-terms-page" lang="en-US">
      <a className="skip-link" href="#founding-main">Skip to content</a>
      <header className="velvet-page-header restaurant-header"><Link className="velvet-page-brand" href="/" aria-label="Kreluna home">KRELUNA</Link><Link className="button button-small velvet-page-button" href="/en/velvet-table/restaurants#restaurant-early-access">Join interest list</Link></header>
      <main id="founding-main" className="founding-terms-main section-shell">
        <div className="restaurant-status"><span /> Coming soon · program summary</div>
        <h1>Velvet Table<br /><em>Founding 100.</em></h1>
        <p className="founding-terms-lead">A clear summary of the proposed introductory benefit for eligible New York restaurants. Final legal, payment and tax terms will be provided before any restaurant is activated.</p>
        <div className="founding-terms-highlight"><span>FIRST 12 MONTHS</span><strong>$15 restaurant</strong><strong>$0 Kreluna platform fee</strong></div>
        <div className="founding-terms-list">{terms.map(([heading, body], index) => <section key={heading}><span>{String(index + 1).padStart(2,"0")}</span><div><h2>{heading}</h2><p>{body}</p></div></section>)}</div>
        <div className="founding-terms-actions"><Link className="button velvet-page-button" href="/en/velvet-table/restaurants#restaurant-early-access">Join restaurant interest list</Link><Link className="button button-secondary" href="/en/velvet-table/restaurants">Back to restaurant page</Link></div>
      </main>
      <footer className="velvet-page-footer section-shell"><Link href="/">Kreluna</Link><span>Velvet Table · concept in development</span><a href="/en/privacy.html">Privacy</a></footer>
    </div>
  );
}
