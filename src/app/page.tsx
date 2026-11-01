import { Badge } from "bacurim-ui";

import { appConfig } from "@/config/app";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-4 px-6 py-12">
      <div><Badge color="success" variant="soft">Bacurim UI integrado</Badge></div>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {appConfig.name}
      </h1>
      <p className="text-base leading-relaxed">
        A base da aplicação frontend está em execução.
      </p>
      <p className="text-sm leading-relaxed">
        Esta página temporária valida a inicialização do Bacurim.
        As funcionalidades serão disponibilizadas nas próximas etapas.
      </p>
    </main>
  );
}
