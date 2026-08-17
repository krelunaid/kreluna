import { useRef } from "react";
import type { Win } from "@/lib/os/types";
import { useOs } from "@/lib/os/store";
import { AppIcon } from "./AppIcon";
import { OrbitMark } from "./Mark";
import { AppBody } from "./apps/registry";
import { cn } from "@/lib/utils";

type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export function WindowFrame({ win }: { win: Win }) {
  const focused = useOs((s) => s.focused);
  const focusWin = useOs((s) => s.focusWin);
  const closeWin = useOs((s) => s.closeWin);
  const minWin = useOs((s) => s.minWin);
  const maxWin = useOs((s) => s.maxWin);
  const moveWin = useOs((s) => s.moveWin);
  const resizeWin = useOs((s) => s.resizeWin);
  const snapWin = useOs((s) => s.snapWin);
  const lang = useOs((s) => s.lang);
  const active = focused === win.id;
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const rs = useRef<{
    edge: Edge;
    x: number;
    y: number;
    w: number;
    h: number;
    px: number;
    py: number;
  } | null>(null);

  if (win.min) return null;

  const style = win.max
    ? { position: "fixed" as const, left: 0, top: 0, width: "100vw", height: "100vh", zIndex: 70 }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  const onDrag = (e: React.PointerEvent) => {
    if (win.max) return;
    focusWin(win.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    moveWin(win.id, e.clientX - drag.current.dx, Math.max(56, e.clientY - drag.current.dy));
  };
  const onDragEnd = (e: React.PointerEvent) => {
    if (drag.current) {
      const x = e.clientX;
      const y = e.clientY;
      const vw = window.innerWidth;
      if (y < 40) snapWin(win.id, "max");
      else if (x < 18) snapWin(win.id, "left");
      else if (x > vw - 18) snapWin(win.id, "right");
    }
    drag.current = null;
  };

  const onResize = (edge: Edge) => (e: React.PointerEvent) => {
    if (win.max) return;
    e.stopPropagation();
    focusWin(win.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    rs.current = { edge, x: win.x, y: win.y, w: win.w, h: win.h, px: e.clientX, py: e.clientY };
  };
  const onResizeMove = (e: React.PointerEvent) => {
    const r = rs.current;
    if (!r) return;
    const dx = e.clientX - r.px;
    const dy = e.clientY - r.py;
    let { x, y, w, h } = r;
    if (r.edge.includes("e")) w = r.w + dx;
    if (r.edge.includes("s")) h = r.h + dy;
    if (r.edge.includes("w")) {
      w = r.w - dx;
      x = r.x + dx;
    }
    if (r.edge.includes("n")) {
      h = r.h - dy;
      y = r.y + dy;
    }
    resizeWin(win.id, x, Math.max(36, y), w, h);
  };
  const onResizeEnd = () => {
    rs.current = null;
  };

  const handle = (edge: Edge, cls: string) => (
    <div
      className={cn("absolute z-20", cls)}
      onPointerDown={onResize(edge)}
      onPointerMove={onResizeMove}
      onPointerUp={onResizeEnd}
    />
  );

  return (
    <section
      role="dialog"
      aria-label={win.title}
      onPointerDown={() => focusWin(win.id)}
      className={cn(
        "absolute flex flex-col overflow-hidden bg-ink-2 text-paper shadow-win",
        win.max ? "rounded-none" : "rounded-2xl",
        active ? "opacity-100" : "opacity-95",
      )}
      style={style}
    >
      <header
        className="flex h-10 shrink-0 items-center gap-3 px-3"
        onPointerDown={onDrag}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onDoubleClick={() => maxWin(win.id)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <AppIcon id={win.appId} size={16} className="rounded-[4px] shadow-none" />
          <span className={cn("truncate text-[12px] font-medium", active ? "text-paper" : "text-mist")}>
            {win.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={lang === "it" ? "Riduci" : "Minimise"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minWin(win.id)}
            className="grid h-6 min-w-6 place-items-center rounded-md px-1.5 text-mist hover:bg-ink-3 hover:text-paper"
          >
            <span className="block h-px w-2.5 bg-current" />
          </button>
          <button
            type="button"
            aria-label={lang === "it" ? "Schermo intero" : "Full screen"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => maxWin(win.id)}
            className="grid size-6 place-items-center rounded-md text-luna hover:bg-ink-3"
          >
            <OrbitMark size={14} />
          </button>
          <button
            type="button"
            aria-label={lang === "it" ? "Chiudi" : "Close"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeWin(win.id)}
            className="grid h-6 min-w-6 place-items-center rounded-md px-1.5 text-xs text-mist hover:bg-ink-3 hover:text-paper"
          >
            ×
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden bg-ink-2">
        <AppBody id={win.appId} />
      </div>
      {!win.max && (
        <>
          {handle("n", "inset-x-3 top-0 h-1.5 cursor-n-resize")}
          {handle("s", "inset-x-3 bottom-0 h-1.5 cursor-s-resize")}
          {handle("e", "inset-y-3 right-0 w-1.5 cursor-e-resize")}
          {handle("w", "inset-y-3 left-0 w-1.5 cursor-w-resize")}
          {handle("ne", "top-0 right-0 size-3 cursor-ne-resize")}
          {handle("nw", "top-0 left-0 size-3 cursor-nw-resize")}
          {handle("se", "bottom-0 right-0 size-3 cursor-se-resize")}
          {handle("sw", "bottom-0 left-0 size-3 cursor-sw-resize")}
        </>
      )}
    </section>
  );
}
