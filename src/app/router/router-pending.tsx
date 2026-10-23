import { Skeleton } from '@/shared/ui/skeleton';

/** Shown when a route loader takes longer than the router's pending threshold. */
export function RouterPending() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-7xl px-4 py-8">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  );
}
