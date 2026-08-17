import type { Lang } from "./types";

const dict = {
  it: {
    bootTag: "Controllo. Chiarezza. Lavoro reale.",
    bootKernel: "Luna Kernel 1.0",
    lockHint: "Tocca o premi Invio per entrare",
    lockGuest: "Operatore",
    lockSub: "Sessione locale · nessuna telemetria",
    appleAbout: "Informazioni su Kreluna",
    appleSleep: "Sospendi",
    appleRestart: "Riavvia",
    appleShut: "Spegni",
    appleAccount: "Identità Kreluna",
    search: "Cerca",
    spotlightPh: "Cerca app, file, azioni…",
    noResults: "Nessun risultato",
    dock: "Applicazioni",
    notif: "Notifiche",
    markRead: "Segna come lette",
    emptyNotif: "Niente di nuovo.",
    control: "Centro di controllo",
    themeNight: "Notte",
    themeDawn: "Orbit",
    langIt: "Italiano",
    langEn: "English",
    focus: "Focus",
    focusOn: "Attivo",
    focusOff: "Libero",
    net: "Rete",
    netSecure: "Collegamento privato",
    posture: "Postura",
    postureOk: "Controllata",
    volume: "Presenza",
    unlock: "Sblocca",
    wake: "Tocca per accendere",
    shutMsg: "Kreluna è spento.",
    sleepMsg: "In sospensione",
    aboutTitle: "Kreluna",
    aboutBody:
      "Kreluna non è un sistema operativo. È il tuo Perimetro: disco, orbe, coda. Core prepara. Tu decidi. Niente parte da solo.",
    aboutClose: "Chiudi",
    pending: "In attesa di te",
    approve: "Approva",
    deny: "Rifiuta",
    approved: "Approvato",
    denied: "Rifiutato",
    apps: {
      core: "Core",
      office: "Office",
      cyber: "Cyber",
      files: "File",
      mail: "Posta",
      calendar: "Calendario",
      notes: "Note",
      terminal: "Terminale",
      settings: "Impostazioni",
      browser: "Navigazione",
      calc: "Calcolatrice",
      editor: "Editor",
      photos: "Foto",
      monitor: "Monitor",
      store: "Archivio",
      clock: "Orologio",
      paint: "Tela",
      tasks: "Compiti",
      trash: "Cestino",
      luna: "Luna",
      ponte: "Ponte",
    },
    appHint: {
      core: "Ragiona con te. Non decide al posto tuo.",
      office: "Casi, documenti, scadenze, approvazioni.",
      cyber: "Valutazione e priorità, senza certificazioni inventate.",
      files: "Archivio locale della sessione.",
      mail: "Corrispondenza di lavoro.",
      calendar: "Settimana e revisioni.",
      notes: "Appunti persistenti.",
      terminal: "Luna shell.",
      settings: "Identità, lingua, sistema.",
      browser: "Cerchi qui. Si apre Google.",
      calc: "Calcoli precisi, niente altro.",
      editor: "Scrive sul file system.",
      photos: "Immagini della sessione.",
      monitor: "Processi e risorse.",
      store: "Installa e rimuove moduli.",
      clock: "Tempo, fusi, timer.",
      paint: "Disegna e salva sulla scrivania.",
      tasks: "Lista persistente.",
      trash: "File rimossi, recuperabili.",
      luna: "Formato nativo: pacchetti, permessi, sigillo.",
      ponte: "Due Kreluna. Si accettano. Poi, se fidati, si ritrovano.",
    },
    widgets: {
      today: "Oggi",
      security: "Sentinella",
      cases: "In revisione",
    },
    core: {
      title: "Kreluna Core",
      sub: "Legge disco, coda e orbe. Non decide.",
      ph: "Chiedi quel che vuoi…",
      send: "Invia",
      thinking: "Kreluna sta ascoltando…",
      offline: "Core non è disponibile in questo ambiente. Resta il resto del sistema.",
      empty: "Core parla con te. Anche normale. L’ufficio solo se lo chiedi.",
      suggest1: "Ciao, come stai?",
      suggest2: "Parliamo un po’, senza ufficio.",
      suggest3: "Riassumi le approvazioni in attesa.",
    },
    office: {
      cases: "Casi",
      docs: "Documenti",
      approvals: "Approvazioni",
      deadlines: "Scadenze",
      client: "Cliente",
      status: "Stato",
      due: "Scadenza",
      owner: "Responsabile",
      open: "Aperto",
      review: "Revisione",
      done: "Chiuso",
    },
    cyber: {
      score: "Postura",
      findings: "Rilievi aperti",
      run: "Avvia assessment",
      running: "Assessment in corso…",
      done: "Assessment concluso",
      note: "Un assessment non è una certificazione. I risultati restano sotto revisione umana.",
      asset: "Asset",
      sev: "Gravità",
      export: "Esporta rapporto",
    },
    files: {
      name: "Nome",
      kind: "Tipo",
      size: "Dimensione",
      updated: "Modificato",
      empty: "Cartella vuota.",
      open: "Apri",
      newFile: "Nuovo file",
      newFolder: "Nuova cartella",
      rename: "Rinomina",
      delete: "Cestina",
      restore: "Ripristina",
      emptyTrash: "Svuota cestino",
    },
    mail: {
      inbox: "In arrivo",
      compose: "Scrivi",
      to: "A",
      subject: "Oggetto",
      send: "Invia",
      empty: "Seleziona un messaggio.",
    },
    notes: {
      new: "Nuova nota",
      empty: "Nessuna nota.",
      title: "Titolo",
    },
    cal: {
      week: "Questa settimana",
      today: "Oggi",
    },
    term: {
      welcome: "Luna shell · Kreluna 1.0\nDigita help per i comandi.",
    },
    settings: {
      system: "Sistema",
      identity: "Identità",
      language: "Lingua",
      appearance: "Aspetto",
      home: "Home",
      activity: "Attività recenti",
      activityHint: "Elenco da Office sulla home. Si nasconde se Office non è installato.",
      about: "Informazioni",
      signedIn: "Connesso",
      signedOut: "Ospite",
      signIn: "Accedi con Kreluna ID",
      guestHint: "Puoi usare il sistema come ospite. L’identità è opzionale.",
      version: "Versione",
      kernel: "Kernel",
      build: "Build",
      install: "Installa",
      installTitle: "Installa il Perimetro su questo dispositivo",
      installBody:
        "Kreluna sul tuo schermo: disco, orbe e .luna restano qui, a tutto schermo.",
      installNow: "Installa Kreluna",
      installDone: "Kreluna è già installato su questo dispositivo.",
      installHow:
        "Se il tasto non compare: menu del browser → Installa app, oppure Condividi → Aggiungi a Home.",
    },
    browser: {
      home: "Inizio",
      go: "Vai",
    },
    days: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    months: [
      "gennaio",
      "febbraio",
      "marzo",
      "aprile",
      "maggio",
      "giugno",
      "luglio",
      "agosto",
      "settembre",
      "ottobre",
      "novembre",
      "dicembre",
    ],
  },
  en: {
    bootTag: "Control. Clarity. Real work.",
    bootKernel: "Luna Kernel 1.0",
    lockHint: "Tap or press Enter to enter",
    lockGuest: "Operator",
    lockSub: "Local session · no telemetry",
    appleAbout: "About Kreluna",
    appleSleep: "Sleep",
    appleRestart: "Restart",
    appleShut: "Shut Down",
    appleAccount: "Kreluna identity",
    search: "Search",
    spotlightPh: "Search apps, files, actions…",
    noResults: "No results",
    dock: "Applications",
    notif: "Notifications",
    markRead: "Mark all read",
    emptyNotif: "Nothing new.",
    control: "Control Center",
    themeNight: "Night",
    themeDawn: "Dawn",
    langIt: "Italiano",
    langEn: "English",
    focus: "Focus",
    focusOn: "On",
    focusOff: "Off",
    net: "Network",
    netSecure: "Private link",
    posture: "Posture",
    postureOk: "Held",
    volume: "Presence",
    unlock: "Unlock",
    wake: "Tap to wake",
    shutMsg: "Kreluna is off.",
    sleepMsg: "Sleeping",
    aboutTitle: "Kreluna",
    aboutBody:
      "Kreluna is not an operating system. It is your Perimeter: disk, orbits, queue. Core prepares. You decide. Nothing starts alone.",
    aboutClose: "Close",
    pending: "Waiting for you",
    approve: "Approve",
    deny: "Deny",
    approved: "Approved",
    denied: "Denied",
    apps: {
      core: "Core",
      office: "Office",
      cyber: "Cyber",
      files: "Files",
      mail: "Mail",
      calendar: "Calendar",
      notes: "Notes",
      terminal: "Terminal",
      settings: "Settings",
      browser: "Navigation",
      calc: "Calculator",
      editor: "Editor",
      photos: "Photos",
      monitor: "Monitor",
      store: "Archive",
      clock: "Clock",
      paint: "Canvas",
      tasks: "Tasks",
      trash: "Trash",
      luna: "Luna",
      ponte: "Ponte",
    },
    appHint: {
      core: "Reasons with you. Does not decide for you.",
      office: "Cases, documents, deadlines, approvals.",
      cyber: "Assessment and priority — not invented certification.",
      files: "Local session archive.",
      mail: "Work correspondence.",
      calendar: "Week and reviews.",
      notes: "Persistent notes.",
      terminal: "Luna shell.",
      settings: "Identity, language, system.",
      browser: "Search here. Google opens.",
      calc: "Precise calculation, nothing else.",
      editor: "Writes to the file system.",
      photos: "Session images.",
      monitor: "Processes and resources.",
      store: "Install and remove modules.",
      clock: "Time, zones, timer.",
      paint: "Draw and save to the desk.",
      tasks: "Persistent list.",
      trash: "Removed files, recoverable.",
      luna: "Native format: packages, permissions, seal.",
      ponte: "Two Kreluna. They accept first. Then, if trusted, they find each other.",
    },
    widgets: {
      today: "Today",
      security: "Sentinel",
      cases: "In review",
    },
    core: {
      title: "Kreluna Core",
      sub: "Reads disk, queue and orbits. Does not decide.",
      ph: "Ask whatever you want…",
      send: "Send",
      thinking: "Kreluna is listening…",
      offline: "Core is not available in this environment. The rest of the system remains.",
      empty: "Core talks with you. Everyday too. The office only if you ask.",
      suggest1: "Hi, how are you?",
      suggest2: "Let’s talk, no office.",
      suggest3: "Summarise pending approvals.",
    },
    office: {
      cases: "Cases",
      docs: "Documents",
      approvals: "Approvals",
      deadlines: "Deadlines",
      client: "Client",
      status: "Status",
      due: "Due",
      owner: "Owner",
      open: "Open",
      review: "Review",
      done: "Closed",
    },
    cyber: {
      score: "Posture",
      findings: "Open findings",
      run: "Run assessment",
      running: "Assessment running…",
      done: "Assessment complete",
      note: "An assessment is not a certification. Results stay under human review.",
      asset: "Asset",
      sev: "Severity",
      export: "Export report",
    },
    files: {
      name: "Name",
      kind: "Type",
      size: "Size",
      updated: "Modified",
      empty: "Empty folder.",
      open: "Open",
      newFile: "New file",
      newFolder: "New folder",
      rename: "Rename",
      delete: "Move to trash",
      restore: "Restore",
      emptyTrash: "Empty trash",
    },
    mail: {
      inbox: "Inbox",
      compose: "Compose",
      to: "To",
      subject: "Subject",
      send: "Send",
      empty: "Select a message.",
    },
    notes: {
      new: "New note",
      empty: "No notes.",
      title: "Title",
    },
    cal: {
      week: "This week",
      today: "Today",
    },
    term: {
      welcome: "Luna shell · Kreluna 1.0\nType help for commands.",
    },
    settings: {
      system: "System",
      identity: "Identity",
      language: "Language",
      appearance: "Appearance",
      home: "Home",
      activity: "Recent activity",
      activityHint: "Office list on the home. Hidden if Office is not installed.",
      about: "About",
      signedIn: "Signed in",
      signedOut: "Guest",
      signIn: "Sign in with Kreluna ID",
      guestHint: "You can use the system as a guest. Identity is optional.",
      version: "Version",
      kernel: "Kernel",
      build: "Build",
      install: "Install",
      installTitle: "Install the Perimeter on this device",
      installBody:
        "Kreluna on your screen: disk, orbits and .luna stay here, full screen.",
      installNow: "Install Kreluna",
      installDone: "Kreluna is already installed on this device.",
      installHow:
        "If the button does not appear: browser menu → Install app, or Share → Add to Home Screen.",
    },
    browser: {
      home: "Home",
      go: "Go",
    },
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
} as const;

export type Copy = {
  bootTag: string;
  bootKernel: string;
  lockHint: string;
  lockGuest: string;
  lockSub: string;
  appleAbout: string;
  appleSleep: string;
  appleRestart: string;
  appleShut: string;
  appleAccount: string;
  search: string;
  spotlightPh: string;
  noResults: string;
  dock: string;
  notif: string;
  markRead: string;
  emptyNotif: string;
  control: string;
  themeNight: string;
  themeDawn: string;
  langIt: string;
  langEn: string;
  focus: string;
  focusOn: string;
  focusOff: string;
  net: string;
  netSecure: string;
  posture: string;
  postureOk: string;
  volume: string;
  unlock: string;
  wake: string;
  shutMsg: string;
  sleepMsg: string;
  aboutTitle: string;
  aboutBody: string;
  aboutClose: string;
  pending: string;
  approve: string;
  deny: string;
  approved: string;
  denied: string;
  apps: Record<string, string>;
  appHint: Record<string, string>;
  widgets: { today: string; security: string; cases: string };
  core: Record<string, string>;
  office: Record<string, string>;
  cyber: Record<string, string>;
  files: Record<string, string>;
  mail: Record<string, string>;
  notes: Record<string, string>;
  cal: Record<string, string>;
  term: { welcome: string };
  settings: Record<string, string>;
  browser: Record<string, string>;
  days: readonly string[];
  months: readonly string[];
};

export function t(lang: Lang): Copy {
  return dict[lang] as Copy;
}
