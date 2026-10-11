import type { ErrorComponentProps } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';

export function RouterErrorFallback({ reset }: ErrorComponentProps) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">{t('error.title')}</h1>
      <Button onClick={reset}>{t('error.retry')}</Button>
    </div>
  );
}
