import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

// Session de l'administration : cookie sécurisé (httpOnly) posé par le serveur.
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = vérification en cours

  useEffect(() => {
    api("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null));
    const onExpired = () => setUser(null);
    window.addEventListener("haho3:unauthorized", onExpired);
    return () => window.removeEventListener("haho3:unauthorized", onExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    setUser(await api("/api/auth/login", { method: "POST", body: { email, password } }));
  }, []);

  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>{children}</AuthContext.Provider>;
}
