import type { ApiErrorView } from "@shared/http";
import { ApiError, toApiErrorView } from "@shared/http";

import type { AuthUser } from "./contracts";
import { getAuthenticatedUser } from "./services";

export interface SessionSnapshot {
  status: "loading" | "authenticated" | "unauthenticated" | "error";
  user: AuthUser | null;
  error?: ApiErrorView;
  revision: number;
}
export class SessionStore {
  private snapshot: SessionSnapshot = {
    status: "loading",
    user: null,
    revision: 0,
  };
  private listeners = new Set<() => void>();
  private version = 0;
  private pending?: Promise<void>;
  constructor(private load: () => Promise<AuthUser> = getAuthenticatedUser) {}
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private set(value: Omit<SessionSnapshot, "revision">) {
    this.snapshot = { ...value, revision: this.version };
    this.listeners.forEach((listener) => listener());
  }
  acceptUser = (user: AuthUser) => {
    this.version++;
    this.pending = undefined;
    this.set({ status: "authenticated", user });
  };
  invalidate = () => {
    this.version++;
    this.pending = undefined;
    this.set({ status: "unauthenticated", user: null });
  };
  refresh = (): Promise<void> => {
    if (this.pending) return this.pending;
    const version = ++this.version;
    this.set({ status: "loading", user: null });
    const pending = this.load()
      .then((user) => {
        if (version === this.version)
          this.set({ status: "authenticated", user });
      })
      .catch((error: unknown) => {
        if (version !== this.version) return;
        if (error instanceof ApiError && error.status === 401)
          this.set({ status: "unauthenticated", user: null });
        else
          this.set({
            status: "error",
            user: null,
            error: toApiErrorView(error),
          });
      })
      .finally(() => {
        if (version === this.version) this.pending = undefined;
      });
    this.pending = pending;
    return pending;
  };
}
