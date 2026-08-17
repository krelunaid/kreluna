import { useEffect, useState } from "react";

interface Choice {
  outcome: "accepted" | "dismissed";
}

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<Choice>;
}

export type HostKind = "ios" | "safari-mac" | "chrome" | "other";

export function readHost(): HostKind {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  const safari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);
  const mac = /Macintosh/.test(ua);
  if (safari && mac) return "safari-mac";
  if (/Chrome|Chromium|Edg/.test(ua)) return "chrome";
  return "other";
}

export function useInstall() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [host, setHost] = useState<HostKind>("other");

  useEffect(() => {
    setHost(readHost());
    const media = window.matchMedia("(display-mode: standalone)");
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const read = () => setStandalone(media.matches || nav.standalone === true);
    read();
    media.addEventListener("change", read);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => {
      media.removeEventListener("change", read);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  const install = async () => {
    if (!event) return false;
    await event.prompt();
    const { outcome } = await event.userChoice;
    setEvent(null);
    return outcome === "accepted";
  };

  return { canInstall: !!event, standalone, install, host };
}
