import { authenticatedRequest } from "@shared/auth/authenticated-request";
import type { HttpRequestOptions } from "@shared/http";
import { ApiError } from "@shared/http";

export class OrganizationRequestScope {
  private controller = new AbortController();
  constructor(
    readonly organizationId: string,
    private onUnavailable: () => void = () => {},
    readonly revision = 0,
  ) {}
  activate = () => {
    if (this.controller.signal.aborted) this.controller = new AbortController();
  };
  close = () => this.controller.abort();
  async request<T>(path: string, options: HttpRequestOptions = {}) {
    const scopeSignal = this.controller.signal;
    if (scopeSignal.aborted) throw new ApiError("cancelled");
    const signal = options.signal
      ? AbortSignal.any([options.signal, scopeSignal])
      : scopeSignal;
    try {
      const response = await authenticatedRequest<T>(
        "api/v1/organizations/" +
          encodeURIComponent(this.organizationId) +
          "/" +
          path,
        { ...options, signal },
      );
      if (scopeSignal.aborted) throw new ApiError("cancelled");
      return response;
    } catch (error) {
      if (scopeSignal.aborted) throw new ApiError("cancelled");
      if (error instanceof ApiError && [403, 404].includes(error.status ?? 0))
        this.onUnavailable();
      throw error;
    }
  }
}
