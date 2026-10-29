import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminSettingsPage, settingsSearchSchema } from '@/pages/admin-settings';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/settings')({
  validateSearch: settingsSearchSchema,
  component: SettingsRoute,
});

function SettingsRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminSettingsPage
        search={search}
        onSearchChange={(patch) => void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })}
      />
    </Suspense>
  );
}
