import type { AppId, Lang } from "./types";
import { t } from "./i18n";

export interface AppMeta {
  id: AppId;
  w: number;
  h: number;
  title: (lang: Lang) => string;
  hint: (lang: Lang) => string;
}

function meta(id: AppId, w: number, h: number): AppMeta {
  return {
    id,
    w,
    h,
    title: (l) => t(l).apps[id] ?? id,
    hint: (l) => t(l).appHint[id] ?? "",
  };
}

export const CATALOG: Record<AppId, AppMeta> = {
  core: meta("core", 860, 580),
  office: meta("office", 920, 600),
  cyber: meta("cyber", 900, 600),
  files: meta("files", 800, 540),
  mail: meta("mail", 880, 580),
  calendar: meta("calendar", 860, 560),
  notes: meta("notes", 760, 540),
  terminal: meta("terminal", 700, 440),
  settings: meta("settings", 820, 640),
  browser: meta("browser", 820, 560),
  calc: meta("calc", 320, 460),
  editor: meta("editor", 820, 560),
  photos: meta("photos", 860, 580),
  monitor: meta("monitor", 780, 520),
  store: meta("store", 780, 560),
  clock: meta("clock", 520, 480),
  paint: meta("paint", 760, 560),
  tasks: meta("tasks", 480, 520),
  trash: meta("trash", 560, 420),
  luna: meta("luna", 920, 620),
  ponte: meta("ponte", 720, 560),
};

export const DOCK_APPS: AppId[] = [
  "core",
  "files",
  "mail",
  "calendar",
  "office",
  "notes",
  "luna",
  "ponte",
  "store",
];

export const HOME_APPS: AppId[] = [
  "core",
  "office",
  "cyber",
  "files",
  "mail",
  "calendar",
  "notes",
  "editor",
  "photos",
  "terminal",
  "calc",
  "clock",
  "paint",
  "tasks",
  "monitor",
  "browser",
  "trash",
  "store",
  "luna",
  "ponte",
  "settings",
];
