import { useEffect, useRef, useState } from "react";
import { useOs } from "@/lib/os/store";

export function PaintApp() {
  const lang = useOs((s) => s.lang);
  const createNode = useOs((s) => s.createNode);
  const pushNotif = useOs((s) => s.pushNotif);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("var(--color-paper)");

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const r = c.getBoundingClientRect();
      const img = ctx.getImageData(0, 0, c.width || 1, c.height || 1);
      c.width = r.width * 2;
      c.height = r.height * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = "#101216";
      ctx.fillRect(0, 0, r.width, r.height);
      ctx.putImageData(img, 0, 0);
    };
    resize();
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e: React.PointerEvent) => {
    drawing.current = true;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const up = () => {
    drawing.current = false;
  };

  const save = () => {
    const data = canvas.current?.toDataURL("image/png") ?? "";
    createNode("desk", `tela-${Date.now().toString().slice(-4)}.png`, "file", data, "img");
    pushNotif({
      appId: "paint",
      title: lang === "it" ? "Salvato sulla scrivania" : "Saved to desk",
      body: "PNG",
      kind: "info",
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        {["var(--color-paper)", "var(--color-luna)", "var(--color-ok)", "var(--color-warn)", "var(--color-alert)"].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className="size-6 rounded-full"
            style={{ background: c, outline: color === c ? "2px solid var(--color-luna)" : "none" }}
          />
        ))}
        <button type="button" onClick={save} className="ml-auto rounded-lg bg-luna px-3 py-1.5 text-xs font-medium text-luna-ink">
          {lang === "it" ? "Salva sulla scrivania" : "Save to desk"}
        </button>
      </div>
      <canvas
        ref={canvas}
        className="min-h-0 flex-1 touch-none"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
      />
    </div>
  );
}
