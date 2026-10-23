import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CatalogProductCard } from '@/entities/product';
import { formatPrice } from '@/shared/lib/format-price';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface HeroFeaturedCardProps {
  product: CatalogProductCard;
}

export function HeroFeaturedCard({ product }: HeroFeaturedCardProps) {
  const { t, i18n } = useTranslation();
  const { id, name, price, oldPrice, discountPercent, coverImage } = product;
  return (
    <Link
      to="/product/$productId"
      params={{ productId: id }}
      className="absolute right-3 bottom-3 left-3 flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm sm:right-auto sm:max-w-sm"
    >
      <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        {coverImage ? (
          <img
            src={coverImage.thumbUrl}
            alt=""
            width={coverImage.width}
            height={coverImage.height}
            className="size-full object-cover"
          />
        ) : (
          <ImagePlaceholder kind="product" className="size-full" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="tabular-price font-bold">{formatPrice(price, i18n.language)}</span>
          {oldPrice !== null && discountPercent !== null && (
            <span className="tabular-price text-xs text-muted-foreground line-through">
              {formatPrice(oldPrice, i18n.language)}
            </span>
          )}
        </p>
      </div>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ArrowRight aria-hidden className="size-4" />
        <span className="sr-only">{t('pages.home.hero.openProduct')}</span>
      </span>
    </Link>
  );
}
