"use client";

import {
  Alert,
  AlertContent,
  AlertDescription,
  Button,
  Input,
} from "bacurim-ui";
import type { FormEvent } from "react";
import { useId, useRef, useState } from "react";

import type { LoginInput } from "../model/login-validation";
import { validateLogin } from "../model/login-validation";

export function LoginForm({
  authenticate,
  onSuccess,
}: {
  authenticate?: (input: LoginInput) => Promise<void>;
  onSuccess?: () => void;
}) {
  const id = useId();
  const busy = useRef(false);
  const [values, setValues] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginInput, string>>
  >({});
  const [failure, setFailure] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy.current || !authenticate) return;
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    setFailure("");
    if (Object.keys(nextErrors).length) {
      (nextErrors.email ? emailRef : passwordRef).current?.focus();
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      await authenticate({
        email: values.email.trim(),
        password: values.password,
      });
      onSuccess?.();
    } catch {
      setFailure(
        "Não foi possível entrar. Confira seus dados e tente novamente.",
      );
    } finally {
      setValues((current) => ({ ...current, password: "" }));
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-5"
      aria-busy={pending}
    >
      {failure && (
        <Alert variant="danger">
          <AlertContent>
            <AlertDescription>{failure}</AlertDescription>
          </AlertContent>
        </Alert>
      )}
      <div className="space-y-2">
        <label htmlFor={id + "-email"} className="body-sm font-medium">
          E-mail
        </label>
        <Input
          ref={emailRef}
          id={id + "-email"}
          type="email"
          autoComplete="username"
          inputMode="email"
          maxLength={254}
          required
          value={values.email}
          disabled={pending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? id + "-email-error" : undefined}
          onChange={(event) =>
            setValues({ ...values, email: event.target.value })
          }
        />
        {errors.email && (
          <p id={id + "-email-error"} className="body-sm text-danger">
            {errors.email}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor={id + "-password"} className="body-sm font-medium">
          Senha
        </label>
        <Input
          ref={passwordRef}
          id={id + "-password"}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          maxLength={128}
          required
          value={values.password}
          disabled={pending}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? id + "-password-error" : undefined
          }
          onChange={(event) =>
            setValues({ ...values, password: event.target.value })
          }
        />
        {errors.password && (
          <p id={id + "-password-error"} className="body-sm text-danger">
            {errors.password}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={showPassword}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar senha" : "Mostrar senha"}
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={pending || !authenticate}
      >
        {pending ? "Entrando..." : "Entrar"}
      </Button>
      <p role="status" className="sr-only">
        {pending ? "Autenticando, aguarde." : ""}
      </p>
    </form>
  );
}
