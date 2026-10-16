import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ApiError } from '@/shared/api';

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'UNAUTHORIZED';
}

/** Sends the admin to the login page when any admin request reports an expired or revoked session. */
export function useSessionExpiry(): void {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToLogin = () => {
      queryClient.removeQueries({ queryKey: ['admin'] });
      void navigate({ to: '/admin/login' });
    };
    const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error' && isUnauthorized(event.action.error)) {
        redirectToLogin();
      }
    });
    const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error' && isUnauthorized(event.action.error)) {
        redirectToLogin();
      }
    });
    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
    };
  }, [queryClient, navigate]);
}
