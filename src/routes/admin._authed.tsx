import { createFileRoute, redirect } from '@tanstack/react-router';
import { adminMeQueryOptions } from '@/entities/admin-session';
import { ApiError } from '@/shared/api';
import { AdminShell } from '@/widgets/admin-shell';

export const Route = createFileRoute('/admin/_authed')({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.ensureQueryData(adminMeQueryOptions);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'UNAUTHORIZED') {
        throw redirect({ to: '/admin/login' });
      }
      throw error;
    }
  },
  component: AdminShell,
});
