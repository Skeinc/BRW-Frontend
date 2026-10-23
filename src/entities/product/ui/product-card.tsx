import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/ui/badge';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import { formatPrice } from '@/shared/lib/format-price';
import { cn } from '@/shared/lib/utils';
import type { CatalogProductCard } from '../model/catalog-types';
import { StockBadge } from './stock-badge';

interface ProductCardProps {
  product: CatalogProductCard;
  /** Extra badge chosen by the section that shows the card. */
  highlight?: 'new' | 'hit';
  className?: string;
}

export function ProductCard({ product, highlight, className }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { slug, name, price, oldPrice, discountPercent, isHit, stockStatus, coverImage, category, collection } =
    product;
  const badges: ('new' | 'hit')[] = [];
  if (highlight) {
    badges.push(highlight);
  }
  if (isHit && highlight !== 'hit') {
    badges.push('hit');
  }
  const caption = [category.name, collection?.name].filter(Boolean).join(' · ');
  const isUnavailable = stockStatus === 'out_of_stock';
  return (
    <Link
      to="/product/$productSlug"
      params={{ productSlug: slug }}
      className={cn('group flex h-full flex-col overflow-hidden rounded-xl border bg-card', className)}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-muted">
        {coverImage ? (
          <img
            src={coverImage.thumbUrl}
            alt={coverImage.alt ?? name}
            width={coverImage.width}
            height={coverImage.height}
            loading="lazy"
            className={cn(
              'size-full object-cover transition-transform duration-300 group-hover:scale-105',
              isUnavailable && 'opacity-60',
            )}
          />
        ) : (
          <ImagePlaceholder kind="product" className="size-full" iconClassName="size-1/4" />
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
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
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate text-xs text-muted-foreground">{caption}</p>
        <p className="line-clamp-2 text-sm font-medium">{name}</p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2">
          <span className={cn('tabular-price font-bold', discountPercent !== null && 'text-primary')}>
            {formatPrice(price, i18n.language)}
          </span>
          {oldPrice !== null && discountPercent !== null && (
            <span className="tabular-price text-xs text-muted-foreground line-through">
              {formatPrice(oldPrice, i18n.language)}
            </span>
          )}
        </div>
        <StockBadge status={stockStatus} />
      </div>
    </Link>
  );
}
