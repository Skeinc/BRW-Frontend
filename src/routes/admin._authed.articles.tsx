import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_authed/articles')({
  component: () => <h1 className="text-2xl font-semibold">articles</h1>,
});
