"use client";

// Knows who's signed in, for the whole site. Asks the User API once on load.
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { userApi } from "@/lib/userApi";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // status: "loading" | "signedIn" | "signedOut"
  const [state, setState] = useState({ status: "loading", account: null });

  const signedIn = useCallback((account) => setState({ status: "signedIn", account }), []);

  useEffect(() => {
    let cancelled = false;
    userApi.me()
      .then((data) => { if (!cancelled) signedIn(data.account); })
      .catch(() => { if (!cancelled) setState({ status: "signedOut", account: null }); });
    return () => { cancelled = true; };
  }, [signedIn]);

  const signOut = useCallback(async () => {
    try { await userApi.logout(); } catch { /* already signed out */ }
    setState({ status: "signedOut", account: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signedIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
