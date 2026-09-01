/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";

export type CityBeamLocale = "it" | "en" | "fr" | "es" | "de";

const siteUrl = "https://www.kreluna.it";
const localePath: Record<CityBeamLocale, string> = {
  it: "/citybeam",
  en: "/en/citybeam",
  fr: "/fr/citybeam",
  es: "/es/citybeam",
  de: "/de/citybeam",
};

const translations = {
  it: {
    lang: "it-IT", title: "CityBeam | Il tuo momento sui grandi schermi del mondo",
    description: "CityBeam è il progetto Kreluna in pre-lancio per rendere più semplice la richiesta di spot su maxi-schermi iconici, iniziando da Times Square.",
    navHow: "Come funziona", navFor: "Per chi", navContact: "Contatti", kicker: "CityBeam · progetto in fase di lancio",
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
    lang: "en-GB", title: "CityBeam | Your moment on the world’s biggest screens",
    description: "CityBeam is Kreluna’s pre-launch project designed to simplify access to iconic digital billboards, starting with Times Square.",
    navHow: "How it works", navFor: "Who it’s for", navContact: "Contact", kicker: "CityBeam · pre-launch project",
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
    lang: "fr-FR", title: "CityBeam | Votre moment sur les plus grands écrans du monde",
    description: "CityBeam est le projet Kreluna en pré-lancement pour simplifier l’accès aux écrans numériques iconiques, en commençant par Times Square.",
    navHow: "Fonctionnement", navFor: "Pour qui", navContact: "Contact", kicker: "CityBeam · projet en pré-lancement",
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
    lang: "es-ES", title: "CityBeam | Tu momento en las pantallas más grandes del mundo",
    description: "CityBeam es el proyecto de Kreluna en prelanzamiento para simplificar el acceso a pantallas digitales icónicas, empezando por Times Square.",
    navHow: "Cómo funciona", navFor: "Para quién", navContact: "Contacto", kicker: "CityBeam · proyecto en prelanzamiento",
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
    lang: "de-DE", title: "CityBeam | Dein Moment auf den größten Bildschirmen der Welt",
    description: "CityBeam ist Krelunas Pre-Launch-Projekt für einen einfacheren Zugang zu ikonischen Digitalflächen – beginnend am Times Square.",
    navHow: "So funktioniert es", navFor: "Für wen", navContact: "Kontakt", kicker: "CityBeam · Projekt vor dem Start",
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

export function cityBeamMetadata(locale: CityBeamLocale): Metadata {
  const t = translations[locale];
  const canonical = `${siteUrl}${localePath[locale]}`;
  const languages = Object.fromEntries(Object.entries(localePath).map(([language, path]) => [language, `${siteUrl}${path}`]));
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical, languages: { ...languages, "x-default": `${siteUrl}/citybeam` } },
    openGraph: { title: t.title, description: t.description, url: canonical, type: "website", images: [{ url: `${siteUrl}/citybeam-hero.png`, width: 1807, height: 870, alt: t.title }] },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [`${siteUrl}/citybeam-hero.png`] },
  };
}

export default function CityBeamLanding({ locale }: { locale: CityBeamLocale }) {
  const t = translations[locale];
  return (
    <div className="citybeam-page" lang={t.lang}>
      <header className="citybeam-header">
        <Link className="citybeam-brand" href="/" aria-label="Kreluna home"><img src="/kreluna-logo.png" alt="" width="31" height="31" /><span>KRELUNA · CITYBEAM</span></Link>
        <nav aria-label="CityBeam"><a href="#come-funziona">{t.navHow}</a><a href="#per-chi">{t.navFor}</a><a href="/contatti.html">{t.navContact}</a></nav>
        <nav className="citybeam-language" aria-label="Language">
          {(Object.keys(localePath) as CityBeamLocale[]).map((code) => <a key={code} href={localePath[code]} aria-current={code === locale ? "page" : undefined} hrefLang={code}>{code.toUpperCase()}</a>)}
        </nav>
      </header>
      <main>
        <section className="citybeam-hero">
          <div className="citybeam-copy"><span className="citybeam-kicker">{t.kicker}</span><h1>{t.h1a} <em>{t.h1b}</em>{t.h1c}</h1><p>{t.intro}</p>
            <div className="citybeam-actions"><a className="button citybeam-primary" href="/contatti.html">{t.info} <span aria-hidden="true">↗</span></a><a className="button button-secondary" href="#come-funziona">{t.discover}</a></div><p className="citybeam-note">{t.disclosure}</p></div>
          <figure className="citybeam-visual"><img src="/citybeam-hero.png" alt={t.title} width="1807" height="870" /><figcaption><span>{t.destination}</span><strong>Times Square · New York</strong></figcaption></figure>
        </section>
        <section className="citybeam-section" id="come-funziona"><div className="citybeam-section-heading"><span className="citybeam-kicker">{t.howKicker}</span><h2>{t.howTitle}</h2><p>{t.howIntro}</p></div>
          <ol className="citybeam-steps">{t.steps.map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
        <section className="citybeam-section citybeam-use-cases" id="per-chi"><article className="citybeam-case"><span>{t.business}</span><h3>{t.businessTitle}</h3><p>{t.businessText}</p></article><article className="citybeam-case"><span>{t.personal}</span><h3>{t.personalTitle}</h3><p>{t.personalText}</p></article></section>
        <section className="citybeam-status"><span className="citybeam-kicker">{t.statusKicker}</span><h2>{t.statusTitle}</h2><p>{t.statusText}</p><a className="button citybeam-primary" href="/contatti.html">{t.talk} <span aria-hidden="true">↗</span></a></section>
      </main>
      <footer className="citybeam-footer"><span>© 2026 Kreluna · {t.provisional}</span><span>P. IVA 02114130475 · REA PT-622714</span></footer>
    </div>
  );
}
