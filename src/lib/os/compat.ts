export interface Caps {
  memory: number | null;
  saveData: boolean;
  touch: boolean;
  reducedMotion: boolean;
  backdrop: boolean;
  standalone: boolean;
}

export function readCaps(): Caps {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return {
      memory: null,
      saveData: false,
      touch: false,
      reducedMotion: false,
      backdrop: true,
      standalone: false,
    };
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
    standalone?: boolean;
  };
  return {
    memory: typeof nav.deviceMemory === "number" ? nav.deviceMemory : null,
    saveData: nav.connection?.saveData === true,
    touch: window.matchMedia("(pointer: coarse)").matches || nav.maxTouchPoints > 0,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    backdrop: typeof CSS !== "undefined" && CSS.supports?.("backdrop-filter", "blur(4px)") === true,
    standalone:
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true,
  };
}

export function suggestLite(caps: Caps) {
  if (caps.reducedMotion || caps.saveData) return true;
  if (caps.memory !== null && caps.memory <= 2) return true;
  if (!caps.backdrop) return true;
  return false;
}
