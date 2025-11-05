"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const readToken = () => {
    const t = Cookies.get("token");
    setToken(t ?? null);
  };

  useEffect(() => {
    readToken();
    window.addEventListener("auth-changed", readToken);
    return () => window.removeEventListener("auth-changed", readToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, refreshAuth: readToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
