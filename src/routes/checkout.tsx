import { createFileRoute } from '@tanstack/react-router';
import { CheckoutPage } from '@/pages/checkout';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/checkout')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'checkout.title'),
      description: translate(language, 'checkout.description'),
      path: '/checkout',
      isNoIndex: true,
    });
  },
  component: CheckoutPage,
});
