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
