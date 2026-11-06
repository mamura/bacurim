import type { ReactNode } from "react";
export function PageContent({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl space-y-8 p-5 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="heading-lg break-words">{title}</h1>
          {description && (
            <p className="body-md mt-3 max-w-2xl text-text-secondary">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
