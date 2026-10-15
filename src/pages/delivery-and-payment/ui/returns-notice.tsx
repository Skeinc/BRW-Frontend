import { Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DeliveryCallout } from './delivery-callout';
import { DeliverySection } from './delivery-section';

export function ReturnsNotice() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.returns';
  return (
    <DeliverySection id="returns" heading={t(`${base}.heading`)}>
      <DeliveryCallout icon={Ban} tone="warning" title={t(`${base}.title`)}>
        <p>{t(`${base}.text`)}</p>
        <p className="text-sm">{t(`${base}.law`)}</p>
      </DeliveryCallout>
    </DeliverySection>
  );
}
