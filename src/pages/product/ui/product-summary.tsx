import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PriceTag, StockBadge, type CatalogProductDetail } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';

interface ProductSummaryProps {
  product: CatalogProductDetail;
}

export function ProductSummary({ product }: ProductSummaryProps) {
  const { t } = useTranslation();
  const { id, name, sku, price, oldPrice, discountPercent, stockStatus, collection } = product;
  return (
    <div className="flex flex-col gap-4">
      {collection && (
        <Link
          to="/collection/$collectionId"
          params={{ collectionId: collection.id }}
          className="text-sm font-semibold tracking-wide text-primary uppercase hover:underline"
        >
          {collection.name}
        </Link>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        {sku && <span className="text-muted-foreground">{t('product.code', { sku })}</span>}
        <StockBadge status={stockStatus} />
      </div>
      <PriceTag price={price} oldPrice={oldPrice} discountPercent={discountPercent} size="lg" />
      <AddToCartButton
        productId={id}
        stockStatus={stockStatus}
        name={name}
        price={price}
        className="h-12 w-full text-base"
      />
      <p className="text-xs text-muted-foreground">{t('product.orderNote')}</p>
    </div>
  );
}
