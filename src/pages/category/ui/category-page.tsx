import { useTranslation } from 'react-i18next';
import { PagePlaceholder } from '@/shared/ui/page-placeholder';

interface CategoryPageProps {
  categorySlug: string;
}

export function CategoryPage({ categorySlug }: CategoryPageProps) {
  const { t } = useTranslation();
  return <PagePlaceholder heading={categorySlug} lead={t('pages.category.lead')} />;
}
