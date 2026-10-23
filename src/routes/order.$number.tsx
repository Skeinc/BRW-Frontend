import { createFileRoute } from '@tanstack/react-router';
import { OrderSuccessPage } from '@/pages/order-success';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/order/$number')({
  head: ({ params, matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'order.title', { number: params.number }),
      description: translate(language, 'order.description'),
      path: `/order/${params.number}`,
      isNoIndex: true,
    });
  },
  component: OrderSuccessPage,
});
