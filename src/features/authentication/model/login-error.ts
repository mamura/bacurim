import { ApiError } from "@shared/http";
export function loginErrorMessage(error: unknown) {
  if (!(error instanceof ApiError))
    return "Não foi possível entrar. Tente novamente.";
  if (error.status === 401) return "E-mail ou senha inválidos.";
  if (error.status === 422) return "Confira o e-mail e a senha informados.";
  if (error.status === 429)
    return "Muitas tentativas. Aguarde um minuto antes de tentar novamente.";
  if (error.status === 419)
    return "A proteção da sessão expirou. Envie o formulário novamente.";
  if (error.status === 403)
    return "A origem deste acesso não está autorizada. Contate o suporte.";
  if (error.kind === "network" || error.kind === "timeout")
    return "Não foi possível conectar. Verifique sua conexão e tente novamente.";
  return "Não foi possível entrar. Tente novamente.";
}
