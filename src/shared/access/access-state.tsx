import { Alert, AlertContent, AlertDescription, AlertTitle } from "bacurim-ui";
import Link from "next/link";
const messages = {
  401: {
    title: "Entre novamente",
    description: "Sua sessão não está disponível. Entre para continuar.",
    href: "/login",
    action: "Ir para o login",
  },
  403: {
    title: "Acesso não permitido",
    description: "Seu vínculo atual não permite acessar esta operação.",
    href: "/app",
    action: "Voltar às empresas",
  },
  404: {
    title: "Ambiente indisponível",
    description: "Não foi possível acessar o recurso solicitado.",
    href: "/app",
    action: "Voltar às empresas",
  },
};
export function AccessState({ status }: { status: 401 | 403 | 404 }) {
  const message = messages[status];
  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6">
      <Alert variant="danger">
        <AlertContent>
          <AlertTitle aria-level={1}>{message.title}</AlertTitle>
          <AlertDescription>{message.description}</AlertDescription>
        </AlertContent>
      </Alert>
      <Link className="body-sm text-primary underline" href={message.href}>
        {message.action}
      </Link>
    </section>
  );
}
