import { sealManifest, serializeLuna, type LunaManifest } from "./luna";

export const KERNEL_ABI = "kreluna-k0";
export const INIT_ENTRY = "kreluna.init";

export const KERNEL_NEEDS = [
  { id: "fb", it: "Framebuffer lineare, 32-bit, niente compositor Linux", en: "Linear 32-bit framebuffer, no Linux compositor" },
  { id: "hid", it: "Tastiera e puntatore (PS/2 o USB HID grezzo)", en: "Keyboard and pointer (PS/2 or raw USB HID)" },
  { id: "blk", it: "Blocco disco: lettura/scrittura LBA, niente ext4 obbligatorio", en: "Block disk: LBA read/write, ext4 not required" },
  { id: "rtc", it: "Orologio tempo reale", en: "Real-time clock" },
  { id: "mem", it: "Mappa fisica: Init riceve un range usabile", en: "Physical map: Init receives a usable range" },
  { id: "no-syscall-linux", it: "Niente syscall Linux. Il kernel parla K0, non POSIX.", en: "No Linux syscalls. The kernel speaks K0, not POSIX." },
] as const;

export function buildSystemImage(operator: string): LunaManifest {
  return sealManifest({
    format: "luna-1",
    runtime: "luna-1",
    humanGate: true,
    id: "kreluna.sys",
    name: { it: "Kreluna Impianto", en: "Kreluna Implant" },
    version: "1.0.0",
    kind: "system",
    entry: INIT_ENTRY,
    author: "Kreluna",
    summary: {
      it: "Userspace pronto. Il kernel mercoledì deve offrire K0: schermo, input, disco. Init parte da qui, senza Linux.",
      en: "Userspace ready. Wednesday’s kernel must offer K0: display, input, disk. Init starts here, no Linux.",
    },
    permissions: [
      { id: "fs.read", scope: "/", grant: "allow", why: "Init legge l’immagine di sistema." },
      { id: "fs.write", scope: "/", grant: "ask", why: "Scrivere il disco solo con l’operatore." },
      { id: "act.send", scope: "any", grant: "deny", why: "L’impianto non parla con la rete da solo." },
      { id: "net.out", scope: "none", grant: "deny", why: "Niente rete in fase di avvio." },
      { id: "identity", scope: "operator", grant: "allow", why: `Operatore impiantato: ${operator || "ospite"}.` },
    ],
    capabilities: [KERNEL_ABI, INIT_ENTRY, "no-linux", "no-posix", "human-gate"],
    files: [
      { path: "init.luna", role: "init" },
      { path: "manifest.json", role: "manifest" },
      { path: "abi/k0.md", role: "contract" },
    ],
  });
}

export function serializeSystemImage(operator: string) {
  const pkg = buildSystemImage(operator);
  const body = serializeLuna(pkg);
  const contract = [
    "# K0 — contratto kernel",
    "",
    `ABI ${KERNEL_ABI}`,
    `Init ${INIT_ENTRY}`,
    "",
    "Il kernel non è Linux. Non espone POSIX.",
    "Offre: framebuffer, HID, blocco, RTC, mappa memoria.",
    "Carica questo .luna, verifica il sigillo, passa il controllo a Init.",
    "Init avvia Core, Office, Cyber. Niente parte da solo.",
    "",
    ...KERNEL_NEEDS.map((n) => `- ${n.id}: ${n.it}`),
  ].join("\n");
  return `${body}\n\n# --- K0 ---\n${contract}\n`;
}
