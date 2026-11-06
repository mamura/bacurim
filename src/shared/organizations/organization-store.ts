import type { ApiErrorView } from "@shared/http";
import { toApiErrorView } from "@shared/http";

import type { AuthorizedOrganization } from "./contracts";
import { getAuthorizedOrganizations } from "./services";

export interface OrganizationSnapshot {
  status: "loading" | "ready" | "error";
  organizations: readonly AuthorizedOrganization[];
  error?: ApiErrorView;
  revision: number;
}
export class OrganizationStore {
  private snapshot: OrganizationSnapshot = {
    status: "loading",
    organizations: [],
    revision: 0,
  };
  private listeners = new Set<() => void>();
  private generation = 0;
  private controller?: AbortController;
  private pending?: Promise<void>;
  constructor(
    private load: (
      signal: AbortSignal,
    ) => Promise<AuthorizedOrganization[]> = getAuthorizedOrganizations,
  ) {}
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private set(value: Omit<OrganizationSnapshot, "revision">) {
    this.snapshot = { ...value, revision: this.generation };
    this.listeners.forEach((listener) => listener());
  }
  refresh = (): Promise<void> => {
    if (this.pending) return this.pending;
    const generation = ++this.generation;
    const controller = new AbortController();
    this.controller = controller;
    this.set({ status: "loading", organizations: [] });
    const pending = this.load(controller.signal)
      .then((organizations) => {
        if (generation === this.generation)
          this.set({ status: "ready", organizations });
      })
      .catch((error: unknown) => {
        if (generation === this.generation && !controller.signal.aborted)
          this.set({
            status: "error",
            organizations: [],
            error: toApiErrorView(error),
          });
      })
      .finally(() => {
        if (generation === this.generation) this.pending = undefined;
      });
    this.pending = pending;
    return pending;
  };
  dispose = () => {
    this.generation++;
    this.controller?.abort();
    this.pending = undefined;
    this.set({ status: "loading", organizations: [] });
  };
}
