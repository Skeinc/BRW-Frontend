import { useTranslation } from 'react-i18next';
import { PagePlaceholder } from '@/shared/ui/page-placeholder';

export function HomePage() {
  const { t } = useTranslation();
  return <PagePlaceholder heading={t('pages.home.heading')} lead={t('pages.home.lead')} />;
}
