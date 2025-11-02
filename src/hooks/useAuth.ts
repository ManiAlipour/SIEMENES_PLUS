// useAuth hook to check if user is authenticated
"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
      setToken(token as string);
    }
  }, []);

  return { isAuthenticated, token };
};
