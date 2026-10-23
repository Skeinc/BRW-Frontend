import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useCartItems } from '@/entities/cart';
import { PlaceOrderForm } from '@/features/place-order';
import { CheckoutSummary } from './checkout-summary';
import { SITE_CURRENCY } from '@/shared/config';
import { track } from '@/shared/lib/analytics/track';
import { PageBreadcrumbs } from '@/shared/ui/page-breadcrumbs';
import { Skeleton } from '@/shared/ui/skeleton';

const subscribeNoop = (): (() => void) => () => {};

/** The cart lives in localStorage, so the server cannot render it; wait for hydration before judging it empty. */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isHydrated = useIsHydrated();
  const { items, count, subtotal, discount, total, isPending } = useCartItems();
  const [isPlaced, setIsPlaced] = useState(false);
  const isEmpty = isHydrated && items.length === 0 && !isPlaced;

  useEffect(() => {
    if (isEmpty) {
      void navigate({ to: '/cart', replace: true });
    }
  }, [isEmpty, navigate]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <PageBreadcrumbs current={t('checkout.title')} />
      <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">{t('checkout.title')}</h1>
      {!isHydrated || isEmpty ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div className="max-w-2xl">
            <PlaceOrderForm
              lines={items.filter((item) => !item.isUnavailable).map((item) => item.line)}
              onPlaced={(orderNumber) => {
                setIsPlaced(true);
                track('order_submitted', {
                  order_number: orderNumber,
                  currency: SITE_CURRENCY,
                  value: Number(total),
                  items_count: count,
                });
              }}
            />
          </div>
          <CheckoutSummary
            items={items}
            count={count}
            subtotal={subtotal}
            discount={discount}
            total={total}
            isPending={isPending}
          />
        </div>
      )}
    </section>
  );
}
