import { getRuntimeConfig, SITE_NAME } from '@/shared/config';

const OG_LOCALE = 'ru_RU';

export interface BuildHeadInput {
  title: string;
  description: string;
  path: string;
  isNoIndex?: boolean;
  /** Absolute or site-relative URL of the image for link previews. */
  ogImage?: string;
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
export function buildHead({ title, description, path, isNoIndex = false, ogImage, jsonLd }: BuildHeadInput) {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  const canonical = `${siteUrl}${path}`;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: OG_LOCALE },
      { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      ...(ogImage ? [{ property: 'og:image', content: new URL(ogImage, `${siteUrl}/`).href }] : []),
      ...(isNoIndex ? [{ name: 'robots', content: 'noindex, follow' }] : []),
    ],
    links: [{ rel: 'canonical', href: canonical }],
    ...(jsonLd ? { scripts: [{ type: 'application/ld+json', children: serializeJsonLd(jsonLd) }] } : {}),
  };
}
