type CoreRequest = {
  data: {
    prompt: string;
    lang: "it" | "en";
    context: string;
  };
};

/**
 * Desktop builds never contain provider secrets. Until the authenticated
 * Kreluna backend is configured, Core automatically uses its local engine.
 */
export async function askCore(_request: CoreRequest) {
  return { ok: false as const, error: "desktop-local" };
}
