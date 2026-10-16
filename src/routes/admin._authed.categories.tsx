import { createFileRoute } from '@tanstack/react-router';
import { AdminCategoriesPage, categoriesSearchSchema } from '@/pages/admin-categories';

export const Route = createFileRoute('/admin/_authed/categories')({
  validateSearch: categoriesSearchSchema,
  component: CategoriesRoute,
});

function CategoriesRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <AdminCategoriesPage
      search={search}
      onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
    />
  );
}
