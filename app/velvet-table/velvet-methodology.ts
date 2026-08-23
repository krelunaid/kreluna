import type { VelvetLocale } from "./velvet-content";

type MethodologyItem = { title: string; body: string };

type MethodologyContent = {
  kicker: string;
  title: string;
  intro: string;
  items: MethodologyItem[];
  note: string;
};

export const velvetMethodology: Record<VelvetLocale, MethodologyContent> = {
  it: {
    kicker: "Come valutiamo l’atmosfera",
    title: "Criteri leggibili, non etichette decorative.",
    intro: "L’atmosfera nasce da segnali concreti. Velvet Table li organizza per spiegare perché un locale può essere adatto alla serata desiderata, senza trasformare un’impressione in una certezza.",
    items: [
      { title: "Spazio e luce", body: "Illuminazione, distanza tra i tavoli, vista, presenza di un giardino e carattere della sala aiutano a descrivere il luogo." },
      { title: "Suono e ritmo", body: "Rumore, musica, intensità del servizio e affollamento incidono sulla possibilità di parlare, rilassarsi o festeggiare." },
      { title: "Occasione e compagnia", body: "Una cena romantica, un primo appuntamento, un anniversario o un incontro di lavoro richiedono equilibri differenti." },
      { title: "Compatibilità pratica", body: "Zona, cucina, budget, orario, accessibilità ed esigenze alimentari restano necessari per rendere realistica la scelta." },
    ],
    note: "Disponibilità, caratteristiche del tavolo e condizioni di prenotazione dovranno essere confermate dal ristorante o dal sistema collegato prima della prenotazione.",
  },
  en: {
    kicker: "How atmosphere is assessed",
    title: "Clear criteria, not decorative labels.",
    intro: "Atmosphere comes from observable signals. Velvet Table organises them to explain why a venue may suit the evening you want, without presenting an impression as certainty.",
    items: [
      { title: "Space and light", body: "Lighting, distance between tables, views, gardens and the character of the room help describe the setting." },
      { title: "Sound and pace", body: "Noise, music, service rhythm and crowding affect whether the evening feels conversational, relaxed or celebratory." },
      { title: "Occasion and company", body: "A romantic dinner, first date, anniversary or business meal calls for a different balance of qualities." },
      { title: "Practical fit", body: "Area, cuisine, budget, time, accessibility and dietary needs remain essential to make the choice realistic." },
    ],
    note: "Availability, table features and booking conditions would be confirmed by the restaurant or connected booking system before a reservation.",
  },
  fr: {
    kicker: "Comment l’ambiance est évaluée",
    title: "Des critères lisibles, pas des étiquettes décoratives.",
    intro: "L’ambiance naît de signes concrets. Velvet Table les organise pour expliquer pourquoi un lieu peut correspondre à la soirée recherchée, sans transformer une impression en certitude.",
    items: [
      { title: "Espace et lumière", body: "L’éclairage, la distance entre les tables, la vue, le jardin et le caractère de la salle décrivent le cadre." },
      { title: "Son et rythme", body: "Le bruit, la musique, le rythme du service et l’affluence influencent la conversation, le calme ou la fête." },
      { title: "Occasion et compagnie", body: "Un dîner romantique, un premier rendez-vous, un anniversaire ou un repas d’affaires demandent des équilibres différents." },
      { title: "Compatibilité pratique", body: "Quartier, cuisine, budget, heure, accessibilité et besoins alimentaires rendent le choix réaliste." },
    ],
    note: "La disponibilité, les caractéristiques de la table et les conditions de réservation devront être confirmées par le restaurant ou le système connecté.",
  },
  es: {
    kicker: "Cómo se evalúa el ambiente",
    title: "Criterios claros, no etiquetas decorativas.",
    intro: "El ambiente nace de señales concretas. Velvet Table las organiza para explicar por qué un lugar puede encajar con la noche deseada, sin convertir una impresión en certeza.",
    items: [
      { title: "Espacio y luz", body: "La iluminación, la distancia entre mesas, las vistas, el jardín y el carácter de la sala ayudan a describir el lugar." },
      { title: "Sonido y ritmo", body: "El ruido, la música, el ritmo del servicio y la afluencia influyen en conversar, relajarse o celebrar." },
      { title: "Ocasión y compañía", body: "Una cena romántica, una primera cita, un aniversario o una comida de trabajo necesitan equilibrios distintos." },
      { title: "Compatibilidad práctica", body: "Zona, cocina, presupuesto, hora, accesibilidad y necesidades alimentarias hacen que la elección sea realista." },
    ],
    note: "La disponibilidad, las características de la mesa y las condiciones de reserva deberán confirmarse con el restaurante o el sistema conectado.",
  },
  de: {
    kicker: "Wie Atmosphäre bewertet wird",
    title: "Nachvollziehbare Kriterien statt dekorativer Etiketten.",
    intro: "Atmosphäre entsteht aus konkreten Signalen. Velvet Table ordnet sie, um zu erklären, warum ein Ort zum gewünschten Abend passen kann, ohne einen Eindruck als Gewissheit darzustellen.",
    items: [
      { title: "Raum und Licht", body: "Beleuchtung, Tischabstand, Aussicht, Garten und Charakter des Raums helfen, den Ort zu beschreiben." },
      { title: "Klang und Tempo", body: "Lautstärke, Musik, Servicerhythmus und Auslastung beeinflussen Gespräch, Entspannung oder Feier." },
      { title: "Anlass und Begleitung", body: "Romantisches Dinner, erstes Date, Jahrestag oder Geschäftsessen verlangen unterschiedliche Schwerpunkte." },
      { title: "Praktische Eignung", body: "Lage, Küche, Budget, Uhrzeit, Barrierefreiheit und Ernährungsbedürfnisse machen die Wahl realistisch." },
    ],
    note: "Verfügbarkeit, Tischeigenschaften und Reservierungsbedingungen müssten vor der Buchung vom Restaurant oder verbundenen System bestätigt werden.",
  },
};
