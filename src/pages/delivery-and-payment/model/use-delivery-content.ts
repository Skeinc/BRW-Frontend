import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { deliveryPageQueryOptions, resolveDeliveryContent, type DeliveryPageContent } from '@/entities/delivery-page';
import { isLanguage, DEFAULT_LANGUAGE } from '@/shared/i18n';

/** Editable blocks of the page: saved in the admin panel (Russian) or the built-in translations. */
export function useDeliveryContent(): DeliveryPageContent {
  const { i18n } = useTranslation();
  const { data } = useQuery(deliveryPageQueryOptions);
  const language = isLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;
  return resolveDeliveryContent({ saved: data?.content, language });
}
