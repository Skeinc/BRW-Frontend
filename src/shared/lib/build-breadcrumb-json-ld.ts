import { getRuntimeConfig } from '@/shared/config';
import { translate, type Language } from '@/shared/i18n';

/** schema.org `BreadcrumbList` node for a top-level page: Home, then the page. Mirrors `PageBreadcrumbs`. */
export function buildBreadcrumbJsonLd(language: Language, currentName: string, path: string): Record<string, unknown> {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: translate(language, 'nav.home'), item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: currentName, item: `${siteUrl}${path}` },
    ],
  };
}
