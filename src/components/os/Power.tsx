import { LunaMark } from "./Mark";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";

export function SleepScreen() {
  const lang = useOs((s) => s.lang);
  return (
    <button
      type="button"
      onClick={() => {
        const s = useOs.getState();
        if (s.pinHash) s.lock();
        else void s.unlock();
      }}
      className="grid h-full w-full place-items-center bg-ink text-paper"
    >
      <div className="flex flex-col items-center gap-4">
        <LunaMark className="size-10 opacity-70" />
        <p className="text-sm text-mist">{t(lang).sleepMsg}</p>
        <p className="text-xs text-ash">{t(lang).wake}</p>
      </div>
    </button>
  );
}

export function ShutdownScreen() {
  const restart = useOs((s) => s.restart);
  const lang = useOs((s) => s.lang);
  return (
    <button
      type="button"
      onClick={restart}
      className="grid h-full w-full place-items-center bg-black text-paper"
    >
      <div className="flex flex-col items-center gap-5">
        <LunaMark className="size-8 opacity-50" />
        <p className="font-display text-3xl tracking-[-0.03em]">{t(lang).shutMsg}</p>
        <p className="text-xs text-ash">{t(lang).wake}</p>
      </div>
    </button>
  );
}
