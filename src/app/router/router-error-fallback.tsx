import type { ErrorComponentProps } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';

export function RouterErrorFallback({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const handleRetry = () => {
    reset();
    void router.invalidate();
  };
  return (
    <div role="alert" className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <p className="text-muted-foreground">{getApiErrorMessage(error, t)}</p>
      <Button onClick={handleRetry}>{t('error.retry')}</Button>
    </div>
  );
}
