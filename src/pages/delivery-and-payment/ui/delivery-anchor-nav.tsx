import { Link } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { SECTION_IDS, STEPPER_ID } from '../model/sections';
import { useSectionProgress } from '../model/use-section-progress';

export function DeliveryAnchorNav() {
  const { t } = useTranslation();
  const progress = useSectionProgress();
  return (
    <nav
      id={STEPPER_ID}
      aria-label={t('pages.deliveryAndPayment.nav.label')}
      className="sticky top-20 z-30 mb-10 border-b bg-background/95 backdrop-blur"
    >
      <ol className="mx-auto flex w-full max-w-7xl items-center px-4 py-3">
        {SECTION_IDS.map((section, index) => {
          const value = progress[index] ?? 0;
          const isDone = value >= 1;
          const isCurrent = value > 0 && !isDone;
          return (
            <li key={section} className={cn('flex items-center', index < SECTION_IDS.length - 1 && 'flex-1')}>
              <Link
                to="/delivery-and-payment"
                hash={section}
                hashScrollIntoView={{ behavior: 'smooth', block: 'start' }}
                aria-current={isCurrent ? 'step' : undefined}
                className="group flex min-h-11 items-center gap-2 rounded-full pr-1"
              >
                <span
                  className={cn(
                    'tabular-price flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all',
                    isDone && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-primary text-primary-foreground ring-4 ring-primary/20',
                    !isDone && !isCurrent && 'bg-card text-muted-foreground group-hover:border-primary',
                  )}
                >
                  {isDone ? <Check aria-hidden className="size-4" /> : index + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold transition-colors',
                    'sr-only sm:not-sr-only',
                    isCurrent || isDone ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
                  )}
                >
                  {t(`pages.deliveryAndPayment.nav.${section}`)}
                </span>
              </Link>
              {index < SECTION_IDS.length - 1 && (
                <span aria-hidden className="mx-2 h-0.5 min-w-3 flex-1 overflow-hidden rounded-full bg-border">
                  <span className="block h-full origin-left bg-primary" style={{ transform: `scaleX(${value})` }} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
