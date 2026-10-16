import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_authed/categories')({
  component: () => <h1 className="text-2xl font-semibold">categories</h1>,
});
