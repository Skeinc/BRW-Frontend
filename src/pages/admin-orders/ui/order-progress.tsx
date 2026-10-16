import { Check, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { OrderStatus } from '@/entities/order';
import { cn } from '@/shared/lib/utils';

const STEPS: readonly OrderStatus[] = ['new', 'in_progress', 'done'];

interface OrderProgressProps {
  status: OrderStatus;
}

/** Where the order is on its way: new, in progress, done. A cancelled order shows a red banner instead. */
export function OrderProgress({ status }: OrderProgressProps) {
  const { t } = useTranslation();
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-800">
        <XCircle className="size-5 shrink-0" aria-hidden />
        <p className="text-sm font-medium">{t('admin.orders.cancelledBanner')}</p>
      </div>
    );
  }
  const currentIndex = STEPS.indexOf(status);
  return (
    <ol className="flex items-center" aria-label={t('admin.orders.sheet.progress')}>
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex || status === 'done';
        const isCurrent = index === currentIndex && status !== 'done';
        return (
          <li
            key={step}
            className={cn('flex items-center', index < STEPS.length - 1 && 'flex-1')}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold',
                  isDone && 'border-emerald-600 bg-emerald-600 text-white',
                  isCurrent && 'border-primary bg-primary/10 text-primary',
                  !isDone && !isCurrent && 'border-border text-muted-foreground',
                )}
              >
                {isDone ? <Check className="size-4" aria-hidden /> : index + 1}
              </span>
              <span
                className={cn(
                  'text-xs whitespace-nowrap',
                  isCurrent || isDone ? 'font-medium' : 'text-muted-foreground',
                )}
              >
                {t(`admin.orders.statuses.${step}`)}
              </span>
            </span>
            {index < STEPS.length - 1 ? (
              <span
                className={cn(
                  'mx-2 mb-5 h-0.5 flex-1 rounded-full',
                  index < currentIndex || status === 'done' ? 'bg-emerald-600' : 'bg-border',
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
