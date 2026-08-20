export type Lang = "it" | "en";
export type Theme = "night" | "dawn";
export type Phase = "boot" | "setup" | "lock" | "desktop" | "sleep" | "shutdown";
export type OrbitId = "lavoro" | "personale" | "studio" | "progetti" | "finanza";
export type LuminaNodeId = OrbitId | "files";

export type AppId =
  | "core"
  | "office"
  | "cyber"
  | "files"
  | "mail"
  | "calendar"
  | "notes"
  | "terminal"
  | "settings"
  | "browser"
  | "calc"
  | "editor"
  | "photos"
  | "monitor"
  | "store"
  | "clock"
  | "paint"
  | "tasks"
  | "trash"
  | "luna"
  | "ponte";

export type Mime =
  | "md"
  | "txt"
  | "pdf"
  | "log"
  | "img"
  | "exe"
  | "luna"
  | "docx"
  | "xlsx"
  | "pptx"
  | "bin";

export interface Win {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  min: boolean;
  max: boolean;
  space: number;
}

export interface Notif {
  id: string;
  appId: AppId;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "info" | "review" | "alert";
}

export interface Approval {
  id: string;
  title: string;
  detail: string;
  source: AppId;
  risk: "low" | "medium" | "high";
  status: "pending" | "approved" | "denied";
}

export interface Note {
  id: string;
  title: string;
  body: string;
  updated: string;
}

export interface MailItem {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  tag: string;
}

export interface CaseItem {
  id: string;
  code: string;
  title: string;
  client: string;
  status: "open" | "review" | "done";
  deadline: string;
  owner: string;
}

export interface Finding {
  id: string;
  cve: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  asset: string;
  status: "open" | "accepted" | "fixed";
}

export type FolderTint = "luna" | "silver" | "ink" | "frost" | "dusk";

export const FOLDER_TINTS: Record<FolderTint, { mid: string; deep: string }> = {
  luna: { mid: "#7eacff", deep: "#2f5bff" },
  silver: { mid: "#c8d0dc", deep: "#7a8494" },
  ink: { mid: "#5a6a88", deep: "#1a2740" },
  frost: { mid: "#9fd4e8", deep: "#2f7a96" },
  dusk: { mid: "#9b8cff", deep: "#3d2f8a" },
};

export interface FsNode {
  id: string;
  name: string;
  kind: "folder" | "file";
  parent: string | null;
  mime?: Mime;
  size?: string;
  updated?: string;
  content?: string;
  trashed?: boolean;
  orbit?: OrbitId;
  tint?: FolderTint;
  meta?: string;
}

export interface CalEvent {
  id: string;
  title: string;
  day: number;
  start: string;
  end: string;
  place: string;
  kind: "review" | "meet" | "focus";
}

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
}

export interface CtxMenu {
  x: number;
  y: number;
  kind: "desk" | "file";
  id?: string;
}

export interface Activity {
  id: string;
  title: string;
  when: string;
  mime?: Mime;
  fileId?: string;
}

export interface Reminder {
  id: string;
  title: string;
  when: string;
}
