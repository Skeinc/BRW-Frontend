import { createFileRoute, Outlet } from '@tanstack/react-router';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/admin')({
  ssr: false,
  head: () => buildHead({ title: 'BRW Admin', description: 'BRW Admin', path: '/admin', isNoIndex: true }),
  component: Outlet,
});
