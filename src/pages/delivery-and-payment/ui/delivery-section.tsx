import type { ReactNode } from 'react';

interface DeliverySectionProps {
  id: string;
  heading: string;
  lead?: string;
  children: ReactNode;
}

export function DeliverySection({ id, heading, lead, children }: DeliverySectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="mx-auto w-full max-w-7xl scroll-mt-36 px-4 pb-12 md:pb-16">
      <h2 id={headingId} className="text-2xl font-bold tracking-tight md:text-3xl">
        {heading}
      </h2>
      {lead && <p className="mt-3 max-w-3xl text-muted-foreground">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
