import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminNewsPage, newsSearchSchema } from '@/pages/admin-news';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/news/')({
  validateSearch: newsSearchSchema,
  component: NewsRoute,
});

function NewsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminNewsPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
