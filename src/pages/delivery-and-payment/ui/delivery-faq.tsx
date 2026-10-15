import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { FAQ_IDS } from '../model/faq-ids';
import { PageSection } from '@/shared/ui/page-section';

export function DeliveryFaq() {
  const { t } = useTranslation();
  const base = 'pages.deliveryAndPayment.faq';
  return (
    <PageSection id="faq" heading={t(`${base}.heading`)}>
      <Accordion type="single" collapsible className="rounded-xl border bg-card px-6">
        {FAQ_IDS.map((id) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger className="min-h-11 text-base">{t(`${base}.items.${id}.q`)}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {t(`${base}.items.${id}.a`)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageSection>
  );
}
