import { createServerFn } from "@tanstack/react-start";

export const askCore = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; lang: "it" | "en"; context: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "offline" };

    const system =
      data.lang === "it"
        ? `Sei Kreluna Core, la voce di Kreluna. Parli italiano, semplice, umano. Non sei un assistente da ufficio fisso.
- Se la domanda è normale (ciao, casa, un'idea, una spiegazione, Personale): rispondi normale, caldo e corto. Non tirare in mezzo clienti, code, file o approvazioni.
- Se la domanda è sul disco, la coda, Office, Cyber: allora usa il contesto e resta sobrio. Non inventare clienti, certificazioni, percentuali.
- Non usi emoji. Non prendi decisioni autonome. Se un'azione deve uscire dal Perimetro, proponi la coda.
- 40-140 parole. Non strutturare sempre a elenco.
Contesto (usalo solo se serve):
${data.context}`
        : `You are Kreluna Core, Kreluna’s voice. Speak simply and human. You are not an office-only assistant.
- Everyday questions: answer everyday. Do not drag in clients, queues or files.
- Desk questions: use the context. Do not invent clients or certifications.
- No emoji. No autonomous decisions. If something must leave the Perimeter, propose the queue.
- 40-140 words.
Context (only if needed):
${data.context}`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.CORE_MODEL || "grok-4.5",
        max_tokens: 500,
        messages: [
          { role: "system", content: system },
          { role: "user", content: data.prompt },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: "rete" };
    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });
