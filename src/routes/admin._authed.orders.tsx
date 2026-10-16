import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_authed/orders')({
  component: () => <h1 className="text-2xl font-semibold">orders</h1>,
});
