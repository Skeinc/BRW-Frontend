import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/pages/home';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.home.title'),
      description: translate(language, 'pages.home.description'),
      path: '/',
    });
  },
  component: HomePage,
});
