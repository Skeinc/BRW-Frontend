import { createFileRoute } from '@tanstack/react-router';
import { installmentPageQueryOptions } from '@/entities/installment-page';
import { buildInstallmentJsonLd, InstallmentPage } from '@/pages/installment';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/installment')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(installmentPageQueryOptions).catch(() => null);
  },
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
