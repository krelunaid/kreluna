import type { AppId } from "@/lib/os/types";
import { cn } from "@/lib/utils";

const RING: Record<AppId, string> = {
  core: "#3d6dff",
  office: "#2a9d6e",
  cyber: "#4d6cff",
  files: "#c9a24a",
  mail: "#2a9aa0",
  calendar: "#c45a5a",
  notes: "#3d6dff",
  terminal: "#5c6578",
  settings: "#6d7890",
  browser: "#3d6dff",
  calc: "#5c6578",
  editor: "#3d6dff",
  photos: "#c45a8a",
  monitor: "#2a9d6e",
  store: "#5b57c7",
  clock: "#c46a3a",
  paint: "#7a5cff",
  tasks: "#2a9d6e",
  trash: "#8a93a3",
  luna: "#3d6dff",
  ponte: "#3d6dff",
};

function Glyph({ id, px, ink }: { id: AppId; px: number; ink: string }) {
  const w = Math.round(px * 0.52);
  const sw = 1.25;
  return (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" aria-hidden>
      {mark(id, ink, sw)}
    </svg>
  );
}

function mark(id: AppId, ink: string, sw: number) {
  if (id === "core" || id === "luna") {
    return (
      <>
        <circle cx="12" cy="12" r="5" fill={ink} />
        <circle cx="10.2" cy="10.2" r="1.5" fill="white" opacity="0.85" />
      </>
    );
  }
  if (id === "browser") {
    return (
      <>
        <ellipse cx="12" cy="12" rx="7.2" ry="2.6" stroke={ink} strokeWidth={sw} />
        <ellipse cx="12" cy="12" rx="2.6" ry="7.2" stroke={ink} strokeWidth={sw} />
        <circle cx="12" cy="12" r="1" fill={ink} />
      </>
    );
  }
  if (id === "ponte") {
    return (
      <>
        <circle cx="7.2" cy="12" r="2" fill={ink} />
        <circle cx="16.8" cy="12" r="2" fill={ink} />
        <path d="M9.4 12h5.2" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
      </>
    );
  }
  if (id === "office") {
    return (
      <>
        <rect x="6.2" y="6.4" width="11.6" height="11.2" rx="1.6" stroke={ink} strokeWidth={sw} />
        <path d="M8.4 10h7.2M8.4 13h7.2M8.4 16h4.6" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
      </>
    );
  }
  if (id === "notes" || id === "editor") {
    return (
      <>
        <path d="M7.2 8.2h9.6M7.2 12h9.6M7.2 15.8h6.2" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
      </>
    );
  }
  if (id === "mail") {
    return (
      <>
        <rect x="5" y="7.2" width="14" height="9.6" rx="1.6" stroke={ink} strokeWidth={sw} />
        <path d="m5.6 8.2 6.4 4.4 6.4-4.4" stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
      </>
    );
  }
  if (id === "files") {
    return (
      <>
        <circle cx="9.5" cy="13" r="3.3" fill={ink} opacity="0.45" />
        <circle cx="14.4" cy="11" r="3.3" fill={ink} />
      </>
    );
  }
  if (id === "settings") {
    return (
      <>
        <circle cx="12" cy="12" r="2" fill={ink} />
        <circle cx="12" cy="12" r="6.2" stroke={ink} strokeWidth={sw} strokeDasharray="1.6 2.2" />
      </>
    );
  }
  if (id === "calendar") {
    return (
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill={ink}
        fontSize="11"
        fontWeight="600"
        fontFamily="Outfit, system-ui, sans-serif"
      >
        16
      </text>
    );
  }
  if (id === "cyber") {
    return (
      <>
        <circle cx="12" cy="12" r="6.2" stroke={ink} strokeWidth={sw} />
        <circle cx="12" cy="12" r="1.6" fill={ink} />
      </>
    );
  }
  if (id === "terminal") {
    return <path d="M7.2 9.2h9.6M7.2 14.8h6.4" stroke={ink} strokeWidth={sw} strokeLinecap="round" />;
  }
  if (id === "calc") {
    return (
      <>
        <circle cx="8.4" cy="8.4" r="1.3" fill={ink} />
        <circle cx="15.6" cy="8.4" r="1.3" fill={ink} />
        <circle cx="8.4" cy="15.6" r="1.3" fill={ink} />
        <circle cx="15.6" cy="15.6" r="1.3" fill={ink} />
      </>
    );
  }
  if (id === "photos") {
    return (
      <>
        <circle cx="12" cy="12" r="5.4" fill={ink} opacity="0.85" />
        <circle cx="12" cy="12" r="1.7" fill="white" />
      </>
    );
  }
  if (id === "clock") {
    return (
      <>
        <circle cx="12" cy="12" r="6.2" stroke={ink} strokeWidth={sw} />
        <path d="M12 8.2v4.1l2.6 1.5" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
      </>
    );
  }
  if (id === "paint") {
    return (
      <>
        <circle cx="9.2" cy="11.2" r="2.4" fill={ink} opacity="0.45" />
        <circle cx="14.8" cy="11.2" r="2.4" fill={ink} opacity="0.75" />
        <circle cx="12" cy="15.2" r="1.9" fill={ink} />
      </>
    );
  }
  if (id === "tasks") {
    return <path d="M7.4 12h9.2M12 7.4v9.2" stroke={ink} strokeWidth={sw} strokeLinecap="round" />;
  }
  if (id === "monitor") {
    return (
      <path
        d="M6.5 16.2h11M8.6 16.2 12 8.4l3.4 7.8"
        stroke={ink}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  if (id === "store") {
    return (
      <>
        <circle cx="12" cy="12" r="6.2" stroke={ink} strokeWidth={sw} />
        <circle cx="12" cy="12" r="1.8" fill={ink} />
      </>
    );
  }
  if (id === "trash") {
    return (
      <>
        <circle cx="12" cy="12" r="6.2" stroke={ink} strokeWidth={sw} />
        <path d="M8.6 12h6.8" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
      </>
    );
  }
  return <circle cx="12" cy="12" r="2.2" fill={ink} />;
}

export function AppIcon({
  id,
  size = 52,
  className,
}: {
  id: AppId;
  size?: number;
  className?: string;
}) {
  const ink = RING[id] ?? "#3d6dff";
  return (
    <span className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 32% 28%, #fff 0%, #e8eef8 46%, #c5d0e4 100%)",
          boxShadow: "0 8px 16px rgb(40 70 130 / 0.16), inset 0 1px 0 rgb(255 255 255 / 0.9)",
        }}
      />
      <span
        className="pointer-events-none absolute rounded-full"
        style={{ inset: -3, boxShadow: `0 0 0 1.4px ${ink}` }}
      />
      <span className="relative z-[2] grid place-items-center">
        <Glyph id={id} px={size} ink={ink} />
      </span>
    </span>
  );
}
