import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { fetchProfile } from "../api/authApi";
import { useBackendStatus } from "./useBackendStatus";

export const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "jan-events-auth-v1";

export function AuthProvider({ children }) {
  const { isReady } = useBackendStatus();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const login = useCallback(({ token: nextToken, user: nextUser }) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  }, []);

  useEffect(() => {
    // Do not mistake a sleeping Render backend for an invalid saved session.
    if (!isReady) return;
    let active = true;
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const { token: storedToken } = JSON.parse(stored);
        if (!storedToken) throw new Error("Missing session");
        const currentUser = await fetchProfile(storedToken);
        if (active) {
          setToken(storedToken);
          setUser(currentUser);
        }
      } catch {
        if (active) logout();
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => { active = false; };
  }, [logout, isReady]);

  const value = useMemo(() => ({
    user, token, isAuthenticated: Boolean(token),
    isAuthLoading: isLoading, login, logout,
  }), [user, token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
