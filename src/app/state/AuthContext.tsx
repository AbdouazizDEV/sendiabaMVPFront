import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getServices } from "@/app/di/services";
import type { AuthCredentials, AuthSession, RegisterPayload } from "@/domain/types";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (payload: AuthCredentials) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authService = getServices().authService;
  const [session, setSession] = useState<AuthSession | null>(() =>
    authService.getSession(),
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login: async (payload) => {
        const next = await authService.login(payload);
        setSession(next);
        return next;
      },
      register: async (payload) => {
        const next = await authService.register(payload);
        // Registration requires email confirmation before considering
        // the user as authenticated in the app.
        authService.clearLocalSession();
        setSession(null);
        return next;
      },
      logout: async () => {
        await authService.logout();
        setSession(null);
      },
    }),
    [authService, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
