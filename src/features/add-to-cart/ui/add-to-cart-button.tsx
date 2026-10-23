import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { addToCart, useCartLines } from '@/entities/cart';
import type { StockStatus } from '@/entities/product';
import { Button } from '@/shared/ui/button';
import { DisabledWithTooltip } from '@/shared/ui/disabled-with-tooltip';
import { QtyStepper } from './qty-stepper';

interface AddToCartButtonProps {
  productId: string;
  stockStatus: StockStatus;
  name: string;
  className?: string;
}

/** "В корзину" until the product is in the cart, then a stepper with the quantity. */
export function AddToCartButton({ productId, stockStatus, name, className }: AddToCartButtonProps) {
  const { t } = useTranslation();
  const qty = useCartLines().find((line) => line.productId === productId)?.qty ?? 0;
  const isUnavailable = stockStatus === 'out_of_stock';

  if (qty > 0) {
    return <QtyStepper productId={productId} qty={qty} name={name} isRemovable isInCartLink className={className} />;
  }
  return (
    <DisabledWithTooltip reason={isUnavailable ? t('product.addToCart.unavailable') : undefined} className="flex">
      <Button type="button" className={className} disabled={isUnavailable} onClick={() => addToCart(productId)}>
        <ShoppingCart aria-hidden />
        {t('product.addToCart.label')}
      </Button>
    </DisabledWithTooltip>
  );
}
