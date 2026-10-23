import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';

interface ErrorStateProps {
  error: unknown;
  /** Called by the retry button; omit to show the message only. */
  onRetry?: () => void;
  isRetrying?: boolean;
}

/** Inline failure message for a query: localized text (offline-aware) with an optional retry button. */
export function ErrorState({ error, onRetry, isRetrying = false }: ErrorStateProps) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground sm:text-base">{getApiErrorMessage(error, t)}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry} disabled={isRetrying}>
          {t('error.retry')}
        </Button>
      ) : null}
    </div>
  );
}
