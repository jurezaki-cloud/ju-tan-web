"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hasPermission, type Permission } from "@/src/config/permissions";
import type { Session, SessionUser } from "@/src/types/auth";
import { displayName } from "@/src/identity/types";
import type { PublicIdentityUser } from "@/src/identity/types";

type AuthContextValue = {
  session: Session;
  loading: boolean;
  can: (permission: Permission) => boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toSessionUser(user: PublicIdentityUser): SessionUser {
  return {
    id: user.id,
    name: displayName(user),
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    department: user.department,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: PublicIdentityUser | null;
}) {
  const [session, setSession] = useState<Session>(() =>
    initialUser
      ? { authenticated: true, user: toSessionUser(initialUser) }
      : { authenticated: false, user: null },
  );

  const refresh = useCallback(async () => {
    const response = await fetch("/api/identity/session", { cache: "no-store" });
    if (!response.ok) {
      setSession({ authenticated: false, user: null });
      return;
    }
    const body = (await response.json()) as { user?: PublicIdentityUser };
    if (!body.user) {
      setSession({ authenticated: false, user: null });
    } else {
      setSession({ authenticated: true, user: toSessionUser(body.user) });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading: false,
      refresh,
      can: (permission) => {
        const role = session.user?.role;
        if (!role) return false;
        return hasPermission(role, permission);
      },
    }),
    [session, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth zahteva AuthProvider.");
  }
  return context;
}

export { AuthContext };
