import { useTranslation } from 'react-i18next';
import type { InstallmentPageLoan } from '@/entities/installment-page';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Badge } from '@/shared/ui/badge';

interface InstallmentLoanCardProps {
  loan: InstallmentPageLoan;
}

export function InstallmentLoanCard({ loan }: InstallmentLoanCardProps) {
  const { t } = useTranslation();
  const base = 'pages.installment.loans';
  const hasAccordion = loan.details.length > 0 || loan.steps.length > 0;
  return (
    <li className="flex flex-col rounded-xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{loan.bank}</p>
      <h3 className="mt-1 text-lg font-semibold">{loan.name}</h3>
      {loan.badges.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {loan.badges.map((badge, index) => (
            <li key={index}>
              <Badge variant="secondary">{badge}</Badge>
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-5 grid gap-4 border-t pt-4">
        <div>
          <dt className="text-sm text-muted-foreground">{t(`${base}.termLabel`)}</dt>
          <dd className="tabular-price mt-0.5 text-2xl font-bold text-primary">{loan.term}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{t(`${base}.rateLabel`)}</dt>
          <dd className="tabular-price mt-0.5 font-semibold">{loan.rate}</dd>
        </div>
        {loan.facts.map((fact, index) => (
          <div key={index}>
            <dt className="text-sm text-muted-foreground">{fact.label}</dt>
            <dd className="mt-0.5 text-sm">{fact.value}</dd>
          </div>
        ))}
      </dl>
      {hasAccordion && (
        <Accordion type="single" collapsible className="mt-4 border-t">
          {loan.details.length > 0 && (
            <AccordionItem value="details">
              <AccordionTrigger className="min-h-11 text-base">{t(`${base}.detailsTitle`)}</AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-3 text-sm">
                  {loan.details.map((detail, index) => (
                    <div key={index}>
                      <dt className="font-semibold">{detail.label}</dt>
                      <dd className="mt-0.5 text-muted-foreground">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          )}
          {loan.steps.length > 0 && (
            <AccordionItem value="steps">
              <AccordionTrigger className="min-h-11 text-base">{t(`${base}.stepsTitle`)}</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  {loan.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </li>
  );
}
