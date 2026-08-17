import { useState } from "react";
import { useOs } from "@/lib/os/store";
import { wallById } from "@/lib/os/walls";
import { cn } from "@/lib/utils";

const DIM = [0, 0.1, 0.22] as const;

export function Wallpaper({
  dim,
  className,
}: {
  portrait?: boolean;
  dim?: number;
  className?: string;
}) {
  const lite = useOs((s) => s.lite);
  const wallId = useOs((s) => s.wallId);
  const wallDim = useOs((s) => s.wallDim);
  const [broken, setBroken] = useState(false);
  const wall = wallById(wallId);
  const skip = lite || broken;
  const veil = dim ?? DIM[wallDim] ?? 0.1;

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-ink", className)}>
      {skip ? (
        <div className="absolute inset-0 ice-universe" />
      ) : wall.id === "universo" || !wall.src ? (
        <div className="absolute inset-0 ice-universe" />
      ) : (
        <img
          src={wall.src}
          alt=""
          className="absolute inset-0 size-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
      {veil > 0 && <div className="absolute inset-0 bg-ink" style={{ opacity: veil }} />}
    </div>
  );
}
