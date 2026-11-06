export interface LoginInput {
  email: string;
  password: string;
}
export function validateLogin(input: LoginInput) {
  const errors: Partial<Record<keyof LoginInput, string>> = {};
  if (!input.email.trim()) errors.email = "Informe seu e-mail.";
  else if (
    input.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())
  )
    errors.email = "Informe um e-mail válido.";
  if (!input.password) errors.password = "Informe sua senha.";
  else if (input.password.length > 128)
    errors.password = "A senha deve ter até 128 caracteres.";
  return errors;
}
