import { velvetWaitlist } from "../../../db/schema";
import { getDb } from "../../../db";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistPayload = {
  email?: string;
  audience?: "customer" | "restaurant";
  restaurantName?: string;
  city?: string;
  source?: string;
  website?: string;
  consent?: boolean;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as WaitlistPayload;
    const email = clean(payload.email, 254).toLowerCase();
    const audience = payload.audience;
    const restaurantName = clean(payload.restaurantName, 120);
    const city = clean(payload.city, 100);
    const source = clean(payload.source, 80) || "velvet-page";

    if (payload.website) {
      return Response.json({ ok: true }, { status: 201 });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return Response.json({ error: "Inserisci un indirizzo email valido." }, { status: 400 });
    }
    if (audience !== "customer" && audience !== "restaurant") {
      return Response.json({ error: "Scegli se sei un cliente o un ristoratore." }, { status: 400 });
    }
    if (!payload.consent) {
      return Response.json({ error: "È necessario accettare l’informativa per ricevere l’avviso." }, { status: 400 });
    }

    const db = getDb();
    await db
      .insert(velvetWaitlist)
      .values({
        email,
        audience,
        restaurantName: audience === "restaurant" ? restaurantName || null : null,
        city: audience === "restaurant" ? city || null : null,
        source,
      })
      .onConflictDoUpdate({
        target: [velvetWaitlist.email, velvetWaitlist.audience],
        set: {
          restaurantName: audience === "restaurant" ? restaurantName || null : null,
          city: audience === "restaurant" ? city || null : null,
          source,
          consentVersion: "2026-08-25",
        },
      });

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Velvet waitlist submission failed", error);
    return Response.json(
      { error: "Non siamo riusciti a completare l’iscrizione. Riprova tra poco." },
      { status: 500 },
    );
  }
}
