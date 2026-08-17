import type { ReactNode } from "react";
import type { AppId } from "@/lib/os/types";
import { ErrorBound } from "../ErrorBound";
import { CoreApp } from "./CoreApp";
import { OfficeApp } from "./OfficeApp";
import { CyberApp } from "./CyberApp";
import { FilesApp } from "./FilesApp";
import { MailApp } from "./MailApp";
import { CalendarApp } from "./CalendarApp";
import { NotesApp } from "./NotesApp";
import { TerminalApp } from "./TerminalApp";
import { SettingsApp } from "./SettingsApp";
import { BrowserApp } from "./BrowserApp";
import { CalcApp } from "./CalcApp";
import { EditorApp } from "./EditorApp";
import { PhotosApp } from "./PhotosApp";
import { MonitorApp } from "./MonitorApp";
import { StoreApp } from "./StoreApp";
import { ClockApp } from "./ClockApp";
import { PaintApp } from "./PaintApp";
import { TasksApp } from "./TasksApp";
import { LunaApp } from "./LunaApp";
import { PonteApp } from "./PonteApp";
import { TrashApp } from "./TrashApp";

const MAP: Record<AppId, () => ReactNode> = {
  core: () => <CoreApp />,
  office: () => <OfficeApp />,
  cyber: () => <CyberApp />,
  files: () => <FilesApp />,
  mail: () => <MailApp />,
  calendar: () => <CalendarApp />,
  notes: () => <NotesApp />,
  terminal: () => <TerminalApp />,
  settings: () => <SettingsApp />,
  browser: () => <BrowserApp />,
  calc: () => <CalcApp />,
  editor: () => <EditorApp />,
  photos: () => <PhotosApp />,
  monitor: () => <MonitorApp />,
  store: () => <StoreApp />,
  clock: () => <ClockApp />,
  paint: () => <PaintApp />,
  tasks: () => <TasksApp />,
  trash: () => <TrashApp />,
  luna: () => <LunaApp />,
  ponte: () => <PonteApp />,
};

export function AppBody({ id }: { id: AppId }) {
  const view = MAP[id];
  return <ErrorBound label={id}>{view ? view() : null}</ErrorBound>;
}
