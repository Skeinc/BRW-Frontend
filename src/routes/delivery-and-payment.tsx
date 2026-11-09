import { createFileRoute } from '@tanstack/react-router';
import { deliveryPageQueryOptions } from '@/entities/delivery-page';
import { buildDeliveryJsonLd, DeliveryAndPaymentPage } from '@/pages/delivery-and-payment';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/delivery-and-payment')({
  loader: async ({ context }) => {
    const response = await context.queryClient.ensureQueryData(deliveryPageQueryOptions).catch(() => null);
    return { content: response?.content ?? null };
  },
  head: ({ matches, loaderData }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.deliveryAndPayment.title'),
      description: translate(language, 'pages.deliveryAndPayment.description'),
      path: '/delivery-and-payment',
      jsonLd: buildDeliveryJsonLd(language, loaderData?.content),
    });
  },
  component: DeliveryAndPaymentPage,
});
