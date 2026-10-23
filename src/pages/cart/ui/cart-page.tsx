import { Link } from '@tanstack/react-router';
import { useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { clearCart, useCartCount, useCartItems } from '@/entities/cart';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { PageBreadcrumbs } from '@/shared/ui/page-breadcrumbs';
import { CartEmpty } from './cart-empty';
import { CartLine } from './cart-line';
import { CartSummary } from './cart-summary';

const subscribeNoop = (): (() => void) => () => {};

/** The cart lives in localStorage, so the server cannot render it; wait for hydration to avoid an empty-cart flash. */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function CartPage() {
  const { t } = useTranslation();
  const count = useCartCount();
  const { items, total, isPending } = useCartItems();
  const [isClearOpen, setIsClearOpen] = useState(false);
  const isHydrated = useIsHydrated();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 pb-40 md:py-8 lg:pb-8">
      <PageBreadcrumbs current={t('nav.cart')} />
      {!isHydrated ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : items.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-4xl">{t('pages.cart.title')}</h1>
          <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <CartLine key={item.line.productId} item={item} />
              ))}
            </ul>
            <CartSummary
              count={count}
              total={total}
              isPending={isPending}
              hasPayableItems={items.some((item) => item.product)}
              onClear={() => setIsClearOpen(true)}
            />
          </div>
          <MobileActions onClear={() => setIsClearOpen(true)} />
          <ConfirmDialog
            open={isClearOpen}
            onOpenChange={setIsClearOpen}
            title={t('pages.cart.clearTitle')}
            description={t('pages.cart.clearDescription')}
            confirmLabel={t('pages.cart.clear')}
            cancelLabel={t('pages.cart.cancel')}
            onConfirm={() => {
              clearCart();
              setIsClearOpen(false);
            }}
          />
        </>
      )}
    </section>
  );
}

function MobileActions({ onClear }: { onClear: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="mt-4 flex gap-3 lg:hidden">
      <Button asChild variant="outline" className="h-11 flex-1">
        <Link to="/catalog">{t('pages.cart.continue')}</Link>
      </Button>
      <Button type="button" variant="outline" className="h-11 flex-1" onClick={onClear}>
        {t('pages.cart.clear')}
      </Button>
    </div>
  );
}
