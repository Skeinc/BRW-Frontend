import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminDeliveryPage } from '@/pages/admin-delivery';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/delivery')({
  component: DeliveryRoute,
});

function DeliveryRoute() {
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminDeliveryPage />
    </Suspense>
  );
}
