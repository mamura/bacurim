import Link from "next/link";
import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section
        className="flex flex-col justify-between bg-primary p-8 text-white lg:p-16"
        aria-label="Bacurim"
      >
        <Link href="/" className="font-heading text-2xl font-semibold">
          bacurim<span className="text-success">.</span>
        </Link>
        <div className="my-10 max-w-lg">
          <p className="mb-4 text-sm uppercase tracking-widest">
            Clareza para o seu negócio
          </p>
          <h2 className="font-heading text-3xl font-semibold leading-tight lg:text-5xl">
            Um espaço para organizar o que vem pela frente.
          </h2>
          <p className="mt-6 text-lg">
            Acesse o ambiente da sua empresa com segurança e simplicidade.
          </p>
        </div>
        <p className="text-sm">Gestão financeira com clareza.</p>
      </section>
      <section className="flex min-w-0 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
