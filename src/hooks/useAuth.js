import { useState } from "react";
import { AUTH_URL } from "@/constants/api";

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const isAuthenticated = !!token;

  async function register(email, password) {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error);
        return false;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      return true;
    } catch {
      setAuthError("Erro ao conectar com o servidor.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  async function login(email, password) {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error);
        return false;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      return true;
    } catch {
      setAuthError("Erro ao conectar com o servidor.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return {
    token,
    isAuthenticated,
    authError,
    authLoading,
    register,
    login,
    logout,
  };
}
