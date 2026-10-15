import { createFileRoute } from '@tanstack/react-router';
import { buildInstallmentJsonLd, InstallmentPage } from '@/pages/installment';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/installment')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.installment.title'),
      description: translate(language, 'pages.installment.description'),
      path: '/installment',
      jsonLd: buildInstallmentJsonLd(language),
    });
  },
  component: InstallmentPage,
});
