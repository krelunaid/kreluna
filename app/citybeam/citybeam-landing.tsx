/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { cityBeamFaq } from "./citybeam-faq";
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

const contactPath: Record<CityBeamLocale, string> = {
  it: "/contatti",
  en: "/en/contact",
  fr: "/fr/contact",
  es: "/es/contacto",
  de: "/de/kontakt",
};

const openGraphLocale: Record<CityBeamLocale, string> = {
  it: "it_IT",
  en: "en_GB",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
};

const translations = {
  it: {
    lang: "it-IT", title: "CityBeam | Pubblicità a Times Square e sui maxi-schermi",
    description: "CityBeam è il progetto Kreluna in pre-lancio per rendere più semplice la richiesta di spot su maxi-schermi iconici, iniziando da Times Square.",
    navHome: "Home", navHow: "Come funziona", navFor: "Per chi", navContact: "Contatti", kicker: "CityBeam · progetto in fase di lancio",
    h1a: "Il tuo momento sui", h1b: "grandi schermi", h1c: " del mondo.",
    intro: "Kreluna sta sviluppando un marketplace europeo per rendere più semplice la richiesta di spot sui maxi-schermi delle destinazioni più iconiche. La prima destinazione prevista è Times Square, a New York.",
    info: "Richiedi informazioni", discover: "Scopri il progetto",
    disclosure: "CityBeam è in pre-lancio. Schermi, disponibilità, immagini, prezzi e prenotazioni saranno pubblicati esclusivamente dopo la conferma degli operatori autorizzati.",
    destination: "Prima destinazione prevista", howKicker: "Un percorso più semplice", howTitle: "Dall’idea alla pubblicazione.",
    howIntro: "CityBeam è pensato per trasformare un acquisto oggi complesso in un percorso chiaro, mantenendo sempre l’approvazione finale degli operatori e delle loro policy.",
    steps: [["Scegli il momento", "Indica destinazione, periodo, occasione e tipo di visibilità desiderata."], ["Prepara il contenuto", "Carica foto o video seguendo specifiche tecniche e regole editoriali confermate."], ["Ricevi la conferma", "Dopo approvazione e pubblicazione, ricevi la prova disponibile della messa in onda."]],
    business: "Aziende e creator", businessTitle: "Lancia un prodotto dove il mondo guarda.", businessText: "Campagne, eventi, contenuti creativi e momenti di marca su schermi ad alta visibilità.",
    personal: "Momenti personali", personalTitle: "Trasforma un messaggio in un ricordo.", personalText: "Auguri, dediche e celebrazioni, sempre nel rispetto delle policy applicabili.",
    statusKicker: "La rete è in costruzione", statusTitle: "Stiamo parlando con gli operatori.",
    statusText: "CityBeam non vende ancora spazi pubblicitari. Stiamo verificando disponibilità, condizioni di rivendita, specifiche tecniche e sistemi di prova della pubblicazione con operatori qualificati.",
    talk: "Parla con Kreluna", provisional: "CityBeam è un nome provvisorio",
  },
  en: {
    lang: "en-GB", title: "CityBeam | Times Square and digital billboard advertising",
    description: "CityBeam is Kreluna’s pre-launch project designed to simplify access to iconic digital billboards, starting with Times Square.",
    navHome: "Home", navHow: "How it works", navFor: "Who it’s for", navContact: "Contact", kicker: "CityBeam · pre-launch project",
    h1a: "Your moment on the", h1b: "world’s biggest screens", h1c: ".",
    intro: "Kreluna is developing a European marketplace designed to simplify requests for placements on iconic digital billboards. Times Square in New York is the first planned destination.",
    info: "Request information", discover: "Explore the project",
    disclosure: "CityBeam is in pre-launch. Screens, availability, images, pricing and bookings will be published only after confirmation from authorised operators.",
    destination: "First planned destination", howKicker: "A simpler journey", howTitle: "From idea to display.",
    howIntro: "CityBeam is designed to turn a complex media purchase into a clear journey while preserving the operators’ final approval and content policies.",
    steps: [["Choose the moment", "Select the destination, timing, occasion and visibility you are looking for."], ["Prepare the content", "Upload a photo or video that follows confirmed technical and editorial requirements."], ["Receive confirmation", "After approval and display, receive the available proof of play."]],
    business: "Brands and creators", businessTitle: "Launch where the world is watching.", businessText: "Campaigns, events, creative content and brand moments on high-visibility screens.",
    personal: "Personal moments", personalTitle: "Turn a message into a memory.", personalText: "Greetings, dedications and celebrations, always subject to the applicable policies.",
    statusKicker: "The network is being built", statusTitle: "We are speaking with operators.",
    statusText: "CityBeam is not yet selling advertising space. We are verifying availability, resale terms, technical specifications and proof-of-play options with qualified operators.",
    talk: "Talk to Kreluna", provisional: "CityBeam is a working name",
  },
  fr: {
    lang: "fr-FR", title: "CityBeam | Publicité à Times Square et écrans géants",
    description: "CityBeam est le projet Kreluna en pré-lancement pour simplifier l’accès aux écrans numériques iconiques, en commençant par Times Square.",
    navHome: "Accueil", navHow: "Fonctionnement", navFor: "Pour qui", navContact: "Contact", kicker: "CityBeam · projet en pré-lancement",
    h1a: "Votre moment sur les", h1b: "plus grands écrans", h1c: " du monde.",
    intro: "Kreluna développe une marketplace européenne pour simplifier les demandes de diffusion sur les écrans numériques des destinations les plus iconiques. Times Square, à New York, est la première destination prévue.",
    info: "Demander des informations", discover: "Découvrir le projet",
    disclosure: "CityBeam est en pré-lancement. Les écrans, disponibilités, images, tarifs et réservations seront publiés uniquement après confirmation des opérateurs autorisés.",
    destination: "Première destination prévue", howKicker: "Un parcours plus simple", howTitle: "De l’idée à la diffusion.",
    howIntro: "CityBeam veut transformer un achat média complexe en un parcours clair, tout en respectant l’approbation finale et les règles de contenu des opérateurs.",
    steps: [["Choisissez le moment", "Indiquez la destination, la période, l’occasion et la visibilité souhaitée."], ["Préparez le contenu", "Importez une photo ou une vidéo conforme aux spécifications techniques et éditoriales confirmées."], ["Recevez la confirmation", "Après approbation et diffusion, recevez la preuve de passage disponible."]],
    business: "Marques et créateurs", businessTitle: "Lancez votre projet là où le monde regarde.", businessText: "Campagnes, événements, contenus créatifs et temps forts de marque sur des écrans à forte visibilité.",
    personal: "Moments personnels", personalTitle: "Transformez un message en souvenir.", personalText: "Vœux, dédicaces et célébrations, toujours dans le respect des règles applicables.",
    statusKicker: "Le réseau se construit", statusTitle: "Nous échangeons avec les opérateurs.",
    statusText: "CityBeam ne vend pas encore d’espaces publicitaires. Nous vérifions les disponibilités, conditions de revente, spécifications techniques et preuves de diffusion avec des opérateurs qualifiés.",
    talk: "Parler à Kreluna", provisional: "CityBeam est un nom provisoire",
  },
  es: {
    lang: "es-ES", title: "CityBeam | Publicidad en Times Square y pantallas gigantes",
    description: "CityBeam es el proyecto de Kreluna en prelanzamiento para simplificar el acceso a pantallas digitales icónicas, empezando por Times Square.",
    navHome: "Inicio", navHow: "Cómo funciona", navFor: "Para quién", navContact: "Contacto", kicker: "CityBeam · proyecto en prelanzamiento",
    h1a: "Tu momento en las", h1b: "pantallas más grandes", h1c: " del mundo.",
    intro: "Kreluna está desarrollando un marketplace europeo para simplificar las solicitudes de anuncios en las pantallas digitales de los destinos más icónicos. Times Square, en Nueva York, es el primer destino previsto.",
    info: "Solicitar información", discover: "Descubrir el proyecto",
    disclosure: "CityBeam está en prelanzamiento. Las pantallas, disponibilidad, imágenes, precios y reservas se publicarán únicamente tras la confirmación de los operadores autorizados.",
    destination: "Primer destino previsto", howKicker: "Un proceso más sencillo", howTitle: "De la idea a la publicación.",
    howIntro: "CityBeam busca convertir una compra de medios compleja en un proceso claro, manteniendo siempre la aprobación final y las políticas de contenido de los operadores.",
    steps: [["Elige el momento", "Indica el destino, el periodo, la ocasión y el tipo de visibilidad que buscas."], ["Prepara el contenido", "Sube una foto o un vídeo siguiendo las especificaciones técnicas y editoriales confirmadas."], ["Recibe la confirmación", "Tras la aprobación y publicación, recibe la prueba de emisión disponible."]],
    business: "Marcas y creadores", businessTitle: "Lanza tu proyecto donde mira el mundo.", businessText: "Campañas, eventos, contenido creativo y momentos de marca en pantallas de gran visibilidad.",
    personal: "Momentos personales", personalTitle: "Convierte un mensaje en un recuerdo.", personalText: "Felicitaciones, dedicatorias y celebraciones, siempre de acuerdo con las políticas aplicables.",
    statusKicker: "La red está en construcción", statusTitle: "Estamos hablando con los operadores.",
    statusText: "CityBeam todavía no vende espacios publicitarios. Estamos verificando disponibilidad, condiciones de reventa, especificaciones técnicas y pruebas de emisión con operadores cualificados.",
    talk: "Habla con Kreluna", provisional: "CityBeam es un nombre provisional",
  },
  de: {
    lang: "de-DE", title: "CityBeam | Werbung am Times Square und auf Großbildschirmen",
    description: "CityBeam ist Krelunas Pre-Launch-Projekt für einen einfacheren Zugang zu ikonischen Digitalflächen – beginnend am Times Square.",
    navHome: "Startseite", navHow: "So funktioniert es", navFor: "Für wen", navContact: "Kontakt", kicker: "CityBeam · Projekt vor dem Start",
    h1a: "Dein Moment auf den", h1b: "größten Bildschirmen", h1c: " der Welt.",
    intro: "Kreluna entwickelt einen europäischen Marktplatz, der Anfragen für Werbeplätze auf ikonischen digitalen Großbildschirmen vereinfacht. Der Times Square in New York ist das erste geplante Ziel.",
    info: "Informationen anfordern", discover: "Projekt entdecken",
    disclosure: "CityBeam befindet sich vor dem Start. Bildschirme, Verfügbarkeit, Bilder, Preise und Buchungen werden erst nach Bestätigung durch autorisierte Betreiber veröffentlicht.",
    destination: "Erstes geplantes Ziel", howKicker: "Ein einfacherer Weg", howTitle: "Von der Idee zur Ausstrahlung.",
    howIntro: "CityBeam soll einen komplexen Mediaeinkauf in einen klaren Ablauf verwandeln und dabei die endgültige Freigabe und Inhaltsrichtlinien der Betreiber wahren.",
    steps: [["Wähle den Moment", "Bestimme Ziel, Zeitraum, Anlass und die gewünschte Sichtbarkeit."], ["Bereite den Inhalt vor", "Lade ein Foto oder Video gemäß den bestätigten technischen und redaktionellen Vorgaben hoch."], ["Erhalte die Bestätigung", "Nach Freigabe und Ausstrahlung erhältst du den verfügbaren Ausspielungsnachweis."]],
    business: "Marken und Creator", businessTitle: "Starte dort, wo die Welt hinsieht.", businessText: "Kampagnen, Events, kreative Inhalte und Markenmomente auf aufmerksamkeitsstarken Bildschirmen.",
    personal: "Persönliche Momente", personalTitle: "Mach aus einer Botschaft eine Erinnerung.", personalText: "Glückwünsche, Widmungen und Feiern – immer gemäß den geltenden Richtlinien.",
    statusKicker: "Das Netzwerk entsteht", statusTitle: "Wir sprechen mit den Betreibern.",
    statusText: "CityBeam verkauft noch keine Werbeflächen. Wir prüfen Verfügbarkeit, Wiederverkaufsbedingungen, technische Spezifikationen und Ausspielungsnachweise mit qualifizierten Betreibern.",
    talk: "Mit Kreluna sprechen", provisional: "CityBeam ist ein vorläufiger Name",
  },
} as const;

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

function CityBeamProofPhoto({ file, alt, brand, featured = false }: { file: string; alt: string; brand: string; featured?: boolean }) {
  const base = `/citybeam/ny-d020/${file}`;
  return (
    <figure className={`citybeam-proof-photo${featured ? " citybeam-proof-photo-featured" : ""}`}>
      <picture>
        <source type="image/avif" srcSet={`${base}-640.avif 640w, ${base}-1200.avif 1200w`} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 980px) 42vw, 42vw" />
        <img src={`${base}-1200.webp`} srcSet={`${base}-640.webp 640w, ${base}-1200.webp 1200w`} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 980px) 42vw, 42vw" alt={alt} width="1200" height="800" loading="lazy" decoding="async" />
      </picture>
      <figcaption><span>NY-D020 · Times Square</span><strong>{brand}</strong></figcaption>
    </figure>
  );
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
          url: `${siteUrl}/citybeam/ny-d020/ny-d020-asos-hero-1600.webp`,
          width: 1600,
          height: 1067,
        },
        dateModified: "2026-09-29",
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
        serviceType: "Digital out-of-home advertising marketplace project",
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
        <a className="citybeam-brand" href={locale === "it" ? "/" : `/${locale}`} aria-label={`Kreluna · CityBeam — ${t.navHome}`}><svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="6" fill="#c4f455" /><g fill="none" stroke="#121212" strokeWidth="2.2" strokeLinecap="round"><path d="M12 6v12M17.196 9 6.804 15m0-6 10.392 6" /></g></svg><span>KRELUNA · CITYBEAM</span></a>
        <nav aria-label="CityBeam"><a href={locale === "it" ? "/" : `/${locale}`}>{t.navHome}</a><a href="#come-funziona">{t.navHow}</a><a href="#per-chi">{t.navFor}</a><a href={contactPath[locale]}>{t.navContact}</a></nav>
        <nav className="citybeam-language" aria-label={access[1]}>
          {(Object.keys(localePath) as CityBeamLocale[]).map((code) => <a key={code} href={localePath[code]} lang={code} aria-label={{it:'Italiano',en:'English',fr:'Français',es:'Español',de:'Deutsch'}[code]} aria-current={code === locale ? "page" : undefined} hrefLang={code}>{code.toUpperCase()}</a>)}
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className="citybeam-hero">
          <div className="citybeam-copy"><span className="citybeam-kicker">{t.kicker}</span><h1>{t.h1a} <em>{t.h1b}</em>{t.h1c}</h1><p>{t.intro}</p>
            <div className="citybeam-actions"><a className="button citybeam-primary" href={contactPath[locale]}>{t.info}</a><a className="button button-secondary" href="#come-funziona">{t.discover}</a></div></div>
          <figure className="citybeam-visual"><picture><source type="image/avif" srcSet="/citybeam/ny-d020/ny-d020-asos-hero-960.avif 960w, /citybeam/ny-d020/ny-d020-asos-hero-1600.avif 1600w" sizes="(max-width: 980px) 90vw, 52vw" /><img src="/citybeam/ny-d020/ny-d020-asos-hero-1600.webp" srcSet="/citybeam/ny-d020/ny-d020-asos-hero-960.webp 960w, /citybeam/ny-d020/ny-d020-asos-hero-1600.webp 1600w" sizes="(max-width: 980px) 90vw, 52vw" alt={proof.heroAlt} width="1600" height="1067" fetchPriority="high" decoding="async" /></picture><figcaption><div><span>{t.destination}</span><strong>Times Square, New York</strong></div><span className="citybeam-visual-credit">NY-D020<br />ASOS · Heritage Outdoor</span></figcaption></figure>
          <p className="citybeam-note">{t.disclosure}</p>
        </section>
        <section className="citybeam-photo-story" aria-labelledby="citybeam-photo-title">
          <div className="citybeam-photo-intro">
            <div><span className="citybeam-kicker">{proof.kicker}</span>
            <h2 id="citybeam-photo-title">{proof.title}</h2>
            </div><div className="citybeam-photo-context"><p>{proof.intro}</p>
            <p className="citybeam-photo-credit">{proof.credit}</p></div>
          </div>
          <div className="citybeam-proof-grid">
            {proof.images.map((photo, index) => <CityBeamProofPhoto key={photo.file} {...photo} featured={index === 0} />)}
          </div>
          <p className="citybeam-photo-note">{proof.note}</p>
        </section>
        <section className="citybeam-section" id="come-funziona"><div className="citybeam-section-heading"><span className="citybeam-kicker">{t.howKicker}</span><h2>{t.howTitle}</h2><p>{t.howIntro}</p></div>
          <ol className="citybeam-steps">{t.steps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
        <section className="citybeam-section citybeam-use-cases" id="per-chi"><article className="citybeam-case"><span>{t.business}</span><h3>{t.businessTitle}</h3><p>{t.businessText}</p></article><article className="citybeam-case"><span>{t.personal}</span><h3>{t.personalTitle}</h3><p>{t.personalText}</p></article></section>
        <section className="citybeam-section" id="faq"><div className="citybeam-section-heading"><h2>{faq.title}</h2></div><div className="home-faq">{faq.questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
        <section className="citybeam-status"><span className="citybeam-kicker">{t.statusKicker}</span><h2>{t.statusTitle}</h2><p>{t.statusText}</p><a className="button citybeam-primary" href={contactPath[locale]}>{t.talk}</a></section>
        <LaunchSignup project="citybeam" locale={locale} />
      </main>
      <footer className="citybeam-footer"><span>© 2026 Kreluna · {t.provisional}</span><span>P. IVA 02114130475 · REA PT-622714</span></footer>
      <script id="citybeam-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
