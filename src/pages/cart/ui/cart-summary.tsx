import { Link } from '@tanstack/react-router';
import { LayoutGrid, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_PHONE } from '@/shared/config';
import { formatPrice } from '@/shared/lib/format-price';
import { toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';

interface CartSummaryProps {
  count: number;
  total: string;
  isPending: boolean;
  hasPayableItems: boolean;
  onClear: () => void;
}

export function CartSummary({ count, total, isPending, hasPayableItems, onClear }: CartSummaryProps) {
  const { t, i18n } = useTranslation();
  return (
    <aside
      aria-label={t('pages.cart.summary')}
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-card p-4 shadow-lg lg:sticky lg:top-28 lg:rounded-xl lg:border lg:shadow-none"
    >
      <dl className="flex items-baseline justify-between gap-3">
        <dt className="text-sm text-muted-foreground">{t('pages.cart.itemsCount', { count })}</dt>
        <dd className="tabular-price text-xl font-bold">{isPending ? '…' : formatPrice(total, i18n.language)}</dd>
      </dl>
      <Button className="mt-3 h-12 w-full text-base" disabled={isPending || !hasPayableItems}>
        {t('pages.cart.checkout')}
      </Button>
      <p className="mt-2 hidden text-xs text-muted-foreground lg:block">{t('pages.cart.checkoutNote')}</p>
      <div className="mt-3 hidden flex-col gap-1 lg:flex">
        <Button asChild variant="ghost" className="h-11 justify-start">
          <Link to="/catalog">
            <LayoutGrid aria-hidden />
            {t('pages.cart.continue')}
          </Link>
        </Button>
        <Button asChild variant="ghost" className="h-11 justify-start">
          <a href={toTelHref(SITE_PHONE)}>
            <Phone aria-hidden />
            {t('pages.cart.call')}
          </a>
        </Button>
        <Button type="button" variant="ghost" className="h-11 justify-start" onClick={onClear}>
          {t('pages.cart.clear')}
        </Button>
      </div>
    </aside>
  );
}
