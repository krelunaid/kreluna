import { useEffect, useState } from "react";
import { LunaMark } from "./Mark";
import { Wallpaper } from "./Wallpaper";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";

export function Boot() {
  const lang = useOs((s) => s.lang);
  const bootDone = useOs((s) => s.bootDone);
  const copy = t(lang);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else bootDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bootDone]);

  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-ink text-paper">
      <Wallpaper dim={0.55} />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-8 text-center">
        <LunaMark className="size-16 luna-enter" draw />
        <h1 className="luna-enter luna-enter-d2 mt-8 font-display text-5xl tracking-[-0.03em]">
          Kreluna
        </h1>
        <p className="luna-enter luna-enter-d3 mt-2 text-[11px] font-medium tracking-[0.28em] text-luna uppercase">
          Perimetro
        </p>
        <p className="luna-enter luna-enter-d4 mt-5 text-sm text-mist">{copy.bootTag}</p>
        <div className="luna-enter luna-enter-d5 mt-12 h-px w-40 overflow-hidden bg-paper/15">
          <div
            className="h-full origin-left bg-luna"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <p className="mt-3 font-mono text-[10px] tracking-wide text-ash">{copy.bootKernel}</p>
      </div>
    </div>
  );
}
