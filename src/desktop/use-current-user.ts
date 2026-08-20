export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

const DESKTOP_USER: AppUser = {
  id: "local-desktop",
  displayName: "Profilo locale",
  primaryEmail: null,
  profileImageUrl: null,
  isDevFallback: true,
};

export function useCurrentUserState() {
  return { user: DESKTOP_USER, isPending: false };
}

export function useCurrentUser() {
  return DESKTOP_USER;
}
