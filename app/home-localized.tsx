/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import UpcomingProjects from "./upcoming-projects";

export const homeLanguages = { it: 'https://www.kreluna.it/', en: 'https://www.kreluna.it/en', fr: 'https://www.kreluna.it/fr', es: 'https://www.kreluna.it/es', de: 'https://www.kreluna.it/de', 'x-default': 'https://www.kreluna.it/' };
type Locale = 'en' | 'fr' | 'es' | 'de';
const copy = {
  en: {
    title: 'Kreluna | Software, automation and digital projects', description: 'Kreluna helps businesses and professionals turn workflows and ideas into software, automation and digital projects with clear goals and human oversight.',
    heading: 'Useful technology.', subheading: 'Projects taking shape.', projects: 'Projects', contact: 'Contact us', services: 'What we do', discover: 'Explore CityBeam',
    intro: 'We help businesses and professionals turn processes and ideas into practical digital tools. Alongside this work, we develop original products such as CityBeam.',
    methodTitle: 'First the scope. Then the technology.', method: 'We start with a real need, agree on the outcome and build what is useful. Data, access, responsibilities and approval steps are defined before a small pilot. We assess quality, time and exceptions before expanding.',
    cards: [['Software for real work', 'Websites, apps and software designed around a defined business need. Scope, integrations and delivery are agreed for each project.'], ['AI with human oversight', 'Support for documents, research and recurring tasks, with traceable sources and professional review. Decisions remain with the people responsible.'], ['Process automation', 'Connect information and tasks with explicit rules, approvals and exception handling. Measure results before scaling.']],
    launch: 'Pre-launch', city: 'Your moment on the world’s biggest screens.', cityText: 'CityBeam is our project to simplify requests for advertising on iconic digital billboards, starting with Times Square. Partnerships, prices and availability are still being verified. Booking is not yet open.',
    velvet: 'Choose the atmosphere, not just the table.', concept: 'Concept in development', explore: 'Explore the concept',
    resources: 'Practical guides', guide: 'How to choose a website professional', guidePath: '/en/guides/how-to-choose-a-website-professional/', softwareGuide: 'How to choose business software', softwarePath: '/en/guides/how-to-choose-small-business-software/',
    trust: 'Clear responsibilities', trustText: 'We do not claim automatic legal or privacy compliance. Providers, data retention and access controls are assessed for the actual project. Describe your needs in the first message without sending confidential documents.', faq: 'Are the products available to buy?', answer: 'Availability, features, integrations and terms are confirmed for each request. CityBeam is in pre-launch and Velvet Table is a concept in development.',
  },
  fr: {
    title: 'Kreluna | Logiciels, automatisation et projets numériques', description: 'Kreluna accompagne entreprises et professionnels dans leurs projets de logiciels et d’automatisation, avec des objectifs clairs et un contrôle humain.',
    heading: 'Une technologie utile.', subheading: 'Des projets qui prennent forme.', projects: 'Projets', contact: 'Contactez-nous', services: 'Notre activité', discover: 'Découvrir CityBeam',
    intro: 'Nous aidons les entreprises et les professionnels à transformer leurs processus et leurs idées en outils numériques concrets. En parallèle, nous développons des produits originaux comme CityBeam.',
    methodTitle: 'D’abord le périmètre. Ensuite la technologie.', method: 'Nous partons d’un besoin réel, définissons le résultat attendu et construisons ce qui est utile. Données, accès, responsabilités et validations sont précisés avant un petit projet pilote. Nous évaluons la qualité, les délais et les exceptions avant de poursuivre.',
    cards: [['Des logiciels pour le travail réel', 'Sites, applications et logiciels conçus autour d’un besoin précis. Le périmètre, les intégrations et la livraison sont définis pour chaque projet.'], ['Une IA sous contrôle humain', 'Assistance pour les documents, la recherche et les tâches récurrentes, avec des sources vérifiables et une révision professionnelle. Les personnes responsables gardent la décision.'], ['Automatisation des processus', 'Relier informations et tâches avec des règles, des validations et une gestion explicite des exceptions. Mesurer les résultats avant de généraliser.']],
    launch: 'Pré-lancement', city: 'Votre moment sur les plus grands écrans du monde.', cityText: 'CityBeam vise à simplifier les demandes publicitaires sur des écrans numériques emblématiques, à commencer par Times Square. Partenariats, tarifs et disponibilités sont en cours de vérification. Les réservations ne sont pas encore ouvertes.',
    velvet: 'Choisissez l’ambiance, pas seulement la table.', concept: 'Concept en développement', explore: 'Découvrir le concept',
    resources: 'Guides pratiques', guide: 'Choisir un professionnel pour son site web', guidePath: '/fr/guides/choisir-professionnel-creation-site-internet/', softwareGuide: 'Choisir un logiciel de gestion', softwarePath: '/fr/guides/choisir-logiciel-gestion-petite-entreprise/',
    trust: 'Des responsabilités claires', trustText: 'Nous ne promettons pas une conformité juridique automatique. Prestataires, conservation des données et accès sont évalués pour le projet réel. Décrivez votre besoin dans le premier message sans joindre de documents confidentiels.', faq: 'Peut-on déjà acheter les produits ?', answer: 'Disponibilité, fonctions, intégrations et conditions sont confirmées pour chaque demande. CityBeam est en pré-lancement et Velvet Table est un concept en développement.',
  },
  es: {
    title: 'Kreluna | Software, automatización y proyectos digitales', description: 'Kreluna ayuda a empresas y profesionales a convertir procesos e ideas en software, automatización y proyectos digitales con objetivos claros y control humano.',
    heading: 'Tecnología útil.', subheading: 'Proyectos que toman forma.', projects: 'Proyectos', contact: 'Contacta con nosotros', services: 'Qué hacemos', discover: 'Descubrir CityBeam',
    intro: 'Ayudamos a empresas y profesionales a transformar procesos e ideas en herramientas digitales concretas. Al mismo tiempo, desarrollamos productos originales como CityBeam.',
    methodTitle: 'Primero el alcance. Después la tecnología.', method: 'Partimos de una necesidad real, acordamos el resultado y construimos lo que resulta útil. Definimos datos, accesos, responsabilidades y aprobaciones antes de una pequeña prueba piloto. Evaluamos calidad, tiempos y excepciones antes de ampliar.',
    cards: [['Software para el trabajo real', 'Sitios web, aplicaciones y software para una necesidad concreta. Acordamos el alcance, las integraciones y la entrega de cada proyecto.'], ['IA con supervisión humana', 'Apoyo con documentos, investigación y tareas recurrentes, con fuentes verificables y revisión profesional. Las decisiones siguen en manos de las personas responsables.'], ['Automatización de procesos', 'Conectar información y tareas mediante reglas, aprobaciones y gestión de excepciones. Medir resultados antes de ampliar.']],
    launch: 'Prelanzamiento', city: 'Tu momento en las pantallas más grandes del mundo.', cityText: 'CityBeam busca simplificar las solicitudes de publicidad en pantallas digitales emblemáticas, empezando por Times Square. Estamos verificando acuerdos, precios y disponibilidad. Las reservas todavía no están abiertas.',
    velvet: 'Elige el ambiente, no solo la mesa.', concept: 'Concepto en desarrollo', explore: 'Descubrir el concepto',
    resources: 'Guías prácticas', guide: 'Cómo elegir un profesional para tu web', guidePath: '/es/guias/como-elegir-profesional-pagina-web/', softwareGuide: 'Cómo elegir software de gestión', softwarePath: '/es/guias/como-elegir-software-gestion-pequena-empresa/',
    trust: 'Responsabilidades claras', trustText: 'No prometemos un cumplimiento legal automático. Evaluamos proveedores, conservación de datos y accesos para el proyecto concreto. Describe tus necesidades en el primer mensaje sin adjuntar documentos confidenciales.', faq: '¿Ya se pueden comprar los productos?', answer: 'La disponibilidad, las funciones, las integraciones y las condiciones se confirman para cada solicitud. CityBeam está en prelanzamiento y Velvet Table es un concepto en desarrollo.',
  },
  de: {
    title: 'Kreluna | Software, Automatisierung und digitale Projekte', description: 'Kreluna unterstützt Unternehmen und Fachleute bei Software, Automatisierung und digitalen Projekten mit klaren Zielen und menschlicher Kontrolle.',
    heading: 'Nützliche Technologie.', subheading: 'Projekte nehmen Gestalt an.', projects: 'Projekte', contact: 'Kontakt aufnehmen', services: 'Was wir tun', discover: 'CityBeam entdecken',
    intro: 'Wir helfen Unternehmen und Fachleuten, Abläufe und Ideen in praktische digitale Werkzeuge umzusetzen. Parallel entwickeln wir eigene Produkte wie CityBeam.',
    methodTitle: 'Zuerst der Umfang. Dann die Technologie.', method: 'Wir beginnen mit einem konkreten Bedarf, vereinbaren das Ziel und entwickeln das Nötige. Daten, Zugriffe, Zuständigkeiten und Freigaben werden vor einem kleinen Pilotprojekt festgelegt. Vor der Erweiterung bewerten wir Qualität, Zeitaufwand und Ausnahmefälle.',
    cards: [['Software für den Arbeitsalltag', 'Websites, Apps und Software für einen klar definierten Bedarf. Umfang, Schnittstellen und Bereitstellung werden je Projekt vereinbart.'], ['KI unter menschlicher Kontrolle', 'Unterstützung bei Dokumenten, Recherche und wiederkehrenden Aufgaben, mit nachvollziehbaren Quellen und fachlicher Prüfung. Verantwortliche Menschen treffen die Entscheidungen.'], ['Prozesse automatisieren', 'Informationen und Aufgaben durch klare Regeln, Freigaben und den Umgang mit Ausnahmen verbinden. Ergebnisse vor der Ausweitung messen.']],
    launch: 'Vor dem Start', city: 'Dein Moment auf den größten Bildschirmen der Welt.', cityText: 'CityBeam soll Anfragen für Werbung auf bekannten digitalen Großbildschirmen vereinfachen, beginnend am Times Square. Partnerschaften, Preise und Verfügbarkeit werden noch geprüft. Buchungen sind noch nicht möglich.',
    velvet: 'Wähle die Atmosphäre, nicht nur den Tisch.', concept: 'Konzept in Entwicklung', explore: 'Konzept entdecken',
    resources: 'Praktische Ratgeber', guide: 'Einen Website-Profi auswählen', guidePath: '/de/ratgeber/zuverlaessigen-webentwickler-auswaehlen/', softwareGuide: 'Unternehmenssoftware auswählen', softwarePath: '/de/ratgeber/software-kleine-unternehmen-auswaehlen/',
    trust: 'Klare Verantwortlichkeiten', trustText: 'Wir versprechen keine automatische rechtliche Konformität. Anbieter, Datenspeicherung und Zugriffe werden für das konkrete Projekt bewertet. Beschreibe im ersten Kontakt deinen Bedarf, ohne vertrauliche Dokumente zu senden.', faq: 'Sind die Produkte bereits erhältlich?', answer: 'Verfügbarkeit, Funktionen, Schnittstellen und Konditionen werden für jede Anfrage bestätigt. CityBeam befindet sich vor dem Start, Velvet Table ist ein Konzept in Entwicklung.',
  },
};

export function homeMetadata(locale: Locale): Metadata {
  const t = copy[locale];
  return { title: t.title, description: t.description, alternates: { canonical: homeLanguages[locale], languages: homeLanguages }, openGraph: { title: t.title, description: t.description, url: homeLanguages[locale], siteName: 'Kreluna', type: 'website', locale: {en:'en_GB',fr:'fr_FR',es:'es_ES',de:'de_DE'}[locale], images: [{url:'https://www.kreluna.it/og-kreluna.jpg',width:1200,height:630}] }, twitter: {card:'summary_large_image', title:t.title, description:t.description,images:['https://www.kreluna.it/og-kreluna.jpg']} };
}

export default function LocalizedHome({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const prefix = `/${locale}`;
  const access = { en: ['Skip to content', 'Main navigation', 'Choose language'], fr: ['Aller au contenu', 'Navigation principale', 'Choisir la langue'], es: ['Ir al contenido', 'Navegación principal', 'Elegir idioma'], de: ['Zum Inhalt', 'Hauptnavigation', 'Sprache wählen'] }[locale];
  const contact = {en:'/en/contact',fr:'/fr/contact',es:'/es/contacto',de:'/de/kontakt'}[locale];
  const data = {'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':'https://www.kreluna.it/#organization',name:'Kreluna',url:'https://www.kreluna.it/',logo:'https://www.kreluna.it/kreluna-logo.png'},
    {'@type':'WebPage','@id':`${homeLanguages[locale]}#webpage`,url:homeLanguages[locale],name:t.title,description:t.description,inLanguage:locale,about:{'@id':'https://www.kreluna.it/#organization'}},
    {'@type':'FAQPage',mainEntity:[{'@type':'Question',name:t.faq,acceptedAnswer:{'@type':'Answer',text:t.answer}}]},
  ]};
  return <div id="top">
    <a className="skip-link" href="#main-content">{access[0]}</a>
    <header className="site-header localized-header"><a className="brand" href={prefix}><img src="/kreluna-logo.png" width="34" height="34" alt="" /><span>KRELUNA</span></a><nav className="desktop-nav" aria-label={access[1]}><a href="#services">{t.services}</a><a href={`${prefix}/projects`}>{t.projects}</a><a href={`${prefix}/citybeam`}>CityBeam</a></nav><a className="button button-small button-primary" href={contact}>{t.contact}</a></header>
    <main id="main-content" tabIndex={-1}>
<section className="hero section-shell"><div className="hero-copy"><div className="eyebrow">Kreluna · software · AI</div><h1>{t.heading}<br /> <em>{t.subheading}</em></h1><p>{t.intro}</p><div className="hero-actions"><a className="button button-primary" href={`${prefix}/citybeam`}>{t.discover} ↗</a><a className="button button-secondary" href="#services">{t.services}</a></div><nav className="hero-actions" aria-label={access[2]}>{Object.entries(homeLanguages).filter(([l])=>l!=='x-default').map(([l,url])=><a key={l} href={url} hrefLang={l} lang={l} aria-label={({it:'Italiano',en:'English',fr:'Français',es:'Español',de:'Deutsch'} as Record<string,string>)[l]} aria-current={l===locale?'page':undefined}>{l.toUpperCase()}</a>)}</nav></div></section>
      <section className="editorial-home section-shell" id="services"><h2>{t.services}</h2><div className="editorial-home-grid">{t.cards.map(([title,text])=><article className="editorial-home-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="statement section-shell"><h2>{t.methodTitle}</h2><p>{t.method}</p></section>
      <UpcomingProjects locale={locale} />
      <section className="editorial-trust section-shell"><h2>{t.trust}</h2><p>{t.trustText}</p><details><summary>{t.faq}</summary><p>{t.answer}</p></details></section>
      <section className="resources-home section-shell"><div><h2>{t.resources}</h2><p><a href={t.guidePath}>{t.guide} ↗</a></p><p><a href={t.softwarePath}>{t.softwareGuide} ↗</a></p></div></section>
      <section className="closing section-shell"><h2>{t.contact}</h2><a className="button button-primary" href={contact}>andrea@kreluna.it ↗</a></section>
    </main><footer className="projects-page-footer"><a href={prefix}>Kreluna</a><span>© 2026 Kreluna · P. IVA 02114130475 · REA PT-622714</span></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}} />
  </div>;
}
