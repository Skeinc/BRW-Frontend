const API_PREFIX = '/api';
const DEFAULT_UPSTREAM_URL = 'http://localhost:3000';
const HOP_BY_HOP_HEADERS = ['host', 'connection', 'content-length', 'accept-encoding'];
const DECODED_RESPONSE_HEADERS = ['content-encoding', 'content-length', 'transfer-encoding', 'connection'];
const BAD_GATEWAY_STATUS = 502;

/** Server only. Forwards a browser request for `/api/*` to API_INTERNAL_URL so the browser talks to one site and cookies stay first-party. */
export async function proxyApiRequest(request: Request): Promise<Response> {
  const upstreamOrigin = (process.env.API_INTERNAL_URL ?? DEFAULT_UPSTREAM_URL).replace(/\/$/, '');
  const { pathname, search } = new URL(request.url);
  const headers = new Headers(request.headers);
  HOP_BY_HOP_HEADERS.forEach((name) => headers.delete(name));
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  try {
    const upstream = await fetch(`${upstreamOrigin}${API_PREFIX}${pathname.slice(API_PREFIX.length)}${search}`, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      redirect: 'manual',
      // @ts-expect-error `duplex` is required by Node fetch for streamed bodies but missing from the DOM typings.
      duplex: 'half',
    });
    const responseHeaders = new Headers(upstream.headers);
    DECODED_RESPONSE_HEADERS.forEach((name) => responseHeaders.delete(name));
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return new Response('API is unavailable', { status: BAD_GATEWAY_STATUS });
  }
}
