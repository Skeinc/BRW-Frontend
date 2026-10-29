import { createFileRoute } from '@tanstack/react-router';
import { buildPrivacyJsonLd, PrivacyPage } from '@/pages/privacy';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/privacy')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.privacy.title'),
      description: translate(language, 'pages.privacy.description'),
      path: '/privacy',
      jsonLd: buildPrivacyJsonLd(language),
    });
  },
  component: PrivacyPage,
});
