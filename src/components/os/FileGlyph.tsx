import { useId } from "react";
import type { FolderTint, Mime } from "@/lib/os/types";
import { FOLDER_TINTS } from "@/lib/os/types";
import { cn } from "@/lib/utils";

export function FolderGlyph({
  size = 72,
  className,
  tint = "luna",
}: {
  size?: number;
  className?: string;
  tint?: FolderTint;
}) {
  const uid = useId().replace(/:/g, "");
  const pearl = FOLDER_TINTS[tint] ?? FOLDER_TINTS.luna;
  return (
    <span className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 72 72" className="size-full" aria-hidden>
        <defs>
          <radialGradient id={`pearl-${uid}`} cx="36%" cy="30%" r="62%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="48%" stopColor={pearl.mid} />
            <stop offset="100%" stopColor={pearl.deep} />
          </radialGradient>
        </defs>
        <circle cx="36" cy="36" r="26" fill={`url(#pearl-${uid})`} />
        <circle cx="28" cy="28" r="7" fill="white" opacity="0.55" />
      </svg>
    </span>
  );
}

export function FileTypeGlyph({ mime, size = 44 }: { mime?: Mime; size?: number }) {
  const tone =
    mime === "pdf"
      ? "#e05648"
      : mime === "xlsx"
        ? "#2f9d64"
        : mime === "pptx"
          ? "#d39a2a"
          : mime === "docx" || mime === "md" || mime === "txt"
            ? "#3d6dff"
            : mime === "luna"
              ? "#3d6dff"
              : mime === "exe"
                ? "#6d7890"
                : mime === "img"
                  ? "#7a5cff"
                  : "#94a0b4";
  const label = mime === "luna" ? "L" : mime === "exe" ? "X" : (mime ?? "F").slice(0, 1).toUpperCase();
  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
        <circle cx="24" cy="24" r="18" fill={tone} opacity="0.18" />
        <circle cx="24" cy="24" r="18" fill="none" stroke={tone} strokeWidth="1.4" />
        <text x="24" y="28" textAnchor="middle" fontSize="13" fontWeight="600" fill={tone}>
          {label}
        </text>
      </svg>
    </span>
  );
}

export function OrbitNode({
  label,
  icon,
  meta,
  active,
  onClick,
  onDoubleClick,
  onHover,
}: {
  label: string;
  icon: "work" | "person" | "study" | "rocket" | "chart" | "folder";
  meta?: string;
  active?: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
  onHover?: (on: boolean) => void;
  tone?: "work" | "study" | "money" | "build" | "life";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className="group relative size-[5.6rem] transition-transform duration-200 hover:scale-105"
    >
      <span
        className={cn(
          "flex size-[5.6rem] flex-col items-center justify-center rounded-full bg-white/78 text-[#3d4a6a] shadow-[0_10px_28px_rgb(80_120_190/0.12)] ring-1 backdrop-blur-md transition-all duration-200",
          active ? "ring-[#3d6dff]/70 shadow-[0_0_0_4px_rgb(61_109_255/0.12)]" : "ring-white/80 group-hover:ring-[#3d6dff]/55",
        )}
      >
        <OrbitIcon kind={icon} />
        <span className="mt-0.5 text-[11px] font-semibold tracking-tight">{label}</span>
        {meta ? <span className="text-[9px] text-[#7a86a0]">{meta}</span> : null}
        <span className="mt-0.5 flex gap-0.5">
          <i className="size-0.5 rounded-full bg-[#3d6dff]/50" />
          <i className="size-0.5 rounded-full bg-[#3d6dff]/35" />
          <i className="size-0.5 rounded-full bg-[#3d6dff]/20" />
        </span>
      </span>
    </button>
  );
}
function OrbitIcon({ kind }: { kind: "work" | "person" | "study" | "rocket" | "chart" | "folder" }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    className: "size-4",
  };
  if (kind === "folder")
    return (
      <svg {...p}>
        <path d="M4 8.5 6 6h5l1.5 2.5H20v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5V8.5z" />
      </svg>
    );
  if (kind === "work")
    return (
      <svg {...p}>
        <rect x="4" y="8" width="16" height="11" rx="2" />
        <path d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V8M4 13h16" />
      </svg>
    );
  if (kind === "person")
    return (
      <svg {...p}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19c1.2-3.2 3.6-5 7-5s5.8 1.8 7 5" />
      </svg>
    );
  if (kind === "study")
    return (
      <svg {...p}>
        <path d="M3 9 12 5l9 4-9 4-9-4z" />
        <path d="M7 11v4.5c0 1.5 2.2 3 5 3s5-1.5 5-3V11" />
      </svg>
    );
  if (kind === "rocket")
    return (
      <svg {...p}>
        <path d="M14 4c3 1 6 4 7 7-3 1-8 2-11 5l-3-3c3-3 4-8 5-11z" />
        <path d="M8 16 5 19M10 14l-1.5 3.5" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M4 16v3h3M9 13v6h3M14 9v10h3M19 5v14" />
    </svg>
  );
}
