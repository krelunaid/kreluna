import { useMemo, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { readCaps } from "@/lib/os/compat";
import { useInstall } from "@/lib/os/install";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { SAVER_OPTS, WALLS } from "@/lib/os/walls";
import { cn } from "@/lib/utils";

export function SettingsApp() {
  const lang = useOs((s) => s.lang);
  const theme = useOs((s) => s.theme);
  const setLang = useOs((s) => s.setLang);
  const setTheme = useOs((s) => s.setTheme);
  const wallId = useOs((s) => s.wallId);
  const setWall = useOs((s) => s.setWall);
  const wallDim = useOs((s) => s.wallDim);
  const setWallDim = useOs((s) => s.setWallDim);
  const brightness = useOs((s) => s.brightness);
  const setBrightness = useOs((s) => s.setBrightness);
  const saverMin = useOs((s) => s.saverMin);
  const setSaverMin = useOs((s) => s.setSaverMin);
  const saverClock = useOs((s) => s.saverClock);
  const setSaverClock = useOs((s) => s.setSaverClock);
  const pinHash = useOs((s) => s.pinHash);
  const setPin = useOs((s) => s.setPin);
  const clearPin = useOs((s) => s.clearPin);
  const lockMin = useOs((s) => s.lockMin);
  const setLockMin = useOs((s) => s.setLockMin);
  const coreNet = useOs((s) => s.coreNet);
  const setCoreNet = useOs((s) => s.setCoreNet);
  const lockNow = useOs((s) => s.lock);
  const startSaver = useOs((s) => s.startSaver);
  const showActivity = useOs((s) => s.showActivity);
  const setShowActivity = useOs((s) => s.setShowActivity);
  const showReminders = useOs((s) => s.showReminders);
  const setShowReminders = useOs((s) => s.setShowReminders);
  const setAbout = useOs((s) => s.setAbout);
  const operator = useOs((s) => s.operator);
  const setOperator = useOs((s) => s.setOperator);
  const lite = useOs((s) => s.lite);
  const setLite = useOs((s) => s.setLite);
  const implant = useOs((s) => s.implant);
  const openNode = useOs((s) => s.openNode);
  const fs = useOs((s) => s.fs);
  const planted = fs.some((n) => n.name === "Kreluna.sys.luna" && !n.trashed);
  const copy = t(lang);
  const { user, isPending } = useCurrentUserState();
  const { canInstall, standalone, install, host } = useInstall();
  const caps = useMemo(() => readCaps(), []);
  const desktop =
    typeof document !== "undefined" &&
    (document.documentElement.dataset.krelunaHost === "desktop" ||
      (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window));
  const [pinDraft, setPinDraft] = useState("");
  const [pinMsg, setPinMsg] = useState("");

  return (
    <div className="h-full overflow-auto p-5">
      <section>
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.settings.identity}</p>
        <div className="mt-2 rounded-xl bg-ink-3 p-4">
          <label className="block text-xs text-mist">{lang === "it" ? "Operatore locale" : "Local operator"}</label>
          <input
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="mt-2 h-10 w-full rounded-lg bg-ink-4 px-3 text-sm outline-none"
          />
        </div>
        <div className="mt-2 rounded-xl bg-ink-3 p-4">
          {isPending ? (
            <div className="h-8 w-40 animate-pulse rounded-lg bg-ink-4" />
          ) : (
            <>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <p className="text-sm font-medium">{copy.settings.signedOut}</p>
                <p className="mt-1 text-xs text-mist">{copy.settings.guestHint}</p>
                <button
                  type="button"
                  onClick={() => window.location.assign("/login")}
                  className="mt-3 rounded-lg bg-luna px-3 py-1.5 text-xs font-medium text-luna-ink"
                >
                  {copy.settings.signIn}
                </button>
              </SignedOut>
              {user && <p className="mt-2 text-xs text-mist">{user.primaryEmail}</p>}
            </>
          )}
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{lang === "it" ? "Telefono" : "Phone"}</p>
        <div className="mt-2 space-y-2 rounded-xl bg-ink-3 p-4 text-sm leading-relaxed text-mist">
          <p className="font-medium text-paper">
            {lang === "it" ? "Stesso account, comandi il sistema." : "Same account, you command the system."}
          </p>
          <p>
            {lang === "it"
              ? "1. Accedi con Google (l’account dello smartphone). 2. Sul telefono apri Kreluna e “Aggiungi alla schermata Home”. 3. Da lì: Core, coda Office, file, blocco. È Kreluna ID, non un altro account."
              : "1. Sign in with Google (the phone account). 2. On the phone open Kreluna and Add to Home Screen. 3. From there: Core, Office queue, files, lock. It is Kreluna ID, not another account."}
          </p>
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{lang === "it" ? "Sicurezza" : "Security"}</p>
        <div className="mt-2 space-y-3 rounded-xl bg-ink-3 p-4">
          <p className="text-sm">{lang === "it" ? "PIN di sblocco" : "Unlock PIN"}</p>
          <p className="text-xs text-mist">
            {lang === "it"
              ? "4–6 numeri. Si salva solo l’impronta, non il PIN."
              : "4–6 digits. Only the fingerprint is stored, not the PIN."}
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              value={pinDraft}
              onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-10 w-32 rounded-lg bg-ink-4 px-3 text-sm outline-none"
              placeholder="••••"
            />
            <button
              type="button"
              onClick={() => {
                void setPin(pinDraft).then((ok) => {
                  setPinMsg(ok ? (lang === "it" ? "PIN attivo" : "PIN on") : lang === "it" ? "Usa 4–6 numeri" : "Use 4–6 digits");
                  if (ok) setPinDraft("");
                });
              }}
              className="rounded-lg bg-luna px-3 py-2 text-xs font-medium text-luna-ink"
            >
              {lang === "it" ? "Imposta" : "Set"}
            </button>
            {!!pinHash && (
              <button
                type="button"
                onClick={() => {
                  clearPin();
                  setPinMsg(lang === "it" ? "PIN tolto" : "PIN off");
                }}
                className="text-xs text-alert"
              >
                {lang === "it" ? "Togli PIN" : "Remove PIN"}
              </button>
            )}
          </div>
          {pinMsg && <p className="text-xs text-mist">{pinMsg}</p>}
          <p className="pt-2 text-sm">{lang === "it" ? "Blocco automatico" : "Auto-lock"}</p>
          <div className="flex flex-wrap gap-2">
            {[0, 2, 5, 10].map((n) => (
              <Seg key={n} on={lockMin === n} onClick={() => setLockMin(n)}>
                {n === 0 ? (lang === "it" ? "Mai" : "Never") : `${n} min`}
              </Seg>
            ))}
          </div>
          <Toggle
            label={lang === "it" ? "Core può usare la rete" : "Core may use the network"}
            hint={
              lang === "it"
                ? "Spento: legge solo il disco. Niente modello, niente file in uscita da Core."
                : "Off: reads disk only. No model, no files leave Core."
            }
            on={coreNet}
            onClick={() => setCoreNet(!coreNet)}
          />
          <button type="button" onClick={() => lockNow()} className="text-xs text-luna">
            {lang === "it" ? "Blocca ora" : "Lock now"}
          </button>
        </div>
        <div className="mt-3 space-y-2 rounded-xl bg-ink-3 p-4 text-xs leading-relaxed text-mist">
          <p className="text-sm text-paper">{lang === "it" ? "Dati e legge" : "Data and law"}</p>
          <p>
            {lang === "it"
              ? "I file stanno sul dispositivo. Non vendiamo dati. Il PIN non è in chiaro. Google, se accedi, resta di Google. Non è una certificazione. Se esce qualcosa, lo dici subito — in UE entro 72 ore se sei titolare."
              : "Files stay on the device. We do not sell data. The PIN is not stored in clear. Google, if you sign in, stays Google’s. This is not a certification. If something leaks, you say so at once — in the EU within 72 hours if you are the controller."}
          </p>
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.settings.language}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Seg on={lang === "it"} onClick={() => setLang("it")}>
            {copy.langIt}
          </Seg>
          <Seg on={lang === "en"} onClick={() => setLang("en")}>
            {copy.langEn}
          </Seg>
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.settings.appearance}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Seg on={theme === "night"} onClick={() => setTheme("night")}>
            {copy.themeNight}
          </Seg>
          <Seg on={theme === "dawn"} onClick={() => setTheme("dawn")}>
            {copy.themeDawn}
          </Seg>
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{lang === "it" ? "Sfondo blocco e salvaschermo" : "Lock and screensaver wallpaper"}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WALLS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWall(w.id)}
              className={cn("overflow-hidden rounded-xl text-left ring-2", wallId === w.id ? "ring-luna" : "ring-transparent")}
            >
              <img src={w.src} alt="" className="aspect-video w-full object-cover" />
              <span className="block bg-ink-3 px-2 py-1.5 text-xs">{lang === "it" ? w.it : w.en}</span>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <p className="mb-2 text-xs text-mist">{lang === "it" ? "Velatura" : "Veil"}</p>
          <div className="grid grid-cols-3 gap-2">
            {([0, 1, 2] as const).map((n) => (
              <Seg key={n} on={wallDim === n} onClick={() => setWallDim(n)}>
                {n === 0 ? (lang === "it" ? "Niente" : "None") : n === 1 ? (lang === "it" ? "Lieve" : "Light") : lang === "it" ? "Media" : "Medium"}
              </Seg>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{lang === "it" ? "Schermo" : "Display"}</p>
        <div className="mt-2 rounded-xl bg-ink-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">{lang === "it" ? "Luminosità" : "Brightness"}</p>
            <span className="text-xs tabular-nums text-mist">{brightness}%</span>
          </div>
          <input type="range" min={20} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="mt-2 w-full" />
        </div>
        <div className="mt-3 space-y-3 rounded-xl bg-ink-3 p-4">
          <p className="text-sm">{lang === "it" ? "Salvaschermo" : "Screensaver"}</p>
          <p className="text-xs text-mist">
            {lang === "it"
              ? "Dopo un po’ di silenzio: sfera, orologio, lo sfondo che hai scelto. Un tocco e torna."
              : "After idle: the orb, the clock, your wallpaper. A touch brings you back."}
          </p>
          <div className="flex flex-wrap gap-2">
            {SAVER_OPTS.map((n) => (
              <Seg key={n} on={saverMin === n} onClick={() => setSaverMin(n)}>
                {n === 0 ? (lang === "it" ? "Mai" : "Never") : `${n} min`}
              </Seg>
            ))}
          </div>
          <Toggle
            label={lang === "it" ? "Orologio sul salvaschermo" : "Clock on screensaver"}
            hint={lang === "it" ? "Ora e data in basso." : "Time and date at the bottom."}
            on={saverClock}
            onClick={() => setSaverClock(!saverClock)}
          />
          <button type="button" onClick={() => startSaver()} className="text-xs text-luna">
            {lang === "it" ? "Prova ora" : "Try now"}
          </button>
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.settings.home}</p>
        <div className="mt-2 space-y-3 rounded-xl bg-ink-3 p-4">
          <Toggle
            label={copy.settings.activity}
            hint={lang === "it" ? "Sulla home, a destra." : "On the home, right side."}
            on={showActivity}
            onClick={() => setShowActivity(!showActivity)}
          />
          <Toggle
            label={lang === "it" ? "Promemoria" : "Reminders"}
            hint={lang === "it" ? "Stesso posto." : "Same place."}
            on={showReminders}
            onClick={() => setShowReminders(!showReminders)}
          />
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{lang === "it" ? "Piano" : "Plan"}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-ink-3 p-4">
            <p className="text-xs text-mist">{lang === "it" ? "Sempre gratis" : "Always free"}</p>
            <p className="mt-1 font-display text-xl">Kreluna</p>
            <p className="mt-2 text-xs leading-relaxed text-mist">
              {lang === "it"
                ? "Il sistema. Orbe, file, Core che legge. Tu premi. Niente parte da solo."
                : "The system. Orbits, files, Core that reads. You press. Nothing starts alone."}
            </p>
          </div>
          <div className="rounded-xl bg-luna p-4 text-luna-ink">
            <p className="text-xs opacity-80">{lang === "it" ? "Abbonamento" : "Subscription"}</p>
            <p className="mt-1 font-display text-xl">{lang === "it" ? "Kreluna automatica" : "Automated Kreluna"}</p>
            <p className="mt-1 text-sm font-medium">9 € / {lang === "it" ? "mese" : "month"}</p>
            <p className="mt-2 text-xs leading-relaxed opacity-90">
              {lang === "it"
                ? "1000 domande al mese a Core sul modello. Più 300 cose automatiche. Le domande sul disco (legge i file, niente modello) sono sempre libere."
                : "1000 questions a month to Core on the model. Plus 300 automatic things. Questions on disk (reads files, no model) stay free."}
            </p>
          </div>
        </div>
        <p className="mt-2 text-xs text-mist">
          {lang === "it"
            ? "Gratis: usi Kreluna a mano. Paghi: la vuoi automatica. Il disco resta tuo."
            : "Free: you use Kreluna by hand. You pay: you want it automated. The disk stays yours."}
        </p>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.settings.install}</p>
        <div className="mt-2 rounded-xl bg-ink-3 p-4 text-sm leading-relaxed">
          <p className="font-medium text-paper">
            {desktop
              ? lang === "it"
                ? "Kreluna Desktop installata"
                : "Kreluna Desktop installed"
              : lang === "it"
                ? "Una finestra tua, a tutto schermo"
                : "Your own window, full screen"}
          </p>
          <p className="mt-2 text-mist">
            {desktop
              ? lang === "it"
                ? "Questa è l’applicazione nativa di Kreluna. Windows o macOS restano il sistema operativo: Kreluna usa il loro kernel e mantiene Lumina come ambiente di lavoro."
                : "This is the native Kreluna application. Windows or macOS remain the operating system: Kreluna uses their kernel and keeps Lumina as your workspace."
              : lang === "it"
                ? "Non installa un sistema sul disco. Mette Kreluna nel Dock o in Home, a schermo intero. Il Mac o il telefono restano. Cambia solo come la apri."
                : "It does not install a system on the disk. It puts Kreluna in the Dock or Home, full screen. The Mac or phone stay. Only how you open it changes."}
          </p>
          {desktop ? (
            <p className="mt-3 text-luna">
              {lang === "it" ? "Modalità desktop locale attiva." : "Local desktop mode is active."}
            </p>
          ) : standalone ? (
            <p className="mt-3 text-luna">
              {lang === "it" ? "Già impiantata su questo schermo." : "Already planted on this screen."}
            </p>
          ) : (
            <>
              {canInstall && (
                <button type="button" onClick={() => void install()} className="mt-3 rounded-lg bg-luna px-3 py-2 text-xs font-medium text-luna-ink">
                  {copy.settings.installNow}
                </button>
              )}
              <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-xs text-mist">
                {host === "safari-mac" && (
                  <>
                    <li>{lang === "it" ? "Safari → menu File" : "Safari → File menu"}</li>
                    <li>{lang === "it" ? "Aggiungi al Dock" : "Add to Dock"}</li>
                    <li>{lang === "it" ? "Apri Kreluna dal Dock, senza la barra di Safari" : "Open Kreluna from the Dock, without the Safari bar"}</li>
                  </>
                )}
                {host === "ios" && (
                  <>
                    <li>{lang === "it" ? "Tocca Condividi (il quadrato con la freccia)" : "Tap Share (square with arrow)"}</li>
                    <li>{lang === "it" ? "Aggiungi a Home" : "Add to Home Screen"}</li>
                    <li>{lang === "it" ? "Apri l’icona Kreluna" : "Open the Kreluna icon"}</li>
                  </>
                )}
                {host === "chrome" && (
                  <>
                    <li>{lang === "it" ? "I tre puntini in alto a destra" : "The three dots at the top right"}</li>
                    <li>{lang === "it" ? "Installa app / Installa Kreluna" : "Install app / Install Kreluna"}</li>
                    <li>{lang === "it" ? "Si apre da sola, senza Chrome intorno" : "It opens on its own, without Chrome around it"}</li>
                  </>
                )}
                {host === "other" && (
                  <>
                    <li>{lang === "it" ? "Menu del browser → Installa app" : "Browser menu → Install app"}</li>
                    <li>{lang === "it" ? "Oppure Condividi → Aggiungi a Home" : "Or Share → Add to Home"}</li>
                  </>
                )}
              </ol>
            </>
          )}
        </div>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{copy.settings.system}</p>
        <dl className="mt-2 divide-y divide-line rounded-xl bg-ink-3 text-sm">
          <Row k={copy.settings.version} v="Kreluna Desktop 1.0.0" />
          <Row k={lang === "it" ? "Motore" : "Runtime"} v="Luna Runtime 1" />
          <Row k={copy.settings.build} v="2026.08.17" />
          <Row k={lang === "it" ? "Ospite" : "Host"} v={typeof navigator !== "undefined" ? navigator.userAgent.split(" ").slice(-2).join(" ") : "—"} />
          <Row k={lang === "it" ? "Memoria" : "Memory"} v={caps.memory ? `${caps.memory} GB` : lang === "it" ? "non dichiarata" : "not reported"} />
          <Row k="Touch" v={caps.touch ? (lang === "it" ? "sì" : "yes") : lang === "it" ? "no" : "no"} />
        </dl>
        <div className="mt-3 rounded-xl bg-ink-3 p-4">
          <Toggle
            label={lang === "it" ? "Modalità leggera" : "Lite mode"}
            hint={lang === "it" ? "Sfondo semplice, niente sfocature." : "Simple background, no blur."}
            on={lite}
            onClick={() => setLite(!lite)}
          />
        </div>
        <button type="button" onClick={() => setAbout(true)} className="mt-3 text-sm text-luna">
          {copy.appleAbout}
        </button>
      </section>
      <section className="mt-6">
        <p className="text-[11px] tracking-wide text-mist uppercase">{lang === "it" ? "Ripristino" : "Recovery"}</p>
        <div className="mt-2 space-y-2 rounded-xl bg-ink-3 p-4 text-sm leading-relaxed text-mist">
          <p className="font-medium text-paper">{lang === "it" ? "Pacchetto di sistema Kreluna" : "Kreluna system package"}</p>
          <p>
            {lang === "it"
              ? "Crea un pacchetto leggibile da Luna Runtime con configurazione e manifesto del sistema. Non sostituisce Windows o macOS."
              : "Creates a package readable by Luna Runtime containing the system configuration and manifest. It does not replace Windows or macOS."}
          </p>
          <p className="text-xs">
            {planted
              ? lang === "it"
                ? "Immagine presente: Sistema / Kreluna.sys.luna"
                : "Image present: System / Kreluna.sys.luna"
              : lang === "it"
                ? "Nessuna immagine sul disco."
                : "No image on disk yet."}
          </p>
          <button
            type="button"
            onClick={() => openNode(implant())}
            className="rounded-lg bg-luna px-3 py-2 text-xs font-medium text-luna-ink"
          >
            {lang === "it" ? "Crea pacchetto" : "Create package"}
          </button>
        </div>
      </section>
    </div>
  );
}

function Seg({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-xl px-3 py-2.5 text-sm", on ? "bg-luna text-luna-ink" : "bg-ink-3")}>
      {children}
    </button>
  );
}

function Toggle({ label, hint, on, onClick }: { label: string; hint: string; on: boolean; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div>
        <p className="text-sm">{label}</p>
        <p className="mt-1 text-xs text-mist">{hint}</p>
      </div>
      <button type="button" onClick={onClick} className={cn("h-7 w-12 shrink-0 rounded-full px-0.5", on ? "bg-luna" : "bg-ink-4")} aria-pressed={on}>
        <span className={cn("block size-6 rounded-full bg-ink-2 transition-transform", on ? "translate-x-5" : "translate-x-0")} />
      </button>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <dt className="text-mist">{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}
