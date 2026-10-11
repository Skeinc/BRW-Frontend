import { useTranslation } from 'react-i18next';
import { PagePlaceholder } from '@/shared/ui/page-placeholder';

interface ProductPageProps {
  productSlug: string;
}

export function ProductPage({ productSlug }: ProductPageProps) {
  const { t } = useTranslation();
  return <PagePlaceholder heading={productSlug} lead={t('pages.product.lead')} />;
}
