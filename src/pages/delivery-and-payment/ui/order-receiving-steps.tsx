import { FileWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DeliveryCallout } from './delivery-callout';
import { DeliverySection } from './delivery-section';

const STEPS = ['count', 'integrity', 'completeness', 'report'] as const;

export function OrderReceivingSteps() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.receiving';
  return (
    <DeliverySection id="receiving" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step} className="rounded-xl border bg-card p-6">
            <span className="tabular-price flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{t(`${base}.steps.${step}.title`)}</h3>
            <p className="mt-2 text-muted-foreground">{t(`${base}.steps.${step}.text`)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-4">
        <DeliveryCallout icon={FileWarning} title={t(`${base}.claim.title`)}>
          <p>{t(`${base}.claim.text`)}</p>
          <p>{t(`${base}.claim.assembled`)}</p>
        </DeliveryCallout>
      </div>
    </DeliverySection>
  );
}
