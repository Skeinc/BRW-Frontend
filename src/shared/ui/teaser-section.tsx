import { Link, type LinkProps } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface TeaserSectionProps {
  id: string;
  title: string;
  allLabel: string;
  allTo: LinkProps['to'];
  /** The large card: the newest item. */
  featured: ReactNode;
  /** Up to four smaller cards, laid out 2x2 beside the large one. */
  items: readonly { key: string; card: ReactNode }[];
}

/** Home block with a title, an "all" link, one large card and a 2x2 grid of smaller ones. */
export function TeaserSection({ id, title, allLabel, allTo, featured, items }: TeaserSectionProps) {
  return (
    <section aria-labelledby={id} className="mx-auto w-full max-w-7xl px-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id={id} className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        <Link
          to={allTo}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase text-primary hover:underline"
        >
          {allLabel}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:items-center">
        {featured}
        {items.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map(({ key, card }) => (
              <li key={key}>{card}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
