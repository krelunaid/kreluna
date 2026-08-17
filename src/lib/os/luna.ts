import type { AppId, Lang, OrbitId } from "./types";

export const LUNA_MAGIC = "LUNA/1";
export const LUNA_RUNTIME = "luna-1";
export const LUNA_FORMAT = "luna-1";

export type LunaKind = "app" | "flow" | "orbit" | "library" | "system";
export type LunaGrant = "allow" | "deny" | "ask";
export type LunaPermId =
  | "fs.read"
  | "fs.write"
  | "net.out"
  | "act.send"
  | "act.pay"
  | "notify"
  | "identity";

export interface LunaPermission {
  id: LunaPermId;
  scope: string;
  grant: LunaGrant;
  why: string;
}

export interface LunaManifest {
  format: typeof LUNA_FORMAT;
  id: string;
  name: { it: string; en: string };
  version: string;
  kind: LunaKind;
  runtime: typeof LUNA_RUNTIME;
  entry?: string;
  appId?: AppId;
  author: string;
  orbit?: OrbitId;
  summary: { it: string; en: string };
  permissions: LunaPermission[];
  capabilities: string[];
  humanGate: true;
  files?: { path: string; role: string }[];
  seal: {
    algo: "luna-fp1";
    fingerprint: string;
    signedBy: string;
    policy: "human-install";
  };
}

export interface LunaIssue {
  code: "not-luna" | "windows-pe" | "bad-json" | "runtime" | "no-gate" | "seal" | "missing";
  message: string;
}

export type LunaParse =
  | { ok: true; pkg: LunaManifest; raw: string }
  | { ok: false; issues: LunaIssue[]; raw: string };

const REQUIRED: (keyof LunaManifest)[] = [
  "format",
  "id",
  "name",
  "version",
  "kind",
  "runtime",
  "author",
  "summary",
  "permissions",
  "humanGate",
];

export function fnv1a(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function canonical(manifest: Omit<LunaManifest, "seal">) {
  return JSON.stringify(manifest, Object.keys(manifest).sort());
}

export function fingerprintOf(manifest: Omit<LunaManifest, "seal">) {
  return `luna-fp1:${fnv1a(canonical(manifest))}`;
}

export function sealManifest(
  manifest: Omit<LunaManifest, "seal">,
  signedBy = "kreluna.system",
): LunaManifest {
  return {
    ...manifest,
    seal: {
      algo: "luna-fp1",
      fingerprint: fingerprintOf(manifest),
      signedBy,
      policy: "human-install",
    },
  };
}

export function serializeLuna(pkg: LunaManifest) {
  return `${LUNA_MAGIC}\n# Native Kreluna package. Not PE, not ELF, not Mach-O.\n\n${JSON.stringify(pkg, null, 2)}\n`;
}

function isPe(raw: string) {
  return raw.charCodeAt(0) === 0x4d && raw.charCodeAt(1) === 0x5a;
}

export function parseLuna(raw: string): LunaParse {
  const text = raw.replace(/^\uFEFF/, "");
  if (isPe(text)) {
    return {
      ok: false,
      raw,
      issues: [
        {
          code: "windows-pe",
          message: "Intestazione MZ: è un .exe Windows, non un pacchetto Luna.",
        },
      ],
    };
  }
  if (!text.startsWith(LUNA_MAGIC)) {
    try {
      const loose = JSON.parse(text) as LunaManifest;
      if (loose.format === LUNA_FORMAT) return validate(loose, raw);
    } catch {
      /* fallthrough */
    }
    return {
      ok: false,
      raw,
      issues: [{ code: "not-luna", message: "Manca la firma LUNA/1 in testa al file." }],
    };
  }
  const jsonStart = text.indexOf("{");
  if (jsonStart < 0) {
    return { ok: false, raw, issues: [{ code: "bad-json", message: "Nessun manifesto JSON dopo LUNA/1." }] };
  }
  try {
    const body = JSON.parse(text.slice(jsonStart)) as LunaManifest;
    return validate(body, raw);
  } catch {
    return { ok: false, raw, issues: [{ code: "bad-json", message: "Manifesto JSON non valido." }] };
  }
}

function validate(body: LunaManifest, raw: string): LunaParse {
  const issues: LunaIssue[] = [];
  for (const key of REQUIRED) {
    if (body[key] == null) {
      issues.push({ code: "missing", message: `Campo obbligatorio assente: ${key}` });
    }
  }
  if (body.runtime && body.runtime !== LUNA_RUNTIME) {
    issues.push({ code: "runtime", message: `Runtime ${body.runtime} non è ${LUNA_RUNTIME}.` });
  }
  if (body.format && body.format !== LUNA_FORMAT) {
    issues.push({ code: "runtime", message: `Formato ${body.format} sconosciuto.` });
  }
  if (body.humanGate !== true) {
    issues.push({
      code: "no-gate",
      message: "humanGate deve essere true: un .luna non può agire da solo.",
    });
  }
  if (body.seal?.fingerprint) {
    const { seal: _s, ...rest } = body;
    const expect = fingerprintOf(rest);
    if (expect !== body.seal.fingerprint) {
      issues.push({
        code: "seal",
        message: "Impronta del sigillo non coincide col manifesto. Il pacchetto è stato alterato.",
      });
    }
  } else {
    issues.push({ code: "seal", message: "Manca il sigillo luna-fp1." });
  }
  if (issues.length) return { ok: false, issues, raw };
  return { ok: true, pkg: body, raw };
}

export function permLabel(id: LunaPermId, lang: Lang) {
  const it: Record<LunaPermId, string> = {
    "fs.read": "Lettura disco",
    "fs.write": "Scrittura disco",
    "net.out": "Rete in uscita",
    "act.send": "Invio azioni",
    "act.pay": "Pagamenti",
    notify: "Notifiche",
    identity: "Identità operatore",
  };
  const en: Record<LunaPermId, string> = {
    "fs.read": "Read disk",
    "fs.write": "Write disk",
    "net.out": "Outbound network",
    "act.send": "Send actions",
    "act.pay": "Payments",
    notify: "Notifications",
    identity: "Operator identity",
  };
  return lang === "it" ? it[id] : en[id];
}

export function kindLabel(kind: LunaKind, lang: Lang) {
  const map = {
    app: { it: "Applicazione", en: "Application" },
    flow: { it: "Flusso", en: "Flow" },
    orbit: { it: "Orbita", en: "Orbit" },
    library: { it: "Libreria", en: "Library" },
    system: { it: "Impianto", en: "Implant" },
  };
  return lang === "it" ? map[kind].it : map[kind].en;
}

function pkg(
  manifest: Omit<LunaManifest, "seal" | "format" | "runtime" | "humanGate"> & {
    humanGate?: true;
  },
): LunaManifest {
  return sealManifest({
    format: LUNA_FORMAT,
    runtime: LUNA_RUNTIME,
    humanGate: true,
    ...manifest,
  });
}

export const PACKAGES: LunaManifest[] = [
  pkg({
    id: "kreluna.core",
    name: { it: "Core", en: "Core" },
    version: "1.0.0",
    kind: "app",
    entry: "kreluna://app/core",
    appId: "core",
    author: "Kreluna",
    orbit: "lavoro",
    summary: {
      it: "Ragiona con te. Prepara, non decide.",
      en: "Reasons with you. Prepares, never decides.",
    },
    permissions: [
      { id: "fs.read", scope: "/Documenti", grant: "allow", why: "Leggere le bozze su cui ragionare." },
      { id: "fs.write", scope: "/Documenti", grant: "ask", why: "Scrivere solo dopo di te." },
      { id: "act.send", scope: "any", grant: "deny", why: "Core non invia nulla da solo." },
      { id: "net.out", scope: "none", grant: "deny", why: "Nessuna rete in uscita." },
      { id: "identity", scope: "operator", grant: "allow", why: "Sa con chi sta parlando." },
    ],
    capabilities: ["reason", "draft", "never-autonomous"],
    files: [
      { path: "manifest.json", role: "manifest" },
      { path: "ui.luna", role: "view" },
    ],
  }),
  pkg({
    id: "kreluna.office",
    name: { it: "Office", en: "Office" },
    version: "1.0.0",
    kind: "app",
    entry: "kreluna://app/office",
    appId: "office",
    author: "Kreluna",
    orbit: "lavoro",
    summary: {
      it: "Casi, scadenze, approvazioni. L’invio resta umano.",
      en: "Cases, deadlines, approvals. Sending stays human.",
    },
    permissions: [
      { id: "fs.read", scope: "/Documenti/Lavoro", grant: "allow", why: "Aprire i fascicoli." },
      { id: "fs.write", scope: "/Documenti/Lavoro", grant: "ask", why: "Aggiornare solo con conferma." },
      { id: "act.send", scope: "mail", grant: "ask", why: "Ogni invio è una coda di approvazione." },
      { id: "notify", scope: "operator", grant: "allow", why: "Avvisarti delle scadenze." },
    ],
    capabilities: ["cases", "deadlines", "approval-queue"],
  }),
  pkg({
    id: "kreluna.cyber",
    name: { it: "Cyber", en: "Cyber" },
    version: "1.0.0",
    kind: "app",
    entry: "kreluna://app/cyber",
    appId: "cyber",
    author: "Kreluna",
    orbit: "lavoro",
    summary: {
      it: "Valuta e prioritizza. Non certifica.",
      en: "Assesses and prioritises. Does not certify.",
    },
    permissions: [
      { id: "fs.read", scope: "/Sistema", grant: "allow", why: "Leggere i rilievi interni." },
      { id: "act.send", scope: "report", grant: "ask", why: "Esportare un rapporto è una decisione tua." },
      { id: "net.out", scope: "none", grant: "deny", why: "Niente telemetria." },
    ],
    capabilities: ["assess", "no-certification"],
  }),
  pkg({
    id: "kreluna.flow.fatture",
    name: { it: "Flusso fatture", en: "Invoice flow" },
    version: "1.1.0",
    kind: "flow",
    entry: "kreluna://flow/fatture",
    author: "Studio Kreluna",
    orbit: "finanza",
    summary: {
      it: "Prepara scadenze e bozze. Non paga, non invia.",
      en: "Prepares due dates and drafts. Does not pay or send.",
    },
    permissions: [
      { id: "fs.read", scope: "/Documenti/Fatture", grant: "allow", why: "Elenco fatture e scadenze." },
      { id: "act.pay", scope: "any", grant: "deny", why: "Nessun pagamento automatico." },
      { id: "act.send", scope: "mail", grant: "ask", why: "Solleciti solo se li approvi." },
    ],
    capabilities: ["schedule", "draft", "never-pay"],
  }),
  pkg({
    id: "studio.note.personale",
    name: { it: "Note di orbita", en: "Orbit notes" },
    version: "0.9.2",
    kind: "library",
    entry: "kreluna://lib/notes",
    author: "Luca",
    orbit: "personale",
    summary: {
      it: "Libreria di appunti legata all’orbita Personale.",
      en: "Notes library bound to the Personal orbit.",
    },
    permissions: [
      { id: "fs.read", scope: "/Documenti/Famiglia", grant: "allow", why: "Leggere gli appunti." },
      { id: "fs.write", scope: "/Documenti/Famiglia", grant: "ask", why: "Scrivere solo se lo chiedi." },
      { id: "net.out", scope: "none", grant: "deny", why: "Resta sul disco Kreluna." },
    ],
    capabilities: ["notes", "offline"],
  }),
];

export function packageFileName(pkg: LunaManifest) {
  const short = pkg.id.split(".").slice(-1)[0] ?? pkg.id;
  return `${short[0]?.toUpperCase()}${short.slice(1)}.luna`;
}
