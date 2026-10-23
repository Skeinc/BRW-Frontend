import { Link } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLineTotal, removeFromCart, type CartItem } from '@/entities/cart';
import { StockBadge } from '@/entities/product';
import { QtyStepper } from '@/features/add-to-cart';
import { formatPrice } from '@/shared/lib/format-price';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import { Skeleton } from '@/shared/ui/skeleton';

export function CartLine({ item }: { item: CartItem }) {
  const { t, i18n } = useTranslation();
  const { line, product, isPending, isUnavailable } = item;
  if (isPending && !product) {
    return (
      <li>
        <Skeleton className="h-36 w-full rounded-xl" />
      </li>
    );
  }
  if (!product) {
    return (
      <li className="flex items-center justify-between gap-3 rounded-xl border border-dashed bg-card p-4">
        <p className="text-sm text-muted-foreground">
          {isUnavailable ? t('pages.cart.unavailable') : t('pages.cart.loadError')}
        </p>
        <Button type="button" variant="outline" className="h-11" onClick={() => removeFromCart(line.productId)}>
          <Trash2 aria-hidden />
          {t('pages.cart.remove')}
        </Button>
      </li>
    );
  }
  const { id, name, sku, price, oldPrice, discountPercent, stockStatus, images } = product;
  const cover = images[0];
  return (
    <li className="flex gap-3 rounded-xl border bg-card p-3 sm:gap-4 sm:p-4">
      <Link
        to="/product/$productId"
        params={{ productId: id }}
        className="size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-32"
      >
        {cover ? (
          <img
            src={cover.thumbUrl}
            alt={cover.alt ?? name}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <ImagePlaceholder kind="product" className="size-full" iconClassName="size-1/3" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to="/product/$productId"
              params={{ productId: id }}
              className="line-clamp-2 font-medium hover:text-primary"
            >
              {name}
            </Link>
            {sku && <p className="mt-0.5 text-xs text-muted-foreground">{t('product.sku', { sku })}</p>}
          </div>
          <Button
            type="button"
            variant="ghost"
            className="-mt-1 -mr-1 size-11 shrink-0"
            aria-label={t('pages.cart.removeItem', { name })}
            onClick={() => removeFromCart(id)}
          >
            <Trash2 aria-hidden />
          </Button>
        </div>
        <StockBadge status={stockStatus} />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <QtyStepper productId={id} qty={line.qty} name={name} />
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex flex-wrap items-baseline justify-end gap-x-2">
              <span className="tabular-price font-bold">
                {formatPrice(getLineTotal(price, line.qty), i18n.language)}
              </span>
              {oldPrice && discountPercent !== null && (
                <span className="tabular-price text-sm text-muted-foreground line-through">
                  {formatPrice(getLineTotal(oldPrice, line.qty), i18n.language)}
                </span>
              )}
            </div>
            {oldPrice && discountPercent !== null && (
              <Badge className="tabular-price bg-primary/10 text-primary">{`-${discountPercent}%`}</Badge>
            )}
            {line.qty > 1 && (
              <span className="tabular-price text-xs text-muted-foreground">
                {t('pages.cart.perUnit', { price: formatPrice(price, i18n.language) })}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
