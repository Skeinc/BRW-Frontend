import { useTranslation } from 'react-i18next';
import { PageSection } from '@/shared/ui/page-section';

const STEPS = ['choose', 'document', 'bank', 'receive'] as const;

export function InstallmentSteps() {
  const { t } = useTranslation();
  const base = 'pages.installment.steps';
  return (
    <PageSection id="how" heading={t(`${base}.heading`)} lead={t(`${base}.lead`)}>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step} className="rounded-xl border bg-card p-6">
            <span className="tabular-price flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{t(`${base}.items.${step}.title`)}</h3>
            <p className="mt-2 text-muted-foreground">{t(`${base}.items.${step}.text`)}</p>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
