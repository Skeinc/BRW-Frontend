import { Skeleton } from '@/shared/ui/skeleton';

/** Placeholder of the report while it loads for the first time. */
export function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-96" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
