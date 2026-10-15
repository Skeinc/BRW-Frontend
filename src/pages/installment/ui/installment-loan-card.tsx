import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Badge } from '@/shared/ui/badge';
import type { LoanOffer } from '../model/offers';

interface InstallmentLoanCardProps {
  offer: LoanOffer;
}

export function InstallmentLoanCard({ offer }: InstallmentLoanCardProps) {
  const { t } = useTranslation();
  const base = 'pages.installment.loans';
  const item = `${base}.items.${offer.id}`;
  const hasAccordion = offer.details.length > 0 || offer.stepCount > 0;
  return (
    <li className="flex flex-col rounded-xl border bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t(`${item}.bank`)}</p>
      <h3 className="mt-1 text-lg font-semibold">{t(`${item}.name`)}</h3>
      {offer.badges.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {offer.badges.map((badge) => (
            <li key={badge}>
              <Badge variant="secondary">{t(`${base}.badges.${badge}`)}</Badge>
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-5 grid gap-4 border-t pt-4">
        <div>
          <dt className="text-sm text-muted-foreground">{t(`${base}.termLabel`)}</dt>
          <dd className="tabular-price mt-0.5 text-2xl font-bold text-primary">{t(`${item}.term`)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{t(`${base}.rateLabel`)}</dt>
          <dd className="tabular-price mt-0.5 font-semibold">{t(`${item}.rate`)}</dd>
        </div>
        {offer.facts.map((fact) => (
          <div key={fact}>
            <dt className="text-sm text-muted-foreground">{t(`${base}.facts.${fact}`)}</dt>
            <dd className="mt-0.5 text-sm">{t(`${item}.facts.${fact}`)}</dd>
          </div>
        ))}
      </dl>
      {hasAccordion && (
        <Accordion type="single" collapsible className="mt-4 border-t">
          {offer.details.length > 0 && (
            <AccordionItem value="details">
              <AccordionTrigger className="min-h-11 text-base">{t(`${base}.detailsTitle`)}</AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-3 text-sm">
                  {offer.details.map((detail) => (
                    <div key={detail}>
                      <dt className="font-semibold">{t(`${base}.detailLabels.${detail}`)}</dt>
                      <dd className="mt-0.5 text-muted-foreground">{t(`${item}.details.${detail}`)}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          )}
          {offer.stepCount > 0 && (
            <AccordionItem value="steps">
              <AccordionTrigger className="min-h-11 text-base">{t(`${base}.stepsTitle`)}</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  {Array.from({ length: offer.stepCount }, (_, index) => (
                    <li key={index}>{t(`${item}.steps.${index + 1}`)}</li>
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
