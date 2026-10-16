import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_authed/collections')({
  component: () => <h1 className="text-2xl font-semibold">collections</h1>,
});
