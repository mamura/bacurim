import type { SafeProblemDetails } from "./problem-details.ts";

export type ApiErrorKind =
  | "http"
  | "network"
  | "invalid-response"
  | "configuration"
  | "timeout"
  | "cancelled";

const messages: Record<ApiErrorKind, string> = {
  http: "Não foi possível concluir a solicitação. Tente novamente.",
  timeout: "A solicitação demorou mais do que o esperado. Tente novamente.",
  cancelled: "A solicitação foi cancelada.",
  network: "Não foi possível conectar ao servidor. Verifique sua conexão.",
  "invalid-response": "O servidor retornou uma resposta inesperada.",
  configuration: "A configuração de comunicação é inválida.",
};
const statusMessages: Record<number, string> = {
  400: "Não foi possível processar a solicitação.",
  401: "Sua sessão expirou ou você precisa entrar novamente.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "O recurso solicitado não foi encontrado.",
  409: "A operação conflita com o estado atual dos dados.",
  422: "Revise os campos informados.",
  429: "Muitas solicitações. Aguarde e tente novamente.",
};

export interface ApiErrorOptions {
  status?: number;
  code?: string;
  requestId?: string;
  fieldErrors?: Record<string, string[]>;
  problem?: SafeProblemDetails;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly fieldErrors: Record<string, string[]>;
  readonly problem?: SafeProblemDetails;

  constructor(kind: ApiErrorKind, options: ApiErrorOptions = {}) {
    super(
      kind === "http"
        ? (statusMessages[options.status ?? 0] ?? messages.http)
        : messages[kind],
    );
    this.name = "ApiError";
    this.kind = kind;
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.fieldErrors = options.fieldErrors ?? {};
    this.problem = options.problem;
  }
}

export interface ApiErrorView {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  requestId?: string;
  fieldErrors: Record<string, string[]>;
}

// Only this DTO is intended for presentation/serialization, never the exception.
export function toApiErrorView(error: unknown): ApiErrorView {
  const known =
    error instanceof ApiError ? error : new ApiError("invalid-response");
  return {
    kind: known.kind,
    message: known.message,
    status: known.status,
    code: known.code,
    requestId: known.requestId,
    fieldErrors: Object.fromEntries(
      Object.entries(known.fieldErrors).map(([field, messages]) => [
        field,
        [...messages],
      ]),
    ),
  };
}
