import { getRuntimeConfig } from '@/shared/config';

export interface BuildHeadInput {
  title: string;
  description: string;
  /** Canonical path, e.g. `/catalog/shkafy`. Query params are never part of it unless passed explicitly. */
  path: string;
  isNoIndex?: boolean;
}

/** Title, description, canonical and Open Graph tags for a route `head()`. Rendered on the server. */
export function buildHead({ title, description, path, isNoIndex = false }: BuildHeadInput) {
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
  };
}
