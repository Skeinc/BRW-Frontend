import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminCategoriesPage, categoriesSearchSchema } from '@/pages/admin-categories';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/categories')({
  validateSearch: categoriesSearchSchema,
  component: CategoriesRoute,
});

function CategoriesRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminCategoriesPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
