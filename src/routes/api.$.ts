import { createFileRoute } from '@tanstack/react-router';
import { proxyApiRequest } from '@/shared/api/proxy-api-request';

const handleRequest = ({ request }: { request: Request }): Promise<Response> => proxyApiRequest(request);

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: handleRequest,
      POST: handleRequest,
      PUT: handleRequest,
      PATCH: handleRequest,
      DELETE: handleRequest,
      OPTIONS: handleRequest,
    },
  },
});
