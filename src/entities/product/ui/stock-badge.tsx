import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import type { StockStatus } from '../model/types';

interface StockBadgeProps {
  status: StockStatus;
}

const DOT_CLASSES: Record<StockStatus, string> = {
  in_stock: 'bg-emerald-500',
  on_order: 'bg-amber-500',
  out_of_stock: 'bg-muted-foreground/60',
};

const TEXT_CLASSES: Record<StockStatus, string> = {
  in_stock: 'text-emerald-700 dark:text-emerald-400',
  on_order: 'text-amber-700 dark:text-amber-400',
  out_of_stock: 'text-muted-foreground',
};

export function StockBadge({ status }: StockBadgeProps) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', TEXT_CLASSES[status])}>
      <span aria-hidden className={cn('size-1.5 rounded-full', DOT_CLASSES[status])} />
      {t(`catalog.stock.${status}`)}
    </span>
  );
}
