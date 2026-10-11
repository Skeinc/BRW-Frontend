import { useTranslation } from 'react-i18next';
import { PagePlaceholder } from '@/shared/ui/page-placeholder';

export function CatalogPage() {
  const { t } = useTranslation();
  return <PagePlaceholder heading={t('pages.catalog.heading')} lead={t('pages.catalog.lead')} />;
}
