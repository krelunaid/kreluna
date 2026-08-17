export interface Wall {
  id: string;
  src: string;
  it: string;
  en: string;
}

export const WALLS: Wall[] = [
  { id: "universo", src: "", it: "Universo", en: "Universe" },
  { id: "orbita", src: "/os/walls/orbita.jpg", it: "Orbita", en: "Orbit" },
  { id: "mare", src: "/os/walls/mare.jpg", it: "Mare", en: "Sea" },
  { id: "crepuscolo", src: "/os/walls/crepuscolo.jpg", it: "Crepuscolo", en: "Twilight" },
  { id: "costa", src: "/os/walls/costa.jpg", it: "Costa", en: "Coast" },
  { id: "ghiaccio", src: "/os/walls/ghiaccio.jpg", it: "Ghiaccio", en: "Ice" },
  { id: "colline", src: "/os/walls/colline.jpg", it: "Colline", en: "Hills" },
  { id: "notte", src: "/os/walls/notte.jpg", it: "Notte", en: "Night" },
  { id: "anelli", src: "/os/walls/anelli.jpg", it: "Anelli", en: "Rings" },
];

export const SAVER_OPTS = [0, 1, 2, 5, 10] as const;

export function wallById(id: string) {
  return WALLS.find((w) => w.id === id) ?? WALLS[0];
}

export function deskContrast(wallId: string, pref: "auto" | "dark" | "light") {
  if (pref !== "auto") return pref;
  return wallId === "notte" || wallId === "anelli" || wallId === "ghiaccio" || wallId === "colline"
    ? "light"
    : "dark";
}
