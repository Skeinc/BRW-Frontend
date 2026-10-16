import { createFileRoute, redirect } from '@tanstack/react-router';
import { adminMeQueryOptions } from '@/entities/admin-session';
import { AdminLoginPage } from '@/pages/admin-login';
import { ApiError } from '@/shared/api';

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async ({ context }) => {
    try {
      await context.queryClient.fetchQuery({ ...adminMeQueryOptions, staleTime: 0 });
    } catch (error) {
      if (error instanceof ApiError && error.code === 'UNAUTHORIZED') {
        return;
      }
      throw error;
    }
    throw redirect({ to: '/admin' });
  },
  component: AdminLoginPage,
});
