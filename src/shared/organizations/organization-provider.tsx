"use client";
import { useSession } from "@shared/auth/session-provider";
import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { OrganizationStore } from "./organization-store";

const OrganizationContext = createContext<OrganizationStore | null>(null);
function OrganizationScope({ children }: { children: ReactNode }) {
  const [store] = useState(() => new OrganizationStore());
  useEffect(() => {
    void store.refresh();
    return store.dispose;
  }, [store]);
  return (
    <OrganizationContext.Provider value={store}>
      {children}
    </OrganizationContext.Provider>
  );
}
export function OrganizationProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  return (
    <OrganizationScope key={session.user?.public_id + ":" + session.revision}>
      {children}
    </OrganizationScope>
  );
}
export function useOrganizations() {
  const store = useContext(OrganizationContext);
  if (!store) throw new Error("OrganizationProvider is required");
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  return { ...snapshot, store };
}
