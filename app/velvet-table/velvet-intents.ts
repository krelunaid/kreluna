import type { VelvetLocale } from "./velvet-content";

type Intent = { title: string; body: string };
type IntentFaq = { question: string; answer: string };

type VelvetIntentContent = {
  kicker: string;
  title: string;
  intro: string;
  intents: Intent[];
  faqs: IntentFaq[];
};

export const velvetSeoDescriptions: Record<VelvetLocale, string> = {
  it: "Velvet Table è il concierge gastronomico Kreluna per scegliere ristorante, sala e tavolo per atmosfera: serate romantiche, anniversari, viste e cene in giardino.",
  en: "Velvet Table is Kreluna’s dining concierge for choosing restaurants and tables by atmosphere, from romantic evenings and anniversaries to garden dining and views.",
  fr: "Velvet Table est le concierge gastronomique de Kreluna pour choisir restaurants et tables selon l’ambiance : soirée romantique, anniversaire, jardin ou vue.",
  es: "Velvet Table es el concierge gastronómico de Kreluna para elegir restaurantes y mesas por ambiente: noche romántica, aniversario, jardín o vistas.",
  de: "Velvet Table ist Krelunas Dining-Concierge für Restaurants und Tische nach Atmosphäre: romantischer Abend, Jahrestag, Garten oder Aussicht.",
};

export const velvetIntentContent: Record<VelvetLocale, VelvetIntentContent> = {
  it: {
    kicker: "Occasioni e desideri",
    title: "Il ristorante giusto per la serata che immagini.",
    intro: "Velvet Table nasce per trasformare un desiderio espresso in modo naturale in una ricerca concreta, combinando atmosfera, occasione, compagnia e preferenze pratiche.",
    intents: [
      { title: "Serata romantica", body: "Un ristorante romantico con luce soffusa, ritmo tranquillo e un tavolo che lasci spazio alla conversazione." },
      { title: "Primo appuntamento", body: "Un luogo accogliente, non troppo formale né rumoroso, dove sentirsi a proprio agio fin dall’arrivo." },
      { title: "Anniversario e occasioni speciali", body: "Una cena elegante per celebrare un anniversario, un compleanno o un momento importante con la giusta atmosfera." },
      { title: "Tavolo panoramico", body: "Una terrazza, un rooftop o un tavolo con vista che diventi parte dell’esperienza e non soltanto dello sfondo." },
      { title: "Cena in giardino", body: "Un ristorante all’aperto, immerso nel verde o illuminato da lanterne, per una serata più lenta e rilassata." },
      { title: "Cena tranquilla o di lavoro", body: "Una sala riservata e confortevole, adatta a parlare con calma, incontrare un cliente o condividere una decisione." },
    ],
    faqs: [
      { question: "Come si cerca un ristorante per una serata romantica?", answer: "Con Velvet Table l’intenzione viene prima dell’elenco: atmosfera intima, luce soffusa, livello di rumore, vista, occasione e zona diventano criteri da combinare con cucina, budget e orario." },
      { question: "Si potrà scegliere un tavolo in giardino, panoramico o tranquillo?", answer: "È parte del concept. La posizione e il carattere del tavolo dovrebbero diventare preferenze esplicite, compatibilmente con le informazioni e la disponibilità confermate dal ristorante." },
    ],
  },
  en: {
    kicker: "Occasions and intentions",
    title: "The right restaurant for the evening you imagine.",
    intro: "Velvet Table is designed to turn a naturally expressed wish into a practical search by combining atmosphere, occasion, company and real-world preferences.",
    intents: [
      { title: "Romantic evening", body: "A romantic restaurant with soft lighting, a calm pace and a table that leaves room for conversation." },
      { title: "First date", body: "A welcoming place that feels neither too formal nor too loud, helping both guests feel comfortable from the start." },
      { title: "Anniversary and special occasion", body: "An elegant dinner for an anniversary, birthday or meaningful celebration, matched to the atmosphere the moment deserves." },
      { title: "Table with a view", body: "A terrace, rooftop or panoramic table where the view becomes part of the experience rather than a distant backdrop." },
      { title: "Garden dining", body: "An outdoor restaurant among greenery or lanterns for a slower, more relaxed evening in the open air." },
      { title: "Quiet or business dinner", body: "A comfortable, discreet room for an unhurried conversation, a client meeting or an important shared decision." },
    ],
    faqs: [
      { question: "How would I find a restaurant for a romantic evening?", answer: "With Velvet Table, the intention comes before the venue list. Intimacy, soft lighting, noise level, view, occasion and area are combined with cuisine, budget and time." },
      { question: "Could I choose a garden, panoramic or quiet table?", answer: "That is part of the concept. Table position and character should become explicit preferences, subject to information and availability confirmed by the restaurant." },
    ],
  },
  fr: {
    kicker: "Occasions et envies",
    title: "Le bon restaurant pour la soirée que vous imaginez.",
    intro: "Velvet Table transforme une envie exprimée naturellement en recherche concrète, en associant ambiance, occasion, compagnie et préférences pratiques.",
    intents: [
      { title: "Soirée romantique", body: "Un restaurant romantique à la lumière douce, au rythme calme, avec une table propice à la conversation." },
      { title: "Premier rendez-vous", body: "Un lieu accueillant, ni trop formel ni trop bruyant, où chacun peut se sentir à l’aise dès l’arrivée." },
      { title: "Anniversaire et occasion spéciale", body: "Un dîner élégant pour célébrer un anniversaire ou un moment important dans une ambiance à sa mesure." },
      { title: "Table avec vue", body: "Une terrasse, un rooftop ou une table panoramique où la vue devient une véritable partie de l’expérience." },
      { title: "Dîner au jardin", body: "Un restaurant en plein air, entouré de verdure ou de lanternes, pour une soirée plus lente et détendue." },
      { title: "Dîner calme ou professionnel", body: "Une salle confortable et discrète pour parler sereinement, rencontrer un client ou partager une décision importante." },
    ],
    faqs: [
      { question: "Comment trouver un restaurant pour une soirée romantique ?", answer: "Avec Velvet Table, l’intention précède la liste : intimité, lumière douce, niveau sonore, vue, occasion et quartier se combinent avec la cuisine, le budget et l’heure." },
      { question: "Pourra-t-on choisir une table au jardin, panoramique ou calme ?", answer: "Cela fait partie du concept. L’emplacement et le caractère de la table devraient devenir des préférences explicites, selon les informations et disponibilités confirmées par le restaurant." },
    ],
  },
  es: {
    kicker: "Ocasiones e intenciones",
    title: "El restaurante adecuado para la noche que imaginas.",
    intro: "Velvet Table convierte un deseo expresado con naturalidad en una búsqueda concreta, combinando ambiente, ocasión, compañía y preferencias prácticas.",
    intents: [
      { title: "Noche romántica", body: "Un restaurante romántico con luz tenue, ritmo tranquilo y una mesa que deje espacio para conversar." },
      { title: "Primera cita", body: "Un lugar acogedor, ni demasiado formal ni ruidoso, donde ambos puedan sentirse cómodos desde el principio." },
      { title: "Aniversario y ocasión especial", body: "Una cena elegante para celebrar un aniversario, cumpleaños o momento importante con el ambiente que merece." },
      { title: "Mesa con vistas", body: "Una terraza, rooftop o mesa panorámica donde las vistas formen parte de la experiencia y no solo del fondo." },
      { title: "Cena en el jardín", body: "Un restaurante al aire libre entre vegetación o faroles para disfrutar de una noche más lenta y relajada." },
      { title: "Cena tranquila o de negocios", body: "Una sala cómoda y reservada para conversar con calma, reunirse con un cliente o compartir una decisión importante." },
    ],
    faqs: [
      { question: "¿Cómo encontrar un restaurante para una noche romántica?", answer: "Con Velvet Table, la intención va antes que la lista: intimidad, luz tenue, ruido, vistas, ocasión y zona se combinan con cocina, presupuesto y hora." },
      { question: "¿Se podrá elegir una mesa en el jardín, panorámica o tranquila?", answer: "Forma parte del concepto. La posición y el carácter de la mesa deberían ser preferencias explícitas, según la información y disponibilidad confirmadas por el restaurante." },
    ],
  },
  de: {
    kicker: "Anlässe und Wünsche",
    title: "Das passende Restaurant für den Abend, den du dir vorstellst.",
    intro: "Velvet Table übersetzt einen natürlich formulierten Wunsch in eine konkrete Suche und verbindet Atmosphäre, Anlass, Begleitung und praktische Vorlieben.",
    intents: [
      { title: "Romantischer Abend", body: "Ein romantisches Restaurant mit sanftem Licht, ruhigem Tempo und einem Tisch mit Raum für Gespräche." },
      { title: "Erstes Date", body: "Ein einladender Ort, weder zu formell noch zu laut, an dem sich beide von Anfang an wohlfühlen können." },
      { title: "Jahrestag und besonderer Anlass", body: "Ein elegantes Dinner für einen Jahrestag, Geburtstag oder wichtigen Moment mit der passenden Atmosphäre." },
      { title: "Tisch mit Aussicht", body: "Eine Terrasse, ein Rooftop oder ein Panoramatisch, bei dem die Aussicht Teil des Erlebnisses wird." },
      { title: "Abendessen im Garten", body: "Ein Restaurant im Freien zwischen Grün und Laternen für einen langsameren, entspannten Abend." },
      { title: "Ruhiges oder geschäftliches Dinner", body: "Ein komfortabler, diskreter Raum für ein ruhiges Gespräch, ein Kundentreffen oder eine wichtige gemeinsame Entscheidung." },
    ],
    faqs: [
      { question: "Wie finde ich ein Restaurant für einen romantischen Abend?", answer: "Bei Velvet Table kommt die Absicht vor der Liste: Intimität, sanftes Licht, Lautstärke, Aussicht, Anlass und Lage werden mit Küche, Budget und Uhrzeit verbunden." },
      { question: "Kann ich einen Garten-, Panorama- oder ruhigen Tisch wählen?", answer: "Das gehört zum Konzept. Lage und Charakter des Tisches sollen ausdrückliche Wünsche werden, abhängig von den Informationen und der Verfügbarkeit des Restaurants." },
    ],
  },
};
