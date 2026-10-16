import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminOrdersPage, ordersSearchSchema } from '@/pages/admin-orders';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/orders')({
  validateSearch: ordersSearchSchema,
  component: OrdersRoute,
});

function OrdersRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminOrdersPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
