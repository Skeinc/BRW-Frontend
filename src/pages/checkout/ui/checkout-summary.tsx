import { Link } from '@tanstack/react-router';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLineTotal, type CartItem } from '@/entities/cart';
import { formatPrice } from '@/shared/lib/format-price';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import { OrderBenefits, OrderTotals } from '@/widgets/order-totals';

interface CheckoutSummaryProps {
  items: readonly CartItem[];
  count: number;
  subtotal: string;
  discount: string;
  total: string;
  isPending: boolean;
}

export function CheckoutSummary({ items, count, subtotal, discount, total, isPending }: CheckoutSummaryProps) {
  const { t, i18n } = useTranslation();
  return (
    <aside aria-label={t('checkout.summary')} className="rounded-2xl border bg-card p-5 lg:sticky lg:top-28">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{t('checkout.summary')}</h2>
        <Button asChild variant="ghost" size="sm" className="h-9 text-muted-foreground">
          <Link to="/cart">
            <Pencil aria-hidden />
            {t('checkout.editCart')}
          </Link>
        </Button>
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        {items.map(({ line, product }) => {
          if (!product) {
            return (
              <li key={line.productId} className="text-sm text-muted-foreground">
                {t('checkout.unavailableItem')}
              </li>
            );
          }
          const cover = product.images[0];
          const hasOldPrice = product.oldPrice !== null && product.discountPercent !== null;
          return (
            <li key={line.productId} className="flex gap-3">
              <Link
                to="/product/$productId"
                params={{ productId: product.id }}
                className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                {cover ? (
                  <img
                    src={cover.thumbUrl}
                    alt={cover.alt ?? product.name}
                    width={cover.width}
                    height={cover.height}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder kind="product" className="size-full" iconClassName="size-1/2" />
                )}
                <span className="tabular-price absolute right-0 bottom-0 rounded-tl-md bg-foreground px-1.5 text-xs font-semibold text-background">
                  ×{line.qty}
                </span>
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Link
                  to="/product/$productId"
                  params={{ productId: product.id }}
                  className="line-clamp-2 text-sm font-medium hover:text-primary"
                >
                  {product.name}
                </Link>
                {product.sku && (
                  <span className="text-xs text-muted-foreground">{t('product.sku', { sku: product.sku })}</span>
                )}
                {line.qty > 1 && (
                  <span className="tabular-price text-xs text-muted-foreground">
                    {t('pages.cart.perUnit', { price: formatPrice(product.price, i18n.language) })}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="tabular-price text-sm font-bold">
                  {formatPrice(getLineTotal(product.price, line.qty), i18n.language)}
                </span>
                {product.oldPrice && hasOldPrice && (
                  <span className="tabular-price text-xs text-muted-foreground line-through">
                    {formatPrice(getLineTotal(product.oldPrice, line.qty), i18n.language)}
                  </span>
                )}
                {hasOldPrice && (
                  <Badge className="tabular-price bg-primary/10 text-primary">{`-${product.discountPercent}%`}</Badge>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 border-t pt-4">
        <OrderTotals count={count} subtotal={subtotal} discount={discount} total={total} isPending={isPending} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{t('pages.cart.checkoutNote')}</p>
      <div className="mt-4">
        <OrderBenefits />
      </div>
    </aside>
  );
}
