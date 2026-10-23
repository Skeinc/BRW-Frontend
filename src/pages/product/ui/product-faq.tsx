import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';

const FAQ_ITEMS = ['delivery', 'assembly', 'warranty'] as const;

export function ProductFaq() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="product-faq" className="max-w-3xl">
      <h2 id="product-faq" className="text-2xl font-bold tracking-tight">
        {t('product.faq.title')}
      </h2>
      <Accordion type="single" collapsible className="mt-4">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item} value={item}>
            <AccordionTrigger className="min-h-11 text-base">{t(`product.faq.${item}.question`)}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{t(`product.faq.${item}.answer`)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
