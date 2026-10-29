import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { MarkdownContent } from '@/shared/ui/markdown-content';
import type { FaqGroup } from '../model/faq-content';

interface FaqGroupSectionProps {
  group: FaqGroup;
  /** Ids of the questions that start open. */
  defaultOpen: readonly string[];
}

export function FaqGroupSection({ group, defaultOpen }: FaqGroupSectionProps) {
  return (
    <section id={`faq-${group.id}`} className="scroll-mt-40">
      <h2 className="text-xl font-bold tracking-tight md:text-2xl">{group.title}</h2>
      <Accordion
        type="multiple"
        defaultValue={[...defaultOpen]}
        className="mt-4 divide-y overflow-hidden rounded-xl border bg-card"
      >
        {group.items.map((item, index) => (
          <AccordionItem key={item.q} value={`${group.id}-${index}`} className="border-b-0">
            <AccordionTrigger className="rounded-none px-5 py-5 text-base font-semibold hover:no-underline hover:text-primary">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="px-5 text-muted-foreground [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
              <MarkdownContent content={item.a} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
