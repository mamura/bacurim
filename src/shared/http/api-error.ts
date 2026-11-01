export type ApiErrorKind =
  "http" | "network" | "invalid-response" | "configuration";

const messages: Record<ApiErrorKind, string> = {
  http: "Não foi possível concluir a solicitação. Tente novamente.",
  network: "Não foi possível conectar ao servidor. Verifique sua conexão.",
  "invalid-response": "O servidor retornou uma resposta inesperada.",
  configuration: "A configuração de comunicação é inválida.",
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, options: { status?: number } = {}) {
    super(messages[kind]);
    this.name = "ApiError";
    this.kind = kind;
    this.status = options.status;
  }
}
