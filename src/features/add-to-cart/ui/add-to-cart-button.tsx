import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { addToCart, useCartLines } from '@/entities/cart';
import type { StockStatus } from '@/entities/product';
import { SITE_CURRENCY } from '@/shared/config';
import { track } from '@/shared/lib/analytics/track';
import { Button } from '@/shared/ui/button';
import { DisabledWithTooltip } from '@/shared/ui/disabled-with-tooltip';
import { QtyStepper } from './qty-stepper';

interface AddToCartButtonProps {
  productId: string;
  stockStatus: StockStatus;
  name: string;
  /** API money string; reported with the add_to_cart event. */
  price: string;
  /** Icon-only button for product cards. */
  isCompact?: boolean;
  className?: string;
}

/** "В корзину" until the product is in the cart, then a stepper with the quantity. */
export function AddToCartButton({
  productId,
  stockStatus,
  name,
  price,
  isCompact = false,
  className,
}: AddToCartButtonProps) {
  const { t } = useTranslation();
  const qty = useCartLines().find((line) => line.productId === productId)?.qty ?? 0;
  const isUnavailable = stockStatus === 'out_of_stock';

  const handleAdd = (): void => {
    addToCart(productId);
    track('add_to_cart', {
      currency: SITE_CURRENCY,
      value: Number(price),
      items: [{ item_id: productId, item_name: name, price: Number(price), quantity: 1 }],
    });
  };

  if (qty > 0) {
    return <QtyStepper productId={productId} qty={qty} name={name} isRemovable isInCartLink className={className} />;
  }
  return (
    <DisabledWithTooltip reason={isUnavailable ? t('product.addToCart.unavailable') : undefined} className="flex">
      <Button
        type="button"
        size={isCompact ? 'icon' : 'default'}
        variant={isCompact ? 'outline' : 'default'}
        aria-label={isCompact ? t('product.addToCart.label') : undefined}
        className={className}
        disabled={isUnavailable}
        onClick={handleAdd}
      >
        <ShoppingCart aria-hidden />
        {!isCompact && t('product.addToCart.label')}
      </Button>
    </DisabledWithTooltip>
  );
}
