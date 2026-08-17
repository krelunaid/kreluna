import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { LunaMark } from "@/components/os/Mark";
import { Wallpaper } from "@/components/os/Wallpaper";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-ink px-6 text-paper">
      <Wallpaper dim={0.5} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-ink-2/90 p-8 shadow-panel backdrop-blur-xl">
        <LunaMark className="mx-auto size-10" />
        <h1 className="mt-5 text-center font-display text-3xl tracking-[-0.03em]">Kreluna ID</h1>
        <p className="mt-2 text-center text-sm text-mist">
          Stesso account del telefono. Da lì comandi il Perimetro.
        </p>
        <div className="mt-6 space-y-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="w-full rounded-xl bg-luna px-4 py-2.5 text-sm font-medium text-luna-ink"
              >
                Continua con {p.label}
              </button>
            ))
          ) : (
            <p className="text-center text-sm text-mist">Accesso disattivato.</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => nav({ to: "/" })}
          className="mt-5 w-full text-center text-sm text-mist hover:text-paper"
        >
          Torna al sistema
        </button>
      </div>
    </main>
  );
}
