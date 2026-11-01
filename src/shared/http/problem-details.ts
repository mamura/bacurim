export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface SafeProblemDetails {
  type?: string;
  status: number;
  instance?: string;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function normalizeProblemDetails(payload: unknown, status: number) {
  const fieldErrors: Record<string, string[]> = Object.create(null);
  if (!isRecord(payload)) return { fieldErrors };
  const code =
    typeof payload.code === "string" &&
    /^[a-z][a-z0-9_.-]{0,127}$/.test(payload.code)
      ? payload.code
      : undefined;
  const problem: SafeProblemDetails = { status };
  if (typeof payload.type === "string" && payload.type.length <= 500)
    problem.type = payload.type;
  if (
    typeof payload.instance === "string" &&
    payload.instance.startsWith("/") &&
    !/[?#\r\n]/.test(payload.instance) &&
    payload.instance.length <= 500
  )
    problem.instance = payload.instance;

  if (status === 422 && isRecord(payload.errors)) {
    for (const [field, messages] of Object.entries(payload.errors).slice(
      0,
      100,
    )) {
      if (
        !/^[a-zA-Z0-9_.[\]-]{1,128}$/.test(field) ||
        field
          .split(".")
          .some((part) =>
            ["__proto__", "constructor", "prototype"].includes(part),
          )
      )
        continue;
      if (Array.isArray(messages)) {
        const safeMessages = messages
          .filter((item): item is string => typeof item === "string")
          .slice(0, 5)
          .map((item) => item.slice(0, 500));
        if (safeMessages.length) fieldErrors[field] = safeMessages;
      }
    }
  }
  return { code, fieldErrors, problem };
}

export function safeRequestId(value: string | null): string | undefined {
  return value && /^[a-zA-Z0-9._:-]{1,128}$/.test(value) ? value : undefined;
}
