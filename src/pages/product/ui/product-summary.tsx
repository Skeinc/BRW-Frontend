import { Link } from '@tanstack/react-router';
import { Box, Palette, Phone, Ruler } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDimensions, PriceTag, StockBadge, type CatalogProductDetail } from '@/entities/product';
import { SITE_PHONE } from '@/shared/config';
import { formatPrice } from '@/shared/lib/format-price';
import { toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';

const INSTALLMENT_MONTHS = 24;
const CENTS = 100;

interface ProductSummaryProps {
  product: CatalogProductDetail;
}

interface SpecTile {
  key: string;
  icon: typeof Ruler;
  label: string;
  value: string;
}

export function ProductSummary({ product }: ProductSummaryProps) {
  const { t, i18n } = useTranslation();
  const { name, sku, price, oldPrice, discountPercent, stockStatus, collection, material, colorFacade } = product;
  const dimensions = formatDimensions(product, i18n.language);
  const monthly = (Math.round((Number(price) * CENTS) / INSTALLMENT_MONTHS) / CENTS).toFixed(2);
  const tiles: SpecTile[] = [
    dimensions && {
      key: 'dimensions',
      icon: Ruler,
      label: t('product.tiles.dimensions'),
      value: `${dimensions} ${t('product.cm')}`,
    },
    material && { key: 'material', icon: Box, label: t('product.tiles.material'), value: material },
    colorFacade && { key: 'facade', icon: Palette, label: t('product.tiles.facade'), value: colorFacade },
  ].filter((tile): tile is SpecTile => Boolean(tile));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <StockBadge status={stockStatus} />
        {sku && <span className="text-muted-foreground">{t('product.sku', { sku })}</span>}
      </div>
      <div>
        {collection && (
          <Link
            to="/collection/$collectionId"
            params={{ collectionId: collection.id }}
            className="text-xs font-semibold tracking-widest text-primary uppercase hover:underline"
          >
            {t('product.collection', { name: collection.name })}
          </Link>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{name}</h1>
      </div>
      <div className="rounded-xl bg-muted p-5">
        <PriceTag price={price} oldPrice={oldPrice} discountPercent={discountPercent} size="lg" />
        <p className="mt-2 text-sm text-muted-foreground">
          {t('product.installment', { monthly: formatPrice(monthly, i18n.language), months: INSTALLMENT_MONTHS })}
        </p>
      </div>
      {tiles.length > 0 && (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {tiles.map(({ key, icon: Icon, label, value }) => (
            <li key={key} className="flex flex-col gap-1 rounded-xl border bg-card p-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon aria-hidden className="size-3.5" />
                {label}
              </span>
              <span className="text-sm font-medium">{value}</span>
            </li>
          ))}
        </ul>
      )}
      <Button asChild className="h-12 text-base">
        <a href={toTelHref(SITE_PHONE)}>
          <Phone aria-hidden />
          {t('product.call')}
        </a>
      </Button>
      <p className="text-xs text-muted-foreground">{t('product.orderNote')}</p>
    </div>
  );
}
