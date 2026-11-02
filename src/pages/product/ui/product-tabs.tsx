import { useTranslation } from 'react-i18next';
import type { CatalogProductDetail } from '@/entities/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { getProductSpecRows } from './get-product-spec-rows';
import { ProductDescription } from './product-description';
import { ProductSpecs } from './product-specs';

interface ProductTabsProps {
  product: CatalogProductDetail;
}

/** Specifications and description in two tabs; a tab without content is not shown. */
export function ProductTabs({ product }: ProductTabsProps) {
  const { t, i18n } = useTranslation();
  const rows = getProductSpecRows(product, t, i18n.language);
  const { description } = product;
  if (rows.length === 0 && !description) {
    return null;
  }
  return (
    <Tabs defaultValue={rows.length > 0 ? 'specs' : 'description'} className="max-w-3xl">
      <TabsList>
        {rows.length > 0 && <TabsTrigger value="specs">{t('product.tabs.specs')}</TabsTrigger>}
        {description && <TabsTrigger value="description">{t('product.tabs.description')}</TabsTrigger>}
      </TabsList>
      {rows.length > 0 && (
        <TabsContent value="specs" className="mt-2">
          <ProductSpecs rows={rows} />
        </TabsContent>
      )}
      {description && (
        <TabsContent value="description" className="mt-2">
          <ProductDescription text={description} />
        </TabsContent>
      )}
    </Tabs>
  );
}
