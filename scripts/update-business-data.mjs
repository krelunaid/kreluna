import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve("public");

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith(".html") ? [file] : [];
  }))).flat();
}

const oldIt = "Kreluna è un progetto in fase di costituzione in Italia. I dati societari e fiscali saranno pubblicati quando disponibili.";
const newIt = "Kreluna · P. IVA 02114130475 · REA PT-622714";
const oldEn = "Kreluna is an early-stage project in formation in Italy. Company and VAT details will be published when available.";
const newEn = "Kreluna · VAT no. 02114130475 · REA PT-622714";
const oldOrganization = '"name":"Kreluna","url":"https://www.kreluna.it/","logo":{"@type":"ImageObject","@id":"https://www.kreluna.it/#logo","url":"https://www.kreluna.it/assets/logo.png"},"email":"krelunaid@gmail.com"';
const newOrganization = '"name":"Kreluna","url":"https://www.kreluna.it/","logo":{"@type":"ImageObject","@id":"https://www.kreluna.it/#logo","url":"https://www.kreluna.it/assets/logo.png"},"email":"krelunaid@gmail.com","taxID":"02114130475","identifier":{"@type":"PropertyValue","propertyID":"REA","value":"PT-622714"}';

const contentReplacements = [
  ["Informazioni privacy Kreluna | Documento provvisorio", "Informativa privacy Kreluna"],
  ["Informazioni provvisorie sul trattamento dei dati del sito Kreluna, in attesa della definizione e verifica legale del titolare.", "Informativa sul trattamento dei dati personali del sito Kreluna e sui contatti con il titolare."],
  ["Documento provvisorio · noindex", "Informativa aggiornata · noindex"],
  ["Informazioni privacy provvisorie", "Informativa privacy"],
  ["Questa pagina descrive in modo prudente il sito nello stato attuale. Non è ancora l’informativa legale definitiva: l’identità completa del titolare e i dati societari devono essere pubblicati e verificati prima di attivare account, pagamenti o raccolte strutturate di dati.", "Il servizio è presentato con il marchio Kreluna, P. IVA 02114130475, REA PT-622714. Contatto: krelunaid@gmail.com."],
  ["<p class=\"notice\"><strong>Verifica legale necessaria.</strong> Questa pagina è pubblicata per trasparenza durante il pre-lancio e non sostituisce un documento redatto sui dati reali del titolare.</p>", "<p class=\"notice\"><strong>Ultimo aggiornamento: 23 agosto 2026.</strong> La via non è pubblicata per tutela della sede privata; i contatti ufficiali restano disponibili tramite email.</p>"],
  ["Prima dell’attivazione dei servizi", "Diritti dell’interessato"],
  ["Prima di offrire account, prove operative, pagamenti o trattamenti ulteriori, questa pagina dovrà essere sostituita con un’informativa completa che identifichi il titolare, basi giuridiche, destinatari, tempi di conservazione e diritti applicabili.", "Puoi chiedere accesso, rettifica, cancellazione, limitazione, opposizione o portabilità quando applicabile scrivendo alla email indicata. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali."],
  ["Termini Kreluna | Informazioni provvisorie", "Condizioni d’uso del sito Kreluna"],
  ["Informazioni provvisorie sull’uso del sito Kreluna durante la fase di pre-lancio; account e acquisti online non sono ancora attivi.", "Condizioni per l’uso del sito informativo Kreluna, presentato da Kreluna."],
  ["Condizioni provvisorie del sito", "Condizioni d’uso del sito"],
  ["Kreluna è in fase di sviluppo e pre-lancio. Questa pagina chiarisce l’uso informativo del sito; non costituisce ancora un contratto di servizio e dovrà essere sostituita da termini definitivi prima dell’attivazione commerciale.", "Il sito è pubblicato con il marchio Kreluna, P. IVA 02114130475, REA PT-622714. Il sito presenta progetti e servizi in sviluppo e non attiva automaticamente contratti o acquisti."],
  ["Versione definitiva", "Contatti e legge applicabile"],
  ["Prima di vendere servizi o attivare account saranno pubblicati termini completi con soggetto contraente, prezzi e imposte, durata, rinnovo, recesso, responsabilità, livelli di servizio e legge applicabile.", "Per richieste puoi scrivere ad krelunaid@gmail.com o krelunaid@gmail.com. Ai contenuti e all’uso del sito si applica la legge italiana, fatti salvi i diritti inderogabili eventualmente riconosciuti agli utenti."],
  ["Cookie policy Kreluna | Stato attuale", "Cookie policy Kreluna"],
  ["<p class=\"notice\"><strong>Verifica legale necessaria.</strong> Questa pagina è pubblicata per trasparenza durante il pre-lancio e non sostituisce un documento redatto sui dati reali del titolare.</p>", "<p class=\"notice\"><strong>Ultimo aggiornamento: 23 agosto 2026.</strong> Titolare: Kreluna, impresa individuale, P. IVA 02114130475, REA PT-622714, Italia.</p>"],
  ["Provisional privacy information", "Kreluna privacy notice"],
  ["Kreluna privacy information | Provisional notice", "Kreluna privacy notice"],
  ["Provisional information about data handling on the Kreluna website while the controller and legal documentation are being finalised.", "Privacy information for the Kreluna website and email enquiries sent to the data controller."],
  ["Provisional document · noindex", "Updated information · noindex"],
  ["This page describes the website conservatively in its current state. It is not yet the final legal privacy notice: complete controller and company details must be published and reviewed before accounts, payments or structured data collection are enabled.", "The service is presented under the Kreluna brand, VAT no. 02114130475, REA PT-622714. Contact: krelunaid@gmail.com."],
  ["<p class=\"notice\"><strong>Legal review required.</strong> This page is published for transparency during pre-launch and is not a substitute for documentation based on the controller’s verified details.</p>", "<p class=\"notice\"><strong>Last updated: 23 August 2026.</strong> The street address is not published because it is a private location; the contact is available by email.</p>"],
  ["Before services are activated", "Your data-protection rights"],
  ["Before accounts, pilots, payments or additional processing are enabled, this page must be replaced with a complete notice identifying the controller, legal bases, recipients, retention and applicable rights.", "You may request access, correction, erasure, restriction, objection or portability where applicable by writing to the email above. You may also lodge a complaint with the Italian Data Protection Authority."],
  ["Provisional terms of use", "Website terms of use"],
  ["Kreluna website terms | Provisional information", "Kreluna website terms of use"],
  ["Provisional information about use of the Kreluna website during pre-launch; accounts and online purchases are not yet active.", "Terms for using the informational Kreluna website, operated by the Kreluna."],
  ["Provisional website terms", "Website terms of use"],
  ["Kreluna is an Italian early-stage project in development and formation. This page explains the informational use of the website; it is not yet a service contract and must be replaced by final terms before commercial activation.", "Kreluna is Kreluna project, sole proprietorship, VAT no. 02114130475, REA PT-622714, based in Italy. The website presents projects and services in development and does not automatically create contracts or purchases."],
  ["Before services are sold or accounts enabled, complete terms will identify the contracting party, prices and taxes, term, renewal, cancellation, liability, service levels and governing law.", "For enquiries, email krelunaid@gmail.com. Italian law applies to the website, without prejudice to any mandatory rights available to users."],
  ["Kreluna is in development and pre-launch. This page explains the informational use of the website; it is not yet a service contract and must be replaced by final terms before commercial activation.", "Kreluna is Kreluna project, sole proprietorship, VAT no. 02114130475, REA PT-622714, based in Italy. The website presents projects and services in development and does not automatically create contracts or purchases."],
  ["Final terms", "Contact and applicable law"],
  ["Before services are sold or accounts are activated, complete terms will be published covering the contracting party, prices and taxes, duration, renewal, withdrawal, liability, service levels and governing law.", "For enquiries, email krelunaid@gmail.com. Italian law applies to the website, without prejudice to any mandatory rights available to users."],
];

const aboutReplacements = [
  ["Kreluna è già una società costituita?", "Chi gestisce Kreluna?"],
  ["Il sito dichiara attualmente un progetto in fase di costituzione in Italia. I dati societari e fiscali saranno pubblicati quando disponibili.", "Kreluna è un ecosistema digitale italiano, P. IVA 02114130475, REA PT-622714."],
  ["Kreluna è un progetto italiano in fase di sviluppo e costituzione.", "Kreluna è un progetto digitale italiano presentato da Kreluna."],
  ["<li>Dati societari pubblicati quando disponibili</li>", "<li>Dati dell’impresa pubblicati e verificabili</li>"],
  ["Kreluna è un progetto in sviluppo e in fase di costituzione in Italia. Questa pagina distingue direzione, attività esplorate e informazioni che potranno essere pubblicate solo quando saranno verificabili.", "Kreluna è un progetto digitale italiano dell’Kreluna. Questa pagina distingue l’attività dell’impresa, la direzione del progetto e le capacità ancora in sviluppo."],
  ["Is Kreluna an incorporated company?", "Who operates Kreluna?"],
  ["Is Kreluna already an incorporated company?", "Who operates Kreluna?"],
  ["The site currently states that Kreluna is a project in the process of formation in Italy. Legal and tax details will be published when available.", "Kreluna is the digital brand of the Kreluna, VAT no. 02114130475, REA PT-622714, based in Italy."],
  ["Kreluna is an Italian early-stage project in development and formation.", "Kreluna is an Italian digital project operated by the Kreluna."],
  ["<li>Company details published when available</li>", "<li>Published and verifiable business details</li>"],
  ["Kreluna is a project in development and in the process of formation in Italy. This page separates direction, explored capabilities and facts that can only be published when verified.", "Kreluna is an Italian digital project operated by the Kreluna. This page separates the business, the project direction and capabilities that remain in development."],
  ["<article class=\"card\"><h3>Company information</h3><p>Legal entity, tax and registered-office details will be added when available; current status remains explicit.</p></article>", "<article class=\"card\"><h3>Company information</h3><p>Operator, VAT, REA and municipality are published; the private street address is intentionally omitted.</p></article>"],
];

for (const file of await htmlFiles(publicDir)) {
  let html = await readFile(file, "utf8");
  html = html.replaceAll(oldIt, newIt).replaceAll(oldEn, newEn).replaceAll(oldOrganization, newOrganization);
  html = html.replaceAll('"dateModified":"2026-08-14"', '"dateModified":"2026-08-23"');
  html = html.replaceAll('property="article:modified_time" content="2026-08-14"', 'property="article:modified_time" content="2026-08-23"');
  for (const [from, to] of contentReplacements) html = html.replaceAll(from, to);
  if (file.endsWith("azienda.html") || file.endsWith("en/about.html")) {
    for (const [from, to] of aboutReplacements) html = html.replaceAll(from, to);
  }
  await writeFile(file, html);
}
