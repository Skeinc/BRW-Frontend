import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/ui/badge';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import { cn } from '@/shared/lib/utils';
import { formatCm } from '../lib/format-dimensions';
import type { CatalogProductCard } from '../model/catalog-types';
import { PriceTag } from './price-tag';
import { StockBadge } from './stock-badge';

interface ProductCardProps {
  product: CatalogProductCard;
  /** Extra badge chosen by the section that shows the card. */
  highlight?: 'new' | 'hit';
  /** Action beside the price, e.g. an add-to-cart button; kept outside the link so it stays valid HTML. */
  footer?: ReactNode;
  className?: string;
}

export function ProductCard({ product, highlight, footer, className }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { id, name, price, oldPrice, discountPercent, isHit, stockStatus, coverImage, collection } = product;
  const badges: ('new' | 'hit')[] = [];
  if (highlight) {
    badges.push(highlight);
  }
  if (isHit && highlight !== 'hit') {
    badges.push('hit');
  }
  const sizes = [product.widthMm ?? product.lengthMm, product.heightMm, product.depthMm]
    .map((mm) => formatCm(mm, i18n.language))
    .filter((value): value is string => value !== null)
    .join('/');
  const isUnavailable = stockStatus === 'out_of_stock';
  return (
    <div className={cn('flex h-full flex-col overflow-hidden rounded-lg border bg-card', className)}>
      <Link to="/product/$productId" params={{ productId: id }} className="group flex flex-1 flex-col">
        <div className="relative aspect-4/3 overflow-hidden bg-background">
          {coverImage ? (
            <img
              src={coverImage.thumbUrl}
              alt={coverImage.alt ?? name}
              width={coverImage.width}
              height={coverImage.height}
              loading="lazy"
              className={cn(
                'size-full object-contain p-4 transition-transform duration-300 group-hover:scale-105',
                isUnavailable && 'opacity-60',
              )}
            />
          ) : (
            <ImagePlaceholder kind="product" className="size-full" iconClassName="size-1/4" />
          )}
          <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {badges.map((badge) => (
                <Badge key={badge} className={badge === 'new' ? 'bg-foreground text-background' : undefined}>
                  {t(`catalog.badge.${badge}`)}
                </Badge>
              ))}
            </div>
            {discountPercent !== null && (
              <Badge className="tabular-price bg-primary/10 text-primary">{`-${discountPercent}%`}</Badge>
            )}
          </div>
        </div>
        <div className="min-h-19 shrink-0 bg-muted px-3 py-2 sm:min-h-14">
          <p className="line-clamp-3 text-sm font-medium sm:line-clamp-2">{name}</p>
        </div>
        <dl className="flex flex-col gap-1 px-3 pt-3 text-xs text-muted-foreground">
          <div className="flex justify-between gap-3">
            <dt>{t('catalog.card.sizes')}</dt>
            <dd className="tabular-price text-foreground">{sizes || '—'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{t('catalog.card.collection')}</dt>
            <dd className="truncate text-foreground">{collection?.name ?? '—'}</dd>
          </div>
          {stockStatus !== 'in_stock' && <StockBadge status={stockStatus} />}
        </dl>
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-2 px-3 pt-2 pb-3">
        <Link
          to="/product/$productId"
          params={{ productId: id }}
          tabIndex={-1}
          aria-hidden
          className="min-w-0 whitespace-nowrap"
        >
          <PriceTag
            price={price}
            oldPrice={oldPrice}
            discountPercent={discountPercent}
            className="flex-col-reverse items-start gap-y-0 text-sm sm:text-base [&>span:first-child]:flex [&>span:first-child]:min-h-9 [&>span:first-child]:items-center max-md:[&>span:first-child]:min-h-11"
          />
        </Link>
        {footer}
      </div>
    </div>
  );
}
