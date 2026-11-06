import { appConfig } from "@shared/config/app";
import { Badge } from "bacurim-ui";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6 py-12">
      <div>
        <Badge color="success" variant="soft">
          Bacurim UI integrado
        </Badge>
      </div>
      <h1 className="heading-lg">{appConfig.name}</h1>
      <Link href="/login" className="body-md text-primary underline">
        Entrar no Bacurim
      </Link>
      <p className="body-md">A base da aplicação frontend está em execução.</p>
      <p className="body-sm text-text-secondary">
        Esta página temporária valida a inicialização do Bacurim. As
        funcionalidades serão disponibilizadas nas próximas etapas.
      </p>
    </main>
  );
}
