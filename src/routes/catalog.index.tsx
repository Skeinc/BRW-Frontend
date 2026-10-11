import { createFileRoute } from '@tanstack/react-router';
import { CatalogPage } from '@/pages/catalog';
import { i18n } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/catalog/')({
  head: () =>
    buildHead({
      title: i18n.t('pages.catalog.title'),
      description: i18n.t('pages.catalog.description'),
      path: '/catalog',
    }),
  component: CatalogPage,
});
