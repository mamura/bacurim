import { Skeleton } from "bacurim-ui";

export function PageLoading() {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-4xl space-y-4 p-6">
      <span className="sr-only">Carregando página...</span>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
