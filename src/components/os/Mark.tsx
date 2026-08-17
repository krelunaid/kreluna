import { cn } from "@/lib/utils";

export function LunaMark({ className, draw }: { className?: string; draw?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("text-luna", className)}
      aria-hidden
    >
      <path
        d="M40.5 16.2c-8.8 1.4-15.5 9-15.5 18.1 0 10.1 8.2 18.3 18.3 18.3 2.4 0 4.7-.5 6.8-1.3C46.2 55.8 39.5 58 32 58 17.6 58 6 46.4 6 32S17.6 6 32 6c5.2 0 10 1.5 14.1 4.1-1.8-.6-3.7-.9-5.6-.9z"
        fill="currentColor"
        className={draw ? "origin-center" : undefined}
        style={
          draw
            ? {
                stroke: "currentColor",
                strokeWidth: 0.6,
                strokeDasharray: 220,
                animation: "luna-draw 1.2s cubic-bezier(0.22,1,0.36,1) both",
              }
            : undefined
        }
      />
    </svg>
  );
}

export function OrbitMark({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <ellipse cx="12" cy="12" rx="9" ry="3.4" stroke="#6aa4ff" strokeWidth="1.35" opacity="0.85" />
      <ellipse cx="12" cy="12" rx="3.4" ry="9" stroke="#9ec4ff" strokeWidth="1.45" />
      <circle cx="12" cy="12" r="1.35" fill="#e8f2ff" />
      <circle cx="12" cy="12" r="2.4" fill="#4d7cff" opacity="0.35" />
    </svg>
  );
}
