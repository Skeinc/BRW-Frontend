import { Link } from '@tanstack/react-router';
import { Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MAX_LINE_QTY, setCartQty } from '@/entities/cart';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

interface QtyStepperProps {
  productId: string;
  qty: number;
  name: string;
  /** Decreasing from 1 removes the line; otherwise the minus stops at 1. */
  isRemovable?: boolean;
  /** Stretches the stepper over the container and turns the quantity into an "In cart: N" link to the cart. */
  isInCartLink?: boolean;
  className?: string;
}

export function QtyStepper({
  productId,
  qty,
  name,
  isRemovable = false,
  isInCartLink = false,
  className,
}: QtyStepperProps) {
  const { t } = useTranslation();
  return (
    <div
      role="group"
      aria-label={t('pages.cart.qtyFor', { name })}
      className={cn(isInCartLink ? 'flex w-full' : 'inline-flex', 'items-center gap-1', className)}
    >
      <Button
        type="button"
        variant="outline"
        className="size-11"
        aria-label={isRemovable && qty <= 1 ? t('pages.cart.remove') : t('pages.cart.decrease')}
        disabled={!isRemovable && qty <= 1}
        onClick={() => setCartQty(productId, qty - 1)}
      >
        <Minus aria-hidden />
      </Button>
      {isInCartLink ? (
        <Button asChild className="h-11 min-w-0 flex-1">
          <Link to="/cart">{t('product.addToCart.inCartCount', { count: qty })}</Link>
        </Button>
      ) : (
        <span aria-live="polite" className="tabular-price min-w-10 px-1 text-center font-medium">
          {qty}
        </span>
      )}
      <Button
        type="button"
        variant="outline"
        className="size-11"
        aria-label={t('pages.cart.increase')}
        disabled={qty >= MAX_LINE_QTY}
        onClick={() => setCartQty(productId, qty + 1)}
      >
        <Plus aria-hidden />
      </Button>
    </div>
  );
}
