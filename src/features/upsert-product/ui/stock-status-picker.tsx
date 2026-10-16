import { CheckCircle2, Clock, XCircle, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { STOCK_STATUSES, type StockStatus } from '@/entities/product';
import { cn } from '@/shared/lib/utils';

const ICONS: Record<StockStatus, LucideIcon> = { in_stock: CheckCircle2, on_order: Clock, out_of_stock: XCircle };
const ACTIVE_CLASSES: Record<StockStatus, string> = {
  in_stock: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  on_order: 'border-amber-300 bg-amber-50 text-amber-800',
  out_of_stock: 'border-red-300 bg-red-50 text-red-800',
};

interface StockStatusPickerProps {
  value: StockStatus;
  onChange: (value: StockStatus) => void;
}

/** Availability as three clear choices instead of a drop-down. */
export function StockStatusPicker({ value, onChange }: StockStatusPickerProps) {
  const { t } = useTranslation();
  return (
    <div role="radiogroup" aria-label={t('admin.products.fields.stockStatus')} className="grid gap-2 sm:grid-cols-3">
      {STOCK_STATUSES.map((status) => {
        const Icon = ICONS[status];
        const isSelected = status === value;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted',
              isSelected && ACTIVE_CLASSES[status],
              isSelected && 'hover:bg-inherit',
            )}
            onClick={() => onChange(status)}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {t(`admin.products.stock.${status}`)}
          </button>
        );
      })}
    </div>
  );
}
