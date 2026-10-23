import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AnalyticsCatalogHealth } from '@/entities/analytics';
import type { ProductIssue } from '@/entities/product';
import { cn } from '@/shared/lib/utils';
import { AnalyticsCard } from './analytics-card';

type HealthTile = {
  key: keyof AnalyticsCatalogHealth;
  /** Filter of the product list that shows these products. */
  search: { issue: ProductIssue } | { published: 'no' };
  isWarning: boolean;
};

const HEALTH_TILES: readonly HealthTile[] = [
  { key: 'outOfStock', search: { issue: 'out_of_stock' }, isWarning: true },
  { key: 'withoutPhoto', search: { issue: 'no_photo' }, isWarning: true },
  { key: 'hidden', search: { published: 'no' }, isWarning: false },
  { key: 'withoutCollection', search: { issue: 'no_collection' }, isWarning: false },
  { key: 'notOrdered', search: { issue: 'not_ordered' }, isWarning: false },
];

interface CatalogHealthProps {
  health: AnalyticsCatalogHealth;
}

export function CatalogHealth({ health }: CatalogHealthProps) {
  const { t, i18n } = useTranslation();
  const formatter = new Intl.NumberFormat(i18n.language);
  return (
    <AnalyticsCard title={t('admin.analytics.health.title')} description={t('admin.analytics.health.description')}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {HEALTH_TILES.map((tile) => (
          <Link
            key={tile.key}
            to="/admin/products"
            search={tile.search}
            className="group flex min-h-11 flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-primary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span
              className={cn(
                'text-2xl font-extrabold tracking-tight tabular-nums',
                tile.isWarning && health[tile.key] > 0 && 'text-destructive',
              )}
            >
              {formatter.format(health[tile.key])}
            </span>
            <span className="text-sm text-muted-foreground">{t(`admin.analytics.health.${tile.key}`)}</span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent-foreground">
              {t('admin.analytics.health.open')}
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </AnalyticsCard>
  );
}
