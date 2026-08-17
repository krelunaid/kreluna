import { useState } from "react";
import { LunaMark } from "./Mark";
import { Wallpaper } from "./Wallpaper";
import { useOs } from "@/lib/os/store";

export function Setup() {
  const lang = useOs((s) => s.lang);
  const setLang = useOs((s) => s.setLang);
  const theme = useOs((s) => s.theme);
  const setTheme = useOs((s) => s.setTheme);
  const finishSetup = useOs((s) => s.finishSetup);
  const [name, setName] = useState("");
  const [step, setStep] = useState(0);

  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-ink text-paper">
      <Wallpaper dim={0.55} />
      <div className="relative z-10 w-[min(420px,92vw)] rounded-2xl bg-ink-2/90 p-8 shadow-panel backdrop-blur-xl">
        <LunaMark className="mx-auto size-10" />
        {step === 0 && (
          <>
            <h1 className="mt-5 text-center font-display text-3xl tracking-[-0.03em]">
              {lang === "it" ? "Installa Kreluna" : "Install Kreluna"}
            </h1>
            <p className="mt-2 text-center text-sm text-mist">
              {lang === "it"
                ? "Un sistema, non un’immagine. Lingua, identità, poi il disco."
                : "A system, not a picture. Language, identity, then the disk."}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLang("it")}
                className={`rounded-xl py-3 text-sm ${lang === "it" ? "bg-luna text-luna-ink" : "bg-ink-3"}`}
              >
                Italiano
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-xl py-3 text-sm ${lang === "en" ? "bg-luna text-luna-ink" : "bg-ink-3"}`}
              >
                English
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-6 w-full rounded-xl bg-luna py-2.5 text-sm font-medium text-luna-ink"
            >
              {lang === "it" ? "Continua" : "Continue"}
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="mt-5 text-center font-display text-3xl tracking-[-0.03em]">
              {lang === "it" ? "Chi opera" : "Who operates"}
            </h1>
            <p className="mt-2 text-center text-sm text-mist">
              {lang === "it"
                ? "Il nome resta sul dispositivo. Nessun account obbligatorio."
                : "The name stays on this device. No account required."}
            </p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "it" ? "Il tuo nome" : "Your name"}
              className="mt-6 h-11 w-full rounded-xl bg-ink-3 px-3 text-sm outline-none"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme("night")}
                className={`rounded-xl py-2.5 text-sm ${theme === "night" ? "bg-luna text-luna-ink" : "bg-ink-3"}`}
              >
                {lang === "it" ? "Notte" : "Night"}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dawn")}
                className={`rounded-xl py-2.5 text-sm ${theme === "dawn" ? "bg-luna text-luna-ink" : "bg-ink-3"}`}
              >
                {lang === "it" ? "Alba" : "Dawn"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => finishSetup(name)}
              className="mt-6 w-full rounded-xl bg-luna py-2.5 text-sm font-medium text-luna-ink"
            >
              {lang === "it" ? "Avvia il sistema" : "Start the system"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
