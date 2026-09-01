export type MarketplaceProduct = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  color: "teal" | "violet" | "gold" | "cyan" | "coral" | "velvet" | "electric";
  status: string;
  href: string;
  features: readonly string[];
  mockup: string;
  domain: string;
  category: "music-audio" | "digital-products";
};

export const products: readonly MarketplaceProduct[] = [
  {
    slug: "risonix",
    name: "Risonix",
    eyebrow: "Riconoscimento musicale",
    tagline: "La tua musica. Riconosciuta.",
    description: "Impronte acustiche locali, riconoscimento da file o microfono, percentuale di corrispondenza e licenza online per un solo dispositivo.",
    color: "teal",
    status: "Preview 1.7",
    href: "/risonix",
    features: ["Database locale", "File e microfono", "Licenza Mac + Windows"],
    mockup: "risonix",
    domain: "kreluna.it/risonix",
    category: "music-audio",
  },
  {
    slug: "kreluna-ai",
    name: "Kreluna AI",
    eyebrow: "Intelligenza artificiale",
    tagline: "Pensa con te, ogni giorno.",
    description: "Non solo risposte. Ragionamento adattivo, ricerca, scrittura e pianificazione in un'esperienza naturale.",
    color: "violet",
    status: "In sviluppo",
    href: "https://www.kreluna.it/intelligenza-artificiale-aziende.html",
    features: ["Ragionamento adattivo", "Ricerca e analisi", "Scrittura e studio"],
    mockup: "ai",
    domain: "kreluna.ai",
    category: "digital-products",
  },
  {
    slug: "office",
    name: "Kreluna Office",
    eyebrow: "Per professionisti",
    tagline: "Il dipendente digitale del tuo studio.",
    description: "Organizza documenti, clienti, pratiche e scadenze. Prepara il lavoro e lascia a te il controllo delle azioni importanti.",
    color: "gold",
    status: "In sviluppo",
    href: "https://www.kreluna.it/ai-studi-professionali.html",
    features: ["Document intelligence", "Pratiche e scadenze", "Approval center"],
    mockup: "office",
    domain: "kreluna.it/office",
    category: "digital-products",
  },
  {
    slug: "cyber",
    name: "Kreluna Cyber",
    eyebrow: "Sicurezza informatica",
    tagline: "Intelligence that protects.",
    description: "Strumenti dedicati a security assessment, gestione delle vulnerabilità, workflow degli incidenti e conformità tecnica.",
    color: "cyan",
    status: "In sviluppo",
    href: "https://cra24.kreluna.it/",
    features: ["Security assessment", "Vulnerability management", "Compliance tecnica"],
    mockup: "cyber",
    domain: "cra24.kreluna.it",
    category: "digital-products",
  },
  {
    slug: "helix",
    name: "Helix",
    eyebrow: "Sviluppo con l'AI",
    tagline: "Il modo in cui Kreluna costruisce prodotti.",
    description: "Helix crea siti, app e software su misura con l'intelligenza artificiale. Ogni prossimo progetto Kreluna parte dallo stesso strumento.",
    color: "coral",
    status: "In sviluppo",
    href: "https://helix.kreluna.it/",
    features: ["Siti su misura", "App e software", "Costruito con l'AI"],
    mockup: "helix",
    domain: "helix.kreluna.it",
    category: "digital-products",
  },
  {
    slug: "velvet-table",
    name: "Velvet Table",
    eyebrow: "Dining experience",
    tagline: "Prenota l’atmosfera, non solo il tavolo.",
    description: "Un concept Kreluna per scegliere il locale partendo dal tipo di serata e passare poi a disponibilità e prenotazione.",
    color: "velvet",
    status: "Concept in sviluppo",
    href: "/velvet-table",
    features: ["Atmosfera desiderata", "Occasione e compagnia", "Prenotazione guidata"],
    mockup: "velvet",
    domain: "kreluna.it/velvet-table",
    category: "digital-products",
  },
  {
    slug: "citybeam",
    name: "CityBeam",
    eyebrow: "Digital out of home",
    tagline: "Il tuo momento sui grandi schermi del mondo.",
    description: "Un marketplace europeo in preparazione per richiedere e prenotare spot su maxi-schermi iconici, con Times Square come prima destinazione prevista.",
    color: "electric",
    status: "Pre-lancio",
    href: "/citybeam",
    features: ["Times Square", "Contenuti approvati", "Prova di pubblicazione"],
    mockup: "citybeam",
    domain: "kreluna.it/citybeam",
    category: "digital-products",
  },
] as const;

export const marketplaceCategories = [
  {
    id: "music-audio",
    name: "Musica e audio",
    description: "Software Kreluna dedicati al riconoscimento, all’ascolto e alla gestione della musica.",
  },
  {
    id: "digital-products",
    name: "Esperienze e nuovi servizi",
    description: "Progetti Kreluna dedicati a nuove esperienze e servizi digitali in fase di sviluppo.",
  },
] as const;

export function productsForCategory(categoryId: MarketplaceProduct["category"]) {
  return products.filter((product) => product.category === categoryId);
}
