import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui/callout';

export function InstallmentNotice() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:pb-16">
      <Callout icon={Info} title={t('pages.installment.notice.title')}>
        <p>{t('pages.installment.notice.text')}</p>
      </Callout>
    </section>
  );
}
