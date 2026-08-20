import type { ReactNode } from "react";
import { useCurrentUser } from "./use-current-user";

export const SIGN_IN_PATH = "/login";

export function SignedIn({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SignedOut(_props: { children: ReactNode }) {
  return null;
}

export function RedirectToSignIn() {
  return null;
}

export function UserButton() {
  const user = useCurrentUser();
  const label = user.displayName ?? "Profilo locale";
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium">
        {label.charAt(0).toUpperCase()}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
