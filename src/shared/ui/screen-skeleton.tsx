import { Skeleton } from './skeleton';

/** Placeholder shown while the code of a screen is loading. */
export function ScreenSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4" aria-busy="true">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="min-h-0 flex-1" />
    </div>
  );
}
