"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  SessionProvider,
  useSession,
  signIn,
  signOut,
  type SignInOptions,
} from "next-auth/react";

type AuthContextValue = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (options?: SignInOptions & { provider?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextBridge>{children}</AuthContextBridge>
    </SessionProvider>
  );
}

function AuthContextBridge({ children }: { children: ReactNode }) {
  const { data, status } = useSession();

  const login = async (options?: SignInOptions & { provider?: string }) => {
    const provider = options?.provider ?? "credentials";
    await signIn(provider, { redirect: true, callbackUrl: "/", ...options });
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/auth" });
  };

  const value: AuthContextValue = {
    user: data?.user
      ? {
          id: (data.user as typeof data.user & { id: string }).id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        }
      : null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
