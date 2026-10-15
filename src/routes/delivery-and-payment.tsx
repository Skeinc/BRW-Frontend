import { createFileRoute } from '@tanstack/react-router';
import { buildDeliveryJsonLd, DeliveryAndPaymentPage } from '@/pages/delivery-and-payment';
import { readHeadLanguage, translate } from '@/shared/i18n';
import { buildHead } from '@/shared/lib/build-head';

export const Route = createFileRoute('/delivery-and-payment')({
  head: ({ matches }) => {
    const language = readHeadLanguage(matches);
    return buildHead({
      title: translate(language, 'pages.deliveryAndPayment.title'),
      description: translate(language, 'pages.deliveryAndPayment.description'),
      path: '/delivery-and-payment',
      jsonLd: buildDeliveryJsonLd(language),
    });
  },
  component: DeliveryAndPaymentPage,
});
