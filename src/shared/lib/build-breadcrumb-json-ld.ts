import { getRuntimeConfig } from '@/shared/config';
import { translate, type Language } from '@/shared/i18n';

export interface BreadcrumbStep {
  name: string;
  path: string;
}

/** schema.org `BreadcrumbList`: Home, then the given steps. Mirrors the visible breadcrumbs. */
export function buildBreadcrumbTrailJsonLd(
  language: Language,
  steps: readonly BreadcrumbStep[],
): Record<string, unknown> {
  const siteUrl = getRuntimeConfig().siteUrl.replace(/\/$/, '');
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: translate(language, 'nav.home'), item: `${siteUrl}/` },
      ...steps.map((step, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: step.name,
        item: `${siteUrl}${step.path}`,
      })),
    ],
  };
}

/** `BreadcrumbList` for a top-level page: Home, then the page. */
export function buildBreadcrumbJsonLd(language: Language, currentName: string, path: string): Record<string, unknown> {
  return buildBreadcrumbTrailJsonLd(language, [{ name: currentName, path }]);
}
