import { useState, useRef } from "react";
import { AUTH_URL } from "@/constants/api";
import { TOKEN_KEY } from "@/constants/auth";

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Ref para o timer de debounce — persiste entre renders sem causar re-render
  const debounceRef = useRef(null);

  const isAuthenticated = !!token;

  async function authenticate(endpoint, email, password) {
    // Cancela submit anterior se o usuário clicar duas vezes rápido
    if (debounceRef.current) clearTimeout(debounceRef.current);

    return new Promise((resolve) => {
      debounceRef.current = setTimeout(async () => {
        setAuthError(null);
        setAuthLoading(true);
        try {
          const response = await fetch(`${AUTH_URL}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            setAuthError(data.error);
            resolve(false);
            return;
          }

          localStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);
          resolve(true);
        } catch {
          setAuthError("Erro ao conectar com o servidor.");
          resolve(false);
        } finally {
          setAuthLoading(false);
        }
      }, 300);
    });
  }

  function register(email, password) {
    return authenticate("register", email, password);
  }

  function login(email, password) {
    return authenticate("login", email, password);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
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
