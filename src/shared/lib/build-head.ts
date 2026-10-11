import { getRuntimeConfig } from '@/shared/config';

export interface BuildHeadInput {
  title: string;
  description: string;
  path: string;
  isNoIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

function serializeJsonLd(jsonLd: Record<string, unknown>): string {
  return JSON.stringify(jsonLd)
    .replaceAll('<', '\\u003c')
    .replaceAll(LINE_SEPARATOR, '\\u2028')
    .replaceAll(PARAGRAPH_SEPARATOR, '\\u2029');
}

/** Title, description, canonical, Open Graph and optional JSON-LD for a route `head()`. Rendered on the server. */
export function buildHead({ title, description, path, isNoIndex = false, jsonLd }: BuildHeadInput) {
  const canonical = `${getRuntimeConfig().siteUrl.replace(/\/$/, '')}${path}`;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:type', content: 'website' },
      ...(isNoIndex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
    ],
    links: [{ rel: 'canonical', href: canonical }],
    ...(jsonLd ? { scripts: [{ type: 'application/ld+json', children: serializeJsonLd(jsonLd) }] } : {}),
  };
}
