import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { ApiError } from '@/shared/api';

function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'UNAUTHORIZED';
}

/** Sends the admin to the login page when any admin request reports an expired or revoked session. */
export function useSessionExpiry(): void {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isRedirecting = useRef(false);

  useEffect(() => {
    /**
     * Cached admin data is dropped only after the screen has been left. Removing a query that still has a mounted
     * observer makes it fetch again, get another 401 and trigger this again without end. Only the first 401 starts
     * the redirect; the ones that follow while it is under way are ignored.
     */
    const redirectToLogin = () => {
      if (isRedirecting.current) {
        return;
      }
      isRedirecting.current = true;
      void navigate({ to: '/admin/login' })
        .then(() => queryClient.removeQueries({ queryKey: ['admin'] }))
        .finally(() => {
          isRedirecting.current = false;
        });
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
