"use client";
import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { subscribeUnauthorized } from "./authenticated-request";
import { SessionStore } from "./session-store";

const SessionContext = createContext<SessionStore | null>(null);
export function SessionProvider({
  children,
  store: suppliedStore,
}: {
  children: ReactNode;
  store?: SessionStore;
}) {
  const [store] = useState(() => suppliedStore ?? new SessionStore());
  useEffect(() => subscribeUnauthorized(store.invalidate), [store]);
  useEffect(() => {
    const revalidate = () => {
      if (
        document.visibilityState === "visible" &&
        store.getSnapshot().status === "authenticated"
      )
        void store.refresh();
    };
    window.addEventListener("focus", revalidate);
    document.addEventListener("visibilitychange", revalidate);
    return () => {
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", revalidate);
    };
  }, [store]);
  return (
    <SessionContext.Provider value={store}>{children}</SessionContext.Provider>
  );
}
export function useSession() {
  const store = useContext(SessionContext);
  if (!store) throw new Error("SessionProvider is required");
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  return { ...state, store };
}
