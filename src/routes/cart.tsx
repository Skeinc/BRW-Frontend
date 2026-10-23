import { createFileRoute } from '@tanstack/react-router';
import { CartPage } from '@/pages/cart';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/cart')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.cart.title'),
      description: translate(language, 'pages.cart.description'),
      path: '/cart',
      isNoIndex: true,
    });
  },
  component: CartPage,
});
