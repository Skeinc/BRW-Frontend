import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { AdminInstallmentPage } from '@/pages/admin-installment';
import { ScreenSkeleton } from '@/shared/ui/screen-skeleton';

export const Route = createFileRoute('/admin/_authed/installment')({
  component: InstallmentRoute,
});

function InstallmentRoute() {
  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <AdminInstallmentPage />
    </Suspense>
  );
}
