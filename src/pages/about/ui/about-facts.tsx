import { CalendarDays, Package, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AboutFact {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function AboutFacts() {
  const { t } = useTranslation();
  const facts: AboutFact[] = [
    { icon: CalendarDays, value: t('pages.about.facts.years'), label: t('pages.about.facts.yearsLabel') },
    { icon: Package, value: t('pages.about.facts.items'), label: t('pages.about.facts.itemsLabel') },
  ];
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:pb-16">
      <ul className="grid gap-4 md:grid-cols-2">
        {facts.map(({ icon: Icon, value, label }) => (
          <li key={label} className="flex items-center gap-4 rounded-xl border bg-card p-6">
            <Icon aria-hidden className="size-8 shrink-0 text-primary" />
            <div>
              <p className="text-3xl font-bold tabular-nums">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
