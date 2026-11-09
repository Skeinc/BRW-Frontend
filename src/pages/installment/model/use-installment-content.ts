import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  installmentPageQueryOptions,
  resolveInstallmentContent,
  type InstallmentPageContent,
} from '@/entities/installment-page';
import { DEFAULT_LANGUAGE, isLanguage } from '@/shared/i18n';

/** Editable blocks of the page: saved in the admin panel or the built-in translations. */
export function useInstallmentContent(): InstallmentPageContent {
  const { i18n } = useTranslation();
  const { data } = useQuery(installmentPageQueryOptions);
  const language = isLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;
  return resolveInstallmentContent({ saved: data?.content, language });
}
