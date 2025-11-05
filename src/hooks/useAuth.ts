"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = Cookies.get("token");
    if (t && typeof t === "string") {
      setIsAuthenticated(true);
      setToken(t);
    } else {
      setIsAuthenticated(false);
      setToken(null);
    }
  }, []);

  return { isAuthenticated, token };
};
