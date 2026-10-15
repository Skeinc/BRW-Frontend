import { Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Callout } from '@/shared/ui/callout';
import { PageSection } from '@/shared/ui/page-section';

export function ReturnsNotice() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.returns';
  return (
    <PageSection id="returns" heading={t(`${base}.heading`)}>
      <Callout icon={Ban} tone="warning" title={t(`${base}.title`)}>
        <p>{t(`${base}.text`)}</p>
        <p className="text-sm">{t(`${base}.law`)}</p>
      </Callout>
    </PageSection>
  );
}
