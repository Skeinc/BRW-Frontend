import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/ui/badge';
import { formatPrice } from '@/shared/lib/format-price';
import { cn } from '@/shared/lib/utils';

interface PriceTagProps {
  price: string;
  oldPrice: string | null;
  discountPercent: number | null;
  /** `lg` is the price block of the product page; `md` is the card. */
  size?: 'md' | 'lg';
  className?: string;
}

export function PriceTag({ price, oldPrice, discountPercent, size = 'md', className }: PriceTagProps) {
  const { i18n } = useTranslation();
  const hasDiscount = oldPrice !== null && discountPercent !== null;
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span
        className={cn(
          'tabular-price font-bold',
          size === 'lg' && 'text-3xl',
          hasDiscount && size === 'md' && 'text-primary',
        )}
      >
        {formatPrice(price, i18n.language)}
      </span>
      {hasDiscount && (
        <span
          className={cn('tabular-price text-muted-foreground line-through', size === 'md' ? 'text-xs' : 'text-base')}
        >
          {formatPrice(oldPrice, i18n.language)}
        </span>
      )}
      {hasDiscount && size === 'lg' && (
        <Badge className="tabular-price bg-primary text-primary-foreground">{`-${discountPercent}%`}</Badge>
      )}
    </div>
  );
}
