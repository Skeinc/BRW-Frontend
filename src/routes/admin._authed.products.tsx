import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_authed/products')({
  component: () => <h1 className="text-2xl font-semibold">products</h1>,
});
