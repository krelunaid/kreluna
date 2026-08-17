/**
 * Preview OAuth (server-only). Secrets come from the environment, never from git.
 */
export const PREVIEW_CLIENT_ID =
  process.env.KRELUNA_AUTH_CLIENT_ID || process.env.GROK_AUTH_CLIENT_ID || "";
export const PREVIEW_CLIENT_SECRET =
  process.env.KRELUNA_AUTH_CLIENT_SECRET || process.env.GROK_AUTH_CLIENT_SECRET || "";

export const GROK_ISSUER_DEFAULT =
  process.env.KRELUNA_AUTH_ISSUER || process.env.GROK_AUTH_ISSUER || "https://auth.grok.me";

export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
