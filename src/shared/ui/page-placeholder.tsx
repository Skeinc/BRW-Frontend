interface PagePlaceholderProps {
  heading: string;
  lead: string;
  children?: React.ReactNode;
}

export function PagePlaceholder({ heading, lead, children }: PagePlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h1>
      <p className="mt-3 text-muted-foreground">{lead}</p>
      {children}
    </section>
  );
}
