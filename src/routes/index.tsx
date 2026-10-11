import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/pages/home';
import { i18n } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/')({
  head: () =>
    buildHead({ title: i18n.t('pages.home.title'), description: i18n.t('pages.home.description'), path: '/' }),
  component: HomePage,
});
