import type { Approval, FsNode, Lang, MailItem, Note, OrbitId, TaskItem } from "./types";

export interface ReasonInput {
  prompt: string;
  lang: Lang;
  operator: string;
  orbit: OrbitId;
  approvals: Approval[];
  fs: FsNode[];
  notes: Note[];
  mails: MailItem[];
  tasks: TaskItem[];
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function words(q: string) {
  return q.split(/\s+/).filter((w) => w.length > 4);
}

function hitText(q: string, ...parts: (string | undefined)[]) {
  const blob = norm(parts.filter(Boolean).join(" "));
  return words(q).some((w) => blob.includes(w));
}

function isDesk(q: string) {
  return (
    q.includes("approv") ||
    q.includes("coda") ||
    q.includes("ufficio") ||
    q.includes("office") ||
    q.includes("file") ||
    q.includes("cartell") ||
    q.includes("document") ||
    q.includes("contratt") ||
    q.includes("cliente") ||
    q.includes("scadenz") ||
    q.includes("mail") ||
    q.includes("posta") ||
    q.includes("compito") ||
    q.includes("cyber") ||
    q.includes("sicurez") ||
    q.includes(".luna") ||
    q.includes("pacchett") ||
    q.includes("kernel") ||
    q.includes("impiant")
  );
}

function casual(input: ReasonInput, q: string): string | null {
  const it = input.lang === "it";
  const who = input.operator || (it ? "Operatore" : "Operator");

  if (/^(ciao|hey|ehi|salve|buongiorno|buonasera|hola|hi|hello)\b/.test(q) || q === "ciao") {
    return it
      ? `Ciao ${who}. Ci sono. Parla come ti pare: casa, una idea, o il disco. Non solo ufficio.`
      : `Hi ${who}. I’m here. Talk however you like: home, an idea, or the disk. Not only the office.`;
  }
  if (q.includes("come stai") || q.includes("come va") || q.includes("tutto bene") || q.includes("how are you")) {
    return it
      ? `Sto bene. Sono qui, sul Perimetro. Se vuoi chiacchierare, chiacchieriamo. Se vuoi il tavolo, lo apro.`
      : `I’m fine. I’m here on the Perimeter. If you want to talk, we talk. If you want the desk, I open it.`;
  }
  if (q.includes("chi sei") || q.includes("chi e") || q.includes("who are you") || q.includes("ti chiami")) {
    return it
      ? `Sono Core. La voce di Kreluna. Non sono Office: quello è il tavolo. Io ti parlo. Se una cosa deve uscire, la metto in coda e premi tu.`
      : `I’m Core. Kreluna’s voice. I’m not Office — that’s the table. I talk with you. If something must leave, it goes to the queue.`;
  }
  if (q.includes("grazie") || q.includes("thank")) {
    return it ? `Di niente. Dimmi pure.` : `You’re welcome. Go on.`;
  }
  if (
    q.includes("cosa puoi") ||
    q.includes("che sai fare") ||
    q.includes("aiutami") ||
    q.includes("what can you")
  ) {
    return it
      ? `Due cose, ${who}.

Normale: parliamo. Una idea, una domanda, casa, Personale.
Tavolo: file, coda, orbe. Leggo e preparo. Non invio da solo.

Tu scegli il tono. Io non ti riporto sempre in ufficio.`
      : `Two things, ${who}. Everyday talk, and the desk. You pick the tone. I won’t drag you back to the office.`;
  }
  if (
    q.includes("parliam") ||
    q.includes("chiacchier") ||
    q.includes("annoi") ||
    q.includes("racconta") ||
    q.includes("senza ufficio") ||
    q.includes("normale")
  ) {
    return it
      ? `Va bene. Niente coda, niente clienti.

Dimmi una cosa tua: una giornata, un dubbio, un nome, anche una sciocchezza. Io rispondo semplice. Se poi serve il disco, lo apriamo.`
      : `Fine. No queue, no clients. Tell me something of yours. I’ll answer simply.`;
  }
  if (q.includes("barzelletta") || q.includes("joke") || q.includes("una storia")) {
    return it
      ? `Due Perimetri si incontrano. Uno dice: «Taglia». L’altro: «Non ho ancora detto sì». Fine. Meglio così, no?`
      : `Two Perimeters meet. One says “Cut.” The other: “I haven’t said yes.” That’s the joke. And the rule.`;
  }
  if (input.orbit === "personale" && !isDesk(q)) {
    return it
      ? `${who}, sei su Personale. Qui non è ufficio.

Ho letto: «${input.prompt.trim()}». Ti ascolto. Dimmi di più, o cambia verso. Non ti apro la coda se non la chiedi.`
      : `${who}, you’re on Personal. Not the office. I heard you. Tell me more.`;
  }
  return null;
}

export function reasonLocally(input: ReasonInput): string {
  const q = norm(input.prompt);
  const it = input.lang === "it";
  const pending = input.approvals.filter((a) => a.status === "pending");
  const files = input.fs.filter((n) => n.kind === "file" && !n.trashed);
  const luna = files.filter((n) => n.mime === "luna");
  const who = input.operator || (it ? "Operatore" : "Operator");

  const soft = casual(input, q);
  if (soft) return soft;

  if (
    (q.includes("come") && (q.includes("ragion") || q.includes("funzion") || q.includes("pens"))) ||
    q.includes("come fa")
  ) {
    return it
      ? `Kreluna ragiona così.

Se mi parli normale, ti rispondo normale.
Se mi parli del disco o della coda, li apro.
Non decido. Non invio. Non ti riporto in ufficio se non ci sei andato tu.`
      : `Kreluna reasons like this. Everyday talk stays everyday. The desk opens only if you ask. I do not decide.`;
  }

  if (q.includes("kernel") || q.includes("impiant") || q.includes("senza linux") || q.includes("bare")) {
    return it
      ? `Il kernel lo prepari tu. Kreluna ha già l’impianto: Kreluna.sys.luna, ABI K0, Init.`
      : `You prepare the kernel. Kreluna already has the implant: Kreluna.sys.luna.`;
  }

  const asksDiff =
    (q.includes("differen") || q.includes("distin") || q.includes("vs") || q.includes("oppure")) &&
    (q.includes("core") || q.includes("office") || q.includes("cyber"));
  if (asksDiff || (q.includes("core") && q.includes("office") && q.includes("cyber"))) {
    return it
      ? `Core parla con te. Anche normale.
Office è il tavolo: coda ora ${pending.length}.
Cyber è la postura.

Nessuno preme al posto di ${who}.`
      : `Core talks with you, including everyday. Office is the table (${pending.length} waiting). Cyber is posture.`;
  }

  if (q.includes("approv") || q.includes("coda") || q.includes("in attesa") || q.includes("pending") || q.includes("riassum")) {
    if (!pending.length) {
      return it ? `Niente in coda. Sei libero, ${who}.` : `Nothing in queue. You’re clear, ${who}.`;
    }
    const list = pending.map((a) => `• ${a.title} — ${a.risk}`).join("\n");
    return it
      ? `In coda, se ti serve:\n\n${list}\n\nAltrimenti lasciamo stare.`
      : `In queue, if you need it:\n\n${list}`;
  }

  if (isDesk(q)) {
    const matchedFiles = files.filter((n) => hitText(q, n.name, n.content)).slice(0, 4);
    const matchedNotes = input.notes.filter((n) => hitText(q, n.title, n.body)).slice(0, 2);
    const matchedMail = input.mails.filter((m) => hitText(q, m.from, m.subject, m.body)).slice(0, 2);
    const matchedTasks = input.tasks.filter((t) => hitText(q, t.title)).slice(0, 3);
    if (matchedFiles.length || matchedNotes.length || matchedMail.length || matchedTasks.length) {
      const bits: string[] = [];
      for (const n of matchedFiles) bits.push(`File · ${n.name}`);
      for (const n of matchedNotes) bits.push(it ? `Nota · ${n.title}` : `Note · ${n.title}`);
      for (const m of matchedMail) bits.push(`Mail · ${m.subject}`);
      for (const t of matchedTasks) bits.push(it ? `Compito · ${t.title}` : `Task · ${t.title}`);
      return it
        ? `Sul disco c’entra questo:\n\n${bits.map((b) => `• ${b}`).join("\n")}\n\nPosso preparare. Non mando.`
        : `On disk this fits:\n\n${bits.map((b) => `• ${b}`).join("\n")}`;
    }
  }

  if (q.includes("office") || q.includes("ufficio")) {
    return it
      ? `Office è il tavolo, non la conversazione. Coda: ${pending.length}. Se volevi parlare, parla: io resto qui.`
      : `Office is the table, not the chat. Queue: ${pending.length}.`;
  }

  if (q.includes("cyber") || q.includes("sicurez") || q.includes("secur")) {
    return it
      ? `Cyber è la postura. Valuta. Non certifica. Se volevi altro, dimmi altro.`
      : `Cyber is posture. It assesses. It does not certify.`;
  }

  if (q.includes("luna") || q.includes(".luna") || q.includes("pacchett")) {
    return it
      ? `.luna è il pacchetto nativo. Sul disco: ${luna.length}. Un .exe si conserva, non si esegue.`
      : `.luna is the native package. On disk: ${luna.length}.`;
  }

  if (q.includes("orbita") || (q.includes("orb") && isDesk(q))) {
    return it
      ? `Sei sull’orbita ${input.orbit}. Personale è per il resto della vita. Lavoro è il tavolo.`
      : `You are on orbit ${input.orbit}.`;
  }

  return it
    ? `${who}, ho capito. Non ti butto in ufficio.

«${input.prompt.trim()}»

Rispondi o allunga. Se è casa, idea, dubbio: resto qui. Se è un file o la coda, dimmelo e li apro.`
    : `${who}, I won’t push you to the office. Go on. If it’s the desk, say so.`;
}
