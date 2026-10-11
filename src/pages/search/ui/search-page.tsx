import { useTranslation } from 'react-i18next';
import { PagePlaceholder } from '@/shared/ui/page-placeholder';

interface SearchPageProps {
  q?: string;
}

export function SearchPage({ q }: SearchPageProps) {
  const { t } = useTranslation();
  return <PagePlaceholder heading={t('pages.search.heading')} lead={q ? q : t('pages.search.lead')} />;
}
