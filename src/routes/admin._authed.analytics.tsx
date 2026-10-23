import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminAnalyticsPage, analyticsSearchSchema } from '@/pages/admin-analytics';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/analytics')({
  validateSearch: analyticsSearchSchema,
  component: AnalyticsRoute,
});

function AnalyticsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminAnalyticsPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
