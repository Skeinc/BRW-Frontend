import { CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/shared/lib/format-price';

const BENEFITS = [
  { key: 'delivery', icon: Truck },
  { key: 'warranty', icon: ShieldCheck },
  { key: 'installment', icon: CreditCard },
] as const;

interface OrderTotalsProps {
  count: number;
  /** Money strings: `subtotal` at the old prices, `discount` is what the old prices add, `total` is payable. */
  subtotal: string;
  discount: string;
  total: string;
  isPending: boolean;
}

/** Subtotal, discount, delivery and total of the cart; shared by the cart and the checkout summaries. */
export function OrderTotals({ count, subtotal, discount, total, isPending }: OrderTotalsProps) {
  const { t, i18n } = useTranslation();
  const hasDiscount = Number(discount) > 0;
  const money = (value: string): string => (isPending ? '…' : formatPrice(value, i18n.language));
  return (
    <>
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">{t('pages.cart.goods', { count })}</dt>
          <dd className="tabular-price font-medium">{money(subtotal)}</dd>
        </div>
        {hasDiscount && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">{t('pages.cart.discount')}</dt>
            <dd className="tabular-price font-medium text-destructive">{isPending ? '…' : `−${money(discount)}`}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">{t('pages.cart.delivery')}</dt>
          <dd className="text-right font-medium">{t('pages.cart.deliveryLater')}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-baseline justify-between gap-3 border-t pt-4">
        <span className="text-lg font-bold">{t('pages.cart.total')}</span>
        <span className="tabular-price text-2xl font-bold">{money(total)}</span>
      </div>
    </>
  );
}

export function OrderBenefits() {
  const { t } = useTranslation();
  return (
    <ul className="flex flex-col gap-2.5 border-t pt-4 text-sm">
      {BENEFITS.map(({ key, icon: Icon }) => (
        <li key={key} className="flex items-center gap-2.5 text-muted-foreground">
          <Icon aria-hidden className="size-4 shrink-0 text-primary" />
          {t(`product.benefits.${key}.title`)}
        </li>
      ))}
    </ul>
  );
}
