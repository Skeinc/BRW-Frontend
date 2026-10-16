import { createFileRoute } from '@tanstack/react-router';
import { AdminCollectionsPage, collectionsSearchSchema } from '@/pages/admin-collections';

export const Route = createFileRoute('/admin/_authed/collections')({
  validateSearch: collectionsSearchSchema,
  component: CollectionsRoute,
});

function CollectionsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <AdminCollectionsPage
      search={search}
      onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
    />
  );
}
