import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminSolutionsPage, solutionsSearchSchema } from '@/pages/admin-solutions';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/solutions')({
  validateSearch: solutionsSearchSchema,
  component: SolutionsRoute,
});

function SolutionsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminSolutionsPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
