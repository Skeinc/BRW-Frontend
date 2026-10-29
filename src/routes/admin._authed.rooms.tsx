import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminRoomsPage, roomsSearchSchema } from '@/pages/admin-rooms';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/rooms')({
  validateSearch: roomsSearchSchema,
  component: RoomsRoute,
});

function RoomsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminRoomsPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
