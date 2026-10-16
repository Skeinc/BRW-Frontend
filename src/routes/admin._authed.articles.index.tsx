import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminArticlesPage, articlesSearchSchema } from '@/pages/admin-articles';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/articles/')({
  validateSearch: articlesSearchSchema,
  component: ArticlesRoute,
});

function ArticlesRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminArticlesPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
