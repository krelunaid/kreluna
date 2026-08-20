import { useCallback, useEffect, useMemo, useState } from "react";
import { LunaMark } from "./Mark";
import { Wallpaper } from "./Wallpaper";
import { useOs } from "@/lib/os/store";
import { t } from "@/lib/os/i18n";
import { useCurrentUser } from "@/lib/auth/use-current-user";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function LockScreen() {
  const lang = useOs((s) => s.lang);
  const unlock = useOs((s) => s.unlock);
  const pinHash = useOs((s) => s.pinHash);
  const operator = useOs((s) => s.operator);
  const user = useCurrentUser();
  const copy = t(lang);
  const now = useClock();
  const [pin, setPin] = useState("");
  const [bad, setBad] = useState(false);
  const time = now.toLocaleTimeString(lang === "it" ? "it-IT" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = useMemo(() => {
    const weekday = now.toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", {
      weekday: "long",
    });
    const day = now.getDate();
    const month = copy.months[now.getMonth()];
    return lang === "it" ? `${weekday} ${day} ${month}` : `${weekday}, ${month} ${day}`;
  }, [now, lang, copy.months]);

  const tryUnlock = useCallback(async (value?: string) => {
    const ok = await unlock(value);
    if (!ok) {
      setBad(true);
      setPin("");
    }
  }, [unlock]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!pinHash && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        void tryUnlock();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinHash, tryUnlock]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-ink px-6 py-12 text-paper sm:py-16">
      <Wallpaper portrait dim={0.28} className="md:hidden" />
      <Wallpaper dim={0.32} className="hidden md:block" />
      <div className="relative z-10 flex flex-col items-center pt-6">
        <p className="luna-enter text-sm font-medium capitalize tracking-wide text-luna">{date}</p>
        <p className="luna-enter luna-enter-d1 mt-2 font-display text-[92px] leading-none tracking-[-0.04em] tabular-nums sm:text-[120px]">
          {time}
        </p>
      </div>
      <div className="relative z-10 mb-4 flex flex-col items-center gap-4 luna-enter luna-enter-d3">
        <span className="grid size-14 place-items-center rounded-full bg-ink-2/70">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="size-14 rounded-full object-cover" />
          ) : (
            <LunaMark className="size-7" />
          )}
        </span>
        <div className="text-center">
          <p className="text-[15px] font-medium">{user?.displayName ?? (operator || copy.lockGuest)}</p>
          <p className="mt-1 text-xs text-mist">
            {pinHash
              ? lang === "it"
                ? "PIN per entrare"
                : "PIN to enter"
              : copy.lockSub}
          </p>
        </div>
        {pinHash ? (
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void tryUnlock(pin);
            }}
          >
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                setBad(false);
              }}
              className="h-11 w-40 rounded-xl bg-ink-2/80 text-center text-lg tracking-[0.4em] outline-none"
              aria-label="PIN"
            />
            {bad && (
              <p className="text-xs text-alert">{lang === "it" ? "PIN errato" : "Wrong PIN"}</p>
            )}
            <button type="submit" className="rounded-xl bg-luna px-4 py-2 text-xs font-medium text-luna-ink">
              {lang === "it" ? "Sblocca" : "Unlock"}
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => void tryUnlock()} className="text-[12px] tracking-wide text-ash">
            {copy.lockHint}
          </button>
        )}
      </div>
    </div>
  );
}
