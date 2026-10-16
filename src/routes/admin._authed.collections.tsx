import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminCollectionsPage, collectionsSearchSchema } from '@/pages/admin-collections';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/collections')({
  validateSearch: collectionsSearchSchema,
  component: CollectionsRoute,
});

function CollectionsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminCollectionsPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
