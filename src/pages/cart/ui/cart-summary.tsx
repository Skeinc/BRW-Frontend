import { Link } from '@tanstack/react-router';
import { ArrowRight, LayoutGrid, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { OrderBenefits, OrderTotals } from '@/widgets/order-totals';

interface CartSummaryProps {
  count: number;
  subtotal: string;
  discount: string;
  total: string;
  isPending: boolean;
  hasPayableItems: boolean;
  onClear: () => void;
}

export function CartSummary({
  count,
  subtotal,
  discount,
  total,
  isPending,
  hasPayableItems,
  onClear,
}: CartSummaryProps) {
  const { t } = useTranslation();
  return (
    <aside aria-label={t('pages.cart.summary')} className="rounded-2xl border bg-card p-5 lg:sticky lg:top-39">
      <h2 className="text-xl font-bold">{t('pages.cart.summary')}</h2>
      <div className="mt-4">
        <OrderTotals count={count} subtotal={subtotal} discount={discount} total={total} isPending={isPending} />
      </div>
      {isPending || !hasPayableItems ? (
        <Button className="mt-4 h-12 w-full text-base" disabled>
          {t('pages.cart.checkout')}
          <ArrowRight aria-hidden />
        </Button>
      ) : (
        <Button asChild className="mt-4 h-12 w-full text-base">
          <Link to="/checkout">
            {t('pages.cart.checkout')}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      )}
      <p className="mt-3 text-xs text-muted-foreground">{t('pages.cart.checkoutNote')}</p>
      <div className="mt-4">
        <OrderBenefits />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4">
        <Button asChild variant="outline" className="h-11">
          <Link to="/catalog">
            <LayoutGrid aria-hidden />
            {t('pages.cart.continueShort')}
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onClear}
        >
          <Trash2 aria-hidden />
          {t('pages.cart.clearShort')}
        </Button>
      </div>
    </aside>
  );
}
