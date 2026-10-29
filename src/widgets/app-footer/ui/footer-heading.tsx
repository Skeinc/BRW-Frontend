import type { ReactNode } from 'react';

interface FooterHeadingProps {
  id: string;
  children: ReactNode;
}

export function FooterHeading({ id, children }: FooterHeadingProps) {
  return (
    <p id={id} className="text-xs font-semibold uppercase tracking-widest text-background/60">
      {children}
    </p>
  );
}
