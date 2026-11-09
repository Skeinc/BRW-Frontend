import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { PageSection } from '@/shared/ui/page-section';
import { useDeliveryContent } from '../model/use-delivery-content';

export function DeliveryFaq() {
  const { t } = useTranslation();
  const { faq } = useDeliveryContent();
  if (faq.length === 0) {
    return null;
  }
  return (
    <PageSection id="faq" heading={t('pages.deliveryAndPayment.faq.heading')}>
      <Accordion type="single" collapsible className="rounded-xl border bg-card px-6">
        {faq.map((item, index) => (
          <AccordionItem key={index} value={String(index)}>
            <AccordionTrigger className="min-h-11 text-base">{item.question}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageSection>
  );
}
